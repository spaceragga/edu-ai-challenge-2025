#!/usr/bin/env node

const OpenAI = require("openai");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

class ServiceAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getServiceAnalysis(input, isServiceName = false) {
    const spinner = ora("Analyzing service and generating report...").start();

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert business analyst specializing in digital services and products. You provide comprehensive, well-structured analysis reports.",
          },
          {
            role: "user",
            content: `Generate a comprehensive markdown-formatted analysis report for the following ${
              isServiceName ? "service" : "service description"
            }:

${isServiceName ? `Service Name: ${input}` : `Service Description: ${input}`}

Please structure your response as a proper markdown report with the following sections (use ## for section headers):

## Brief History
Provide founding year, key milestones, and important developments.

## Target Audience
Identify and describe the primary user segments and demographics.

## Core Features
List and explain the top 2-4 key functionalities that define this service.

## Unique Selling Points
Highlight the key differentiators that set this service apart from competitors.

## Business Model
Explain how the service generates revenue and monetizes its offerings.

## Tech Stack Insights
Provide insights about the technologies, platforms, or technical approaches used.

## Perceived Strengths
List the standout features, advantages, and positive aspects frequently mentioned.

## Perceived Weaknesses
Identify commonly cited drawbacks, limitations, or areas for improvement.

Make sure each section is detailed, informative, and professionally written. Use bullet points where appropriate for better readability.`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      spinner.succeed("Analysis complete!");
      return response.choices[0].message.content;
    } catch (error) {
      spinner.fail("Failed to generate analysis");
      throw error;
    }
  }

  async saveReport(report, filename) {
    try {
      const outputDir = path.join(__dirname, "reports");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, report, "utf8");
      console.log(chalk.green(`\n📄 Report saved to: ${filepath}`));
    } catch (error) {
      console.error(chalk.red("Failed to save report:"), error.message);
    }
  }

  displayWelcome() {
    console.log(chalk.blue.bold("\n🔍 Service Analyzer"));
    console.log(
      chalk.gray(
        "Generate comprehensive analysis reports for digital services\n"
      )
    );
  }

  async run() {
    this.displayWelcome();

    try {
      // Check if API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.error(chalk.red("❌ OpenAI API key not found!"));
        console.log(
          chalk.yellow("Please set your OPENAI_API_KEY environment variable.")
        );
        console.log(
          chalk.gray('Example: export OPENAI_API_KEY="your-api-key-here"')
        );
        process.exit(1);
      }

      const { inputType } = await inquirer.prompt([
        {
          type: "list",
          name: "inputType",
          message: "What would you like to analyze?",
          choices: [
            {
              name: "Known service name (e.g., Spotify, Notion)",
              value: "service",
            },
            { name: "Custom service description text", value: "description" },
          ],
        },
      ]);

      let input, isServiceName;

      if (inputType === "service") {
        const { serviceName } = await inquirer.prompt([
          {
            type: "input",
            name: "serviceName",
            message: "Enter the service name:",
            validate: (input) =>
              input.trim() ? true : "Please enter a service name",
          },
        ]);
        input = serviceName.trim();
        isServiceName = true;
      } else {
        const { description } = await inquirer.prompt([
          {
            type: "editor",
            name: "description",
            message:
              "Enter the service description (this will open your default editor):",
            validate: (input) =>
              input.trim() ? true : "Please enter a service description",
          },
        ]);
        input = description.trim();
        isServiceName = false;
      }

      // Generate analysis
      const report = await this.getServiceAnalysis(input, isServiceName);

      // Display report
      console.log(chalk.green("\n" + "=".repeat(50)));
      console.log(chalk.green.bold("ANALYSIS REPORT"));
      console.log(chalk.green("=".repeat(50)));
      console.log(report);
      console.log(chalk.green("=".repeat(50)));

      // Ask if user wants to save
      const { save } = await inquirer.prompt([
        {
          type: "confirm",
          name: "save",
          message: "Would you like to save this report to a file?",
          default: true,
        },
      ]);

      if (save) {
        const serviceName = isServiceName ? input : "custom-service";
        const filename = `${serviceName
          .toLowerCase()
          .replace(/\s+/g, "-")}-analysis-${Date.now()}.md`;
        await this.saveReport(report, filename);
      }

      console.log(chalk.blue("\n✨ Thank you for using Service Analyzer!"));
    } catch (error) {
      console.error(chalk.red("\n❌ An error occurred:"), error.message);
      process.exit(1);
    }
  }
}

// Handle command line arguments
if (require.main === module) {
  const analyzer = new ServiceAnalyzer();
  analyzer.run();
}

module.exports = ServiceAnalyzer;
