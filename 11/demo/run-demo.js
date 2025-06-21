#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

/**
 * Demo runner script - transcribes the sample audio file with OpenAI API
 * Usage: node run-demo.js
 */

async function runDemo() {
  console.log("🎬 Whisper Transcription App - Demo Runner");
  console.log("=============================================\n");

  const audioFile = "CAR0004.mp3";
  const audioPath = path.join(__dirname, audioFile);

  // Check if audio file exists
  if (!fs.existsSync(audioPath)) {
    console.error("❌ Error: Audio file not found:", audioFile);
    console.error("Make sure CAR0004.mp3 is in the demo folder");
    process.exit(1);
  }

  console.log("🚀 Running with OpenAI API calls...");
  console.log(
    "⚠️  Make sure you have set up your .env file with OPENAI_API_KEY\n"
  );

  // Check if .env exists
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ Error: .env file not found");
    console.error(
      "Please copy env.example to .env and add your OpenAI API key"
    );
    console.log("\n📋 Setup instructions:");
    console.log("   1. cd ..");
    console.log("   2. cp env.example .env");
    console.log("   3. Edit .env and add your OpenAI API key");
    console.log("   4. cd demo && node run-demo.js");
    process.exit(1);
  }

  // Run the actual application from parent directory so .env is found
  const parentDir = path.join(__dirname, "..");
  const child = spawn("node", ["index.js", `demo/${audioFile}`], {
    cwd: parentDir,
    stdio: "inherit",
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log("\n✅ Demo completed successfully!");
      console.log("Check the generated files in the demo folder.");
    } else {
      console.log("\n❌ Demo failed with code:", code);
    }
  });
}

// Help text
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Whisper Transcription App - Demo Runner");
  console.log("======================================");
  console.log("");
  console.log("Usage:");
  console.log("  node run-demo.js    Run demo with OpenAI API calls");
  console.log("  node run-demo.js --help    Show this help");
  console.log("");
  console.log("Requires OpenAI API key setup in .env file.");
  console.log("Transcribes the sample CAR0004.mp3 audio file.");
  process.exit(0);
}

runDemo().catch(console.error);
