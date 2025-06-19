# AI Product Search Tool

A console-based product search application that uses OpenAI's function calling to filter products based on natural language queries.

## Features

- **Natural Language Processing**: Enter search queries in plain English
- **OpenAI Function Calling**: Leverages AI to interpret user preferences and extract filtering criteria
- **Multiple Filter Types**: Filter by category, price, rating, stock status, and keywords
- **Interactive Console Interface**: Easy-to-use command-line interface
- **Structured Output**: Clean, formatted results display

## Prerequisites

- Node.js (version 14 or higher)
- OpenAI API key

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd 10
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy the example environment file:
     ```bash
     cp env.example .env
     ```
   - Edit `.env` and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_api_key_here
     ```

## Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account or create one
3. Click "Create new secret key"
4. Copy the generated key to your `.env` file

## Usage

### Running the Application

```bash
npm start
```

or

```bash
node index.js
```

### Sample Queries

The application accepts natural language queries. Here are some examples:

- `"I need electronics under $100 that are in stock"`
- `"Show me fitness equipment with good ratings"`
- `"Find books under $30"`
- `"I want kitchen appliances over $50 with rating above 4.5"`
- `"Show me headphones or speakers"`
- `"Find clothing items under $40"`

### How It Works

1. **Input**: You enter a natural language query
2. **AI Processing**: OpenAI analyzes your query and extracts filtering criteria
3. **Function Calling**: The AI calls our `filter_products` function with structured parameters
4. **Filtering**: Products are filtered based on the extracted criteria
5. **Output**: Results are displayed in a clean, structured format

### Available Product Categories

- Electronics
- Fitness
- Kitchen
- Books
- Clothing

### Filtering Options

- **Categories**: Filter by one or more product categories
- **Maximum Price**: Set upper price limits
- **Minimum Rating**: Filter by minimum star rating
- **Stock Status**: Show only in-stock items
- **Keywords**: Search for specific product types

## Technical Details

### OpenAI Function Definition

The application defines a `filter_products` function that OpenAI can call with these parameters:

```javascript
{
  categories: ["Electronics", "Fitness", ...],  // Array of category names
  maxPrice: 100,                                // Maximum price filter
  minRating: 4.0,                              // Minimum rating filter
  inStockOnly: true,                           // Boolean for stock filter
  keywords: ["headphones", "wireless", ...]    // Keywords to search for
}
```

### Data Source

The application uses `products.json` which contains 50 sample products across 5 categories with the following structure:

```json
{
  "name": "Product Name",
  "category": "Category",
  "price": 99.99,
  "rating": 4.5,
  "in_stock": true
}
```

## Error Handling

- **Missing API Key**: The application will display an error message and instructions
- **Network Issues**: Connection errors are caught and displayed to the user
- **Invalid Queries**: The system gracefully handles queries that don't match any products

## Exiting the Application

Type `quit` or `exit` to close the application.

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not set" error**:
   - Ensure your `.env` file exists and contains a valid API key
   - Check that there are no extra spaces around the key

2. **"Error loading products.json"**:
   - Ensure the `products.json` file is in the same directory as `index.js`

3. **Network connection errors**:
   - Check your internet connection
   - Verify your OpenAI API key is valid and has sufficient credits

### Dependencies

- `openai`: Official OpenAI Node.js library
- `dotenv`: Environment variable management
- `fs`, `path`, `readline`: Built-in Node.js modules

## License

MIT License 