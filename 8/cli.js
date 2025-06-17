#!/usr/bin/env node

/**
 * CLI Tool for Interactive Validation Testing
 * Allows users to quickly test validation rules from command line
 */

const { Schema } = require("./schema.js");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🔧 Validation Library CLI Tool

Usage:
  node cli.js string "test@example.com" email     # Test email validation
  node cli.js number 25 min:0 max:100           # Test number with range
  node cli.js object '{"name":"John","age":25}'  # Test object validation
  
Examples:
  node cli.js string "hello" minLength:3 maxLength:10
  node cli.js number -5 positive
  node cli.js string "user@domain.com" email
  node cli.js array "[1,2,3]" minLength:2
  
Available validators:
  string: minLength, maxLength, pattern, notEmpty, email, url
  number: min, max, positive, negative, integer
  boolean: true, false
  array: minLength, maxLength, notEmpty
  object: (requires schema definition)
  
Flags:
  --optional    Make the validator optional
  --message     Custom error message
`);
  process.exit(0);
}

const [type, value, ...validators] = args;

try {
  let schema;
  let testValue;

  // Parse the test value
  try {
    if (type === "object" || type === "array") {
      testValue = JSON.parse(value);
    } else if (type === "number") {
      testValue = parseFloat(value);
    } else if (type === "boolean") {
      testValue = value === "true";
    } else {
      testValue = value;
    }
  } catch (e) {
    console.error("❌ Error parsing value:", e.message);
    process.exit(1);
  }

  // Create base schema
  switch (type) {
    case "string":
      schema = Schema.string();
      break;
    case "number":
      schema = Schema.number();
      break;
    case "boolean":
      schema = Schema.boolean();
      break;
    case "array":
      schema = Schema.array(Schema.string()); // Default to string array
      break;
    case "object":
      // Simple object validation
      schema = Schema.object({});
      break;
    default:
      console.error("❌ Unknown type:", type);
      console.log("Supported types: string, number, boolean, array, object");
      process.exit(1);
  }

  // Apply validators
  for (const validator of validators) {
    const [method, param] = validator.split(":");

    switch (method) {
      case "minLength":
        schema = schema.minLength(parseInt(param));
        break;
      case "maxLength":
        schema = schema.maxLength(parseInt(param));
        break;
      case "min":
        schema = schema.min(parseFloat(param));
        break;
      case "max":
        schema = schema.max(parseFloat(param));
        break;
      case "pattern":
        schema = schema.pattern(new RegExp(param));
        break;
      case "email":
        schema = schema.email();
        break;
      case "url":
        schema = schema.url();
        break;
      case "notEmpty":
        schema = schema.notEmpty();
        break;
      case "positive":
        schema = schema.positive();
        break;
      case "negative":
        schema = schema.negative();
        break;
      case "integer":
        schema = schema.integer();
        break;
      case "true":
        schema = schema.true();
        break;
      case "false":
        schema = schema.false();
        break;
      case "optional":
        schema = schema.optional();
        break;
      case "message":
        schema = schema.withMessage(param);
        break;
      default:
        console.warn("⚠️  Unknown validator:", method);
    }
  }

  // Run validation
  console.log(`\n🔍 Testing ${type} validation:`);
  console.log(`📝 Value: ${JSON.stringify(testValue)}`);
  console.log(`🛠️  Validators: ${validators.join(", ") || "none"}`);

  const result = schema.validate(testValue);

  console.log("\n📊 Result:");
  if (result.isValid) {
    console.log("✅ Valid: true");
  } else {
    console.log("❌ Valid: false");
    console.log("🚫 Errors:");
    result.errors.forEach((error) => console.log(`   - ${error}`));
  }
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
