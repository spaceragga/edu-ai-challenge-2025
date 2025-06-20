const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
require("dotenv").config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load products data
let products;
try {
  const productsData = fs.readFileSync(
    path.join(__dirname, "products.json"),
    "utf8"
  );
  products = JSON.parse(productsData);
} catch (error) {
  console.error("Error loading products.json:", error.message);
  process.exit(1);
}

// Function that will be called by OpenAI to filter products
function filterProducts(criteria) {
  const {
    categories,
    excludeCategories,
    maxPrice,
    minPrice,
    priceRange,
    minRating,
    inStockOnly,
    stockStatus,
    keywords,
    excludeKeywords,
    sortBy,
    order,
    limit,
  } = criteria;

  let filtered = products;

  // Filter by categories
  if (categories && categories.length > 0) {
    filtered = filtered.filter((product) =>
      categories.some(
        (cat) => product.category.toLowerCase() === cat.toLowerCase()
      )
    );
  }

  // Exclude categories
  if (excludeCategories && excludeCategories.length > 0) {
    filtered = filtered.filter(
      (product) =>
        !excludeCategories.some(
          (cat) => product.category.toLowerCase() === cat.toLowerCase()
        )
    );
  }

  // Filter by price range (takes precedence over individual min/max)
  if (priceRange) {
    if (priceRange.min !== undefined) {
      filtered = filtered.filter((product) => product.price >= priceRange.min);
    }
    if (priceRange.max !== undefined) {
      filtered = filtered.filter((product) => product.price <= priceRange.max);
    }
  } else {
    // Filter by individual price limits
    if (maxPrice !== undefined) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }
    if (minPrice !== undefined) {
      filtered = filtered.filter((product) => product.price >= minPrice);
    }
  }

  // Filter by min rating
  if (minRating !== undefined) {
    filtered = filtered.filter((product) => product.rating >= minRating);
  }

  // Filter by stock status
  if (stockStatus) {
    switch (stockStatus) {
      case "in_stock":
        filtered = filtered.filter((product) => product.in_stock === true);
        break;
      case "out_of_stock":
        filtered = filtered.filter((product) => product.in_stock === false);
        break;
      case "any":
        // No filtering needed
        break;
    }
  } else if (inStockOnly) {
    // Backward compatibility
    filtered = filtered.filter((product) => product.in_stock === true);
  }

  // Filter by keywords in product name
  if (keywords && keywords.length > 0) {
    filtered = filtered.filter((product) =>
      keywords.some((keyword) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  // Exclude keywords from product name
  if (excludeKeywords && excludeKeywords.length > 0) {
    filtered = filtered.filter(
      (product) =>
        !excludeKeywords.some((keyword) =>
          product.name.toLowerCase().includes(keyword.toLowerCase())
        )
    );
  }

  // Sort the filtered results
  if (sortBy) {
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (order === "desc") {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  }

  // Limit results if specified
  if (limit && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

// Function definition for OpenAI
const functionDefinition = {
  name: "filter_products",
  description: "Filter products based on user preferences and criteria",
  parameters: {
    type: "object",
    properties: {
      categories: {
        type: "array",
        items: { type: "string" },
        description:
          "Product categories to filter by (Electronics, Fitness, Kitchen, Books, Clothing)",
      },
      excludeCategories: {
        type: "array",
        items: { type: "string" },
        description: "Product categories to exclude from results",
      },
      maxPrice: {
        type: "number",
        description: "Maximum price for products",
      },
      minPrice: {
        type: "number",
        description: "Minimum price for products",
      },
      priceRange: {
        type: "object",
        properties: {
          min: {
            type: "number",
            description: "Minimum price in the range",
          },
          max: {
            type: "number",
            description: "Maximum price in the range",
          },
        },
        description:
          "Price range filter (overrides minPrice/maxPrice if provided)",
      },
      minRating: {
        type: "number",
        description: "Minimum rating for products (0-5 scale)",
      },
      inStockOnly: {
        type: "boolean",
        description:
          "Whether to only include products that are in stock (deprecated - use stockStatus)",
      },
      stockStatus: {
        type: "string",
        enum: ["in_stock", "out_of_stock", "any"],
        description:
          "Filter by stock availability - 'in_stock' for available items, 'out_of_stock' for unavailable items, 'any' for both",
      },
      keywords: {
        type: "array",
        items: { type: "string" },
        description: "Keywords to search for in product names",
      },
      excludeKeywords: {
        type: "array",
        items: { type: "string" },
        description: "Keywords to exclude from product names",
      },
      sortBy: {
        type: "string",
        enum: ["price", "rating", "name"],
        description: "Field to sort by (price, rating, or name)",
      },
      order: {
        type: "string",
        enum: ["asc", "desc"],
        description: "Sort order - 'asc' for ascending, 'desc' for descending",
      },
      limit: {
        type: "number",
        description: "Maximum number of results to return",
      },
    },
    required: [],
  },
};

async function searchProducts(userQuery) {
  try {
    const systemPrompt = `You are a product search assistant. Based on the user's natural language query, you need to call the filter_products function with appropriate criteria.

Available product categories: Electronics, Fitness, Kitchen, Books, Clothing

Extract filtering criteria from the user's request and call the function accordingly. Consider:

PRICE FILTERING:
- "under $200" → maxPrice: 200
- "over $50" → minPrice: 50  
- "between $50 and $200" → priceRange: {min: 50, max: 200}
- "around $100" → priceRange: {min: 90, max: 110}

CATEGORY FILTERING:
- "electronics" → categories: ["Electronics"]
- "everything except books" → excludeCategories: ["Books"]
- "not clothing" → excludeCategories: ["Clothing"]

RATING FILTERING:
- "good rating" / "well rated" → minRating: 4.0
- "excellent rating" → minRating: 4.5
- "highly rated" → minRating: 4.3

STOCK FILTERING:
- "in stock" / "available" → stockStatus: "in_stock"
- "out of stock" → stockStatus: "out_of_stock"  
- "what's actually available" → stockStatus: "in_stock"

KEYWORD FILTERING:
- "blender" → keywords: ["blender"]
- "not blenders" → excludeKeywords: ["blender"]
- "cooking breakfast" → keywords: ["coffee", "toaster", "kettle"]

SORTING:
- "most expensive" → sortBy: "price", order: "desc"
- "cheapest" → sortBy: "price", order: "asc"
- "best rated" → sortBy: "rating", order: "desc" 
- "worst rated" → sortBy: "rating", order: "asc"
- "alphabetically" → sortBy: "name", order: "asc"

LIMITS:
- "the most expensive" → limit: 1
- "top 5" / "best 3" → limit: 5 or 3
- "cheapest option" → limit: 1

Current product data includes: ${products.length} products across ${[
      ...new Set(products.map((p) => p.category)),
    ].join(", ")} categories.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery },
      ],
      functions: [functionDefinition],
      function_call: { name: "filter_products" },
    });

    const functionCall = response.choices[0].message.function_call;

    if (functionCall && functionCall.name === "filter_products") {
      const criteria = JSON.parse(functionCall.arguments);
      console.log("\nSearch Criteria Detected:");
      console.log(JSON.stringify(criteria, null, 2));

      const filteredProducts = filterProducts(criteria);
      return filteredProducts;
    }

    throw new Error("No function call was made");
  } catch (error) {
    console.error("Error searching products:", error.message);
    return [];
  }
}

function displayProducts(products) {
  if (products.length === 0) {
    console.log("\nNo products found matching your criteria.");
    return;
  }

  console.log("\nFiltered Products:");
  products.forEach((product, index) => {
    const stockStatus = product.in_stock ? "In Stock" : "Out of Stock";
    console.log(
      `${index + 1}. ${product.name} - $${product.price}, Rating: ${
        product.rating
      }, ${stockStatus}`
    );
  });
}

async function main() {
  console.log("🔍 AI Product Search Tool");
  console.log(
    "Using OpenAI Function Calling for Natural Language Product Filtering"
  );
  console.log("=====================================\n");

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Error: OPENAI_API_KEY environment variable is not set.");
    console.log("Please create a .env file with your OpenAI API key:");
    console.log("OPENAI_API_KEY=your_api_key_here");
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`Loaded ${products.length} products from the database.`);
  console.log(
    "Available categories:",
    [...new Set(products.map((p) => p.category))].join(", ")
  );
  console.log(
    '\nEnter your search preferences in natural language (e.g., "I need electronics under $100 that are in stock")'
  );
  console.log('Type "quit" or "exit" to stop.\n');

  const askQuestion = () => {
    rl.question("🔍 Search: ", async (query) => {
      if (query.toLowerCase() === "quit" || query.toLowerCase() === "exit") {
        console.log("Thank you for using AI Product Search! 👋");
        rl.close();
        return;
      }

      if (query.trim() === "") {
        console.log("Please enter a search query.");
        askQuestion();
        return;
      }

      console.log("\n⏳ Searching products...");

      const results = await searchProducts(query);
      displayProducts(results);

      console.log("\n" + "=".repeat(50) + "\n");
      askQuestion();
    });
  };

  askQuestion();
}

if (require.main === module) {
  main();
}
