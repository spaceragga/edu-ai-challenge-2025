# Service Analyzer

A lightweight console application that generates comprehensive, markdown-formatted analysis reports for digital services and products using AI.

## Features

- **Dual Input Support**: Accept either known service names (e.g., "Spotify", "Notion") or raw service description text
- **Comprehensive Analysis**: Generate reports with 8 detailed sections covering business, technical, and user perspectives
- **Interactive CLI**: User-friendly prompts and colorful output
- **Report Export**: Save generated reports as markdown files
- **Environment Security**: API key stored securely via environment variables

## Generated Report Sections

Each analysis includes:

1. **Brief History** - Founding year, milestones, key developments
2. **Target Audience** - Primary user segments and demographics  
3. **Core Features** - Top 2-4 key functionalities
4. **Unique Selling Points** - Key differentiators from competitors
5. **Business Model** - Revenue generation and monetization strategy
6. **Tech Stack Insights** - Technologies and technical approaches used
7. **Perceived Strengths** - Standout features and advantages
8. **Perceived Weaknesses** - Common drawbacks and limitations

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- OpenAI API key

## Installation

1. **Clone or download the project**
   ```bash
   cd 9/
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key**
   
   **Option 1: Environment Variable (Recommended)**
   ```bash
   # On Windows (Command Prompt)
   set OPENAI_API_KEY=your-api-key-here
   
   # On Windows (PowerShell)
   $env:OPENAI_API_KEY="your-api-key-here"
   
   # On macOS/Linux
   export OPENAI_API_KEY="your-api-key-here"
   ```
   
   **Option 2: .env file**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env and replace with your actual API key
   OPENAI_API_KEY=your-actual-api-key-here
   ```

## Usage

### Basic Usage

Run the application:
```bash
npm start
```

Or directly with Node:
```bash
node index.js
```

### Interactive Flow

1. **Choose input type**: Select between known service name or custom description
2. **Provide input**: 
   - For service names: Enter the name (e.g., "Spotify", "Discord", "Figma")
   - For descriptions: Your default editor will open for multi-line text input
3. **Wait for analysis**: The AI will process your input and generate the report
4. **View results**: The formatted report will be displayed in your terminal
5. **Save option**: Choose whether to save the report as a markdown file

### Example Commands

```bash
# Start the application
npm start

# The app will guide you through:
# 1. Selecting input type (service name vs description)
# 2. Entering your input
# 3. Viewing the generated report
# 4. Optionally saving to file
```

## Sample Service Names

Try analyzing these popular services:
- **Productivity**: Notion, Trello, Slack, Asana
- **Entertainment**: Spotify, Netflix, YouTube, Discord
- **Development**: GitHub, GitLab, Vercel, Figma
- **Communication**: Zoom, Microsoft Teams, WhatsApp
- **Finance**: PayPal, Stripe, Robinhood, Coinbase

## Output Format

Reports are generated in clean markdown format with:
- Proper section headers (`##`)
- Bullet points for lists
- Professional, detailed content
- Structured analysis across all required sections

## File Structure

```
9/
├── index.js              # Main application file
├── package.json          # Dependencies and scripts
├── env.example          # Environment variable example
├── README.md            # This file
├── sample_outputs.md    # Sample report examples
└── reports/            # Generated reports (created automatically)
```

## Troubleshooting

### Common Issues

**"OpenAI API key not found"**
- Ensure your API key is set as an environment variable
- Check that the key starts with `sk-`
- Verify the key is valid and has sufficient credits

**"Failed to generate analysis"**
- Check your internet connection
- Verify your API key has not exceeded rate limits
- Ensure you're using a supported OpenAI model

**Editor not opening for custom descriptions**
- Set your default editor: `export EDITOR=nano` (or `code`, `vim`, etc.)
- You can also use the command line version instead

### Getting Help

If you encounter issues:
1. Check that all dependencies are installed: `npm install`
2. Verify your Node.js version: `node --version`
3. Ensure your API key is properly configured
4. Check the console for detailed error messages

## API Usage

This application uses the OpenAI GPT-4 model for analysis generation. Each analysis typically consumes 1,000-2,000 tokens depending on the complexity of the service being analyzed.

## Security Notes

- **Never commit your API key to version control**
- Use environment variables or .env files (add .env to .gitignore)
- Keep your API key secure and don't share it
- Monitor your OpenAI usage to avoid unexpected charges

## License

MIT License - feel free to modify and distribute as needed.

## Development

To extend or modify the application:
- The main logic is in `index.js`
- Prompts can be customized in the `buildPrompt()` method
- Additional output formats can be added to the `saveReport()` method
- UI improvements can be made using the chalk and inquirer libraries 