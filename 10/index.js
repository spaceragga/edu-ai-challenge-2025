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
  const { categories, maxPrice, minRating, inStockOnly, keywords } = criteria;

  let filtered = products;

  // Filter by categories
  if (categories && categories.length > 0) {
    filtered = filtered.filter((product) =>
      categories.some(
        (cat) => product.category.toLowerCase() === cat.toLowerCase()
      )
    );
  }

  // Filter by max price
  if (maxPrice !== undefined) {
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }

  // Filter by min rating
  if (minRating !== undefined) {
    filtered = filtered.filter((product) => product.rating >= minRating);
  }

  // Filter by stock status
  if (inStockOnly) {
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
      maxPrice: {
        type: "number",
        description: "Maximum price for products",
      },
      minRating: {
        type: "number",
        description: "Minimum rating for products",
      },
      inStockOnly: {
        type: "boolean",
        description: "Whether to only include products that are in stock",
      },
      keywords: {
        type: "array",
        items: { type: "string" },
        description: "Keywords to search for in product names",
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
- Price ranges (convert phrases like "under $200" to maxPrice: 200)
- Categories mentioned or implied
- Rating requirements (convert phrases like "good rating" to minRating: 4.0)
- Stock availability preferences
- Keywords for specific product types

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
