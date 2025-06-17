#!/usr/bin/env node

/**
 * Interactive Demo for Robust Validation Library
 * Shows practical examples of how to use the validation library
 */

const { Schema } = require("./schema.js");

console.log("🚀 Welcome to the Robust Validation Library Demo!\n");

// Demo 1: Basic Validation Examples
console.log("=== 📝 Basic Validation Examples ===\n");

// String validation
console.log("1. String Validation:");
const nameValidator = Schema.string().minLength(2).maxLength(50);
console.log("   Validator: Schema.string().minLength(2).maxLength(50)");
console.log('   ✅ "John Doe":', nameValidator.validate("John Doe"));
console.log('   ❌ "J":', nameValidator.validate("J"));
console.log("   ❌ null:", nameValidator.validate(null));
console.log();

// Email validation
console.log("2. Email Validation:");
const emailValidator = Schema.string().email();
console.log("   Validator: Schema.string().email()");
console.log(
  '   ✅ "user@example.com":',
  emailValidator.validate("user@example.com")
);
console.log('   ❌ "invalid-email":', emailValidator.validate("invalid-email"));
console.log();

// Number validation
console.log("3. Number Validation:");
const ageValidator = Schema.number().min(0).max(120);
console.log("   Validator: Schema.number().min(0).max(120)");
console.log("   ✅ 25:", ageValidator.validate(25));
console.log("   ❌ -5:", ageValidator.validate(-5));
console.log("   ❌ 150:", ageValidator.validate(150));
console.log();

// Demo 2: Complex Object Validation
console.log("=== 🏗️ Complex Object Validation ===\n");

const userSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().email(),
  age: Schema.number().min(0).max(150).optional(),
  isActive: Schema.boolean(),
  preferences: Schema.object({
    theme: Schema.oneOf(Schema.literal("light"), Schema.literal("dark")),
    notifications: Schema.boolean(),
  }),
  tags: Schema.array(Schema.string()).minLength(1).maxLength(10),
  address: Schema.object({
    street: Schema.string().notEmpty(),
    city: Schema.string().notEmpty(),
    postalCode: Schema.string().pattern(/^\d{5}$/),
  }).optional(),
});

console.log("User Schema Definition:");
console.log(`const userSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().email(),
  age: Schema.number().min(0).max(150).optional(),
  isActive: Schema.boolean(),
  preferences: Schema.object({
    theme: Schema.oneOf(Schema.literal('light'), Schema.literal('dark')),
    notifications: Schema.boolean()
  }),
  tags: Schema.array(Schema.string()).minLength(1).maxLength(10),
  address: Schema.object({
    street: Schema.string().notEmpty(),
    city: Schema.string().notEmpty(),
    postalCode: Schema.string().pattern(/^\d{5}$/)
  }).optional()
});`);
console.log();

// Valid user example
const validUser = {
  id: "usr_12345",
  name: "Alice Johnson",
  email: "alice@example.com",
  age: 28,
  isActive: true,
  preferences: {
    theme: "dark",
    notifications: true,
  },
  tags: ["developer", "javascript", "react"],
  address: {
    street: "123 Main Street",
    city: "San Francisco",
    postalCode: "94105",
  },
};

console.log("✅ Valid User Example:");
console.log(JSON.stringify(validUser, null, 2));
const validResult = userSchema.validate(validUser);
console.log("Validation Result:", validResult);
console.log();

// Invalid user example
const invalidUser = {
  id: 12345, // Should be string
  name: "A", // Too short
  email: "invalid-email", // Invalid format
  age: -5, // Negative age
  isActive: "yes", // Should be boolean
  preferences: {
    theme: "blue", // Invalid theme
    notifications: "true", // Should be boolean
  },
  tags: [], // Empty array
  address: {
    street: "", // Empty street
    city: "San Francisco",
    postalCode: "9410", // Invalid postal code
  },
};

console.log("❌ Invalid User Example:");
console.log(JSON.stringify(invalidUser, null, 2));
const invalidResult = userSchema.validate(invalidUser);
console.log("Validation Result:");
console.log("  Valid:", invalidResult.isValid);
console.log("  Errors:");
invalidResult.errors.forEach((error) => console.log(`    - ${error}`));
console.log();

// Demo 3: Array Validation
console.log("=== 📋 Array Validation Examples ===\n");

const productSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().notEmpty(),
  price: Schema.number().positive(),
  tags: Schema.array(Schema.string()).optional(),
  inStock: Schema.boolean(),
});

const cartSchema = Schema.object({
  userId: Schema.string(),
  items: Schema.array(productSchema).minLength(1),
  total: Schema.number().positive(),
  coupon: Schema.string().optional(),
});

console.log("Shopping Cart Schema:");
const validCart = {
  userId: "usr_789",
  items: [
    {
      id: "prod_1",
      name: "JavaScript Book",
      price: 29.99,
      tags: ["programming", "javascript"],
      inStock: true,
    },
    {
      id: "prod_2",
      name: "Coffee Mug",
      price: 12.5,
      inStock: true,
    },
  ],
  total: 42.49,
};

console.log("✅ Valid Cart:");
console.log(JSON.stringify(validCart, null, 2));
console.log("Validation Result:", cartSchema.validate(validCart));
console.log();

// Demo 4: Custom Error Messages
console.log("=== 💬 Custom Error Messages ===\n");

const passwordSchema = Schema.string()
  .minLength(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage(
    "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
  );

console.log("Password Validator with Custom Message:");
console.log("✅ Strong password:", passwordSchema.validate("MyPass123!"));
console.log("❌ Weak password:", passwordSchema.validate("weak"));
console.log();

// Demo 5: Optional Fields
console.log("=== ❓ Optional Fields Demo ===\n");

const profileSchema = Schema.object({
  username: Schema.string().minLength(3),
  email: Schema.string().email(),
  bio: Schema.string().maxLength(200).optional(),
  website: Schema.string().url().optional(),
  age: Schema.number().min(13).optional(),
});

const minimalProfile = {
  username: "johndev",
  email: "john@dev.com",
};

const fullProfile = {
  username: "alicedev",
  email: "alice@dev.com",
  bio: "Full-stack developer passionate about JavaScript",
  website: "https://alice.dev",
  age: 25,
};

console.log("Profile Schema (with optional fields):");
console.log(
  "✅ Minimal Profile (only required fields):",
  profileSchema.validate(minimalProfile)
);
console.log(
  "✅ Full Profile (with optional fields):",
  profileSchema.validate(fullProfile)
);
console.log();

// Demo 6: Union Types and Literals
console.log("=== 🔄 Union Types and Literals ===\n");

const statusSchema = Schema.oneOf(
  Schema.literal("draft"),
  Schema.literal("published"),
  Schema.literal("archived")
);

const mixedContentSchema = Schema.oneOf(
  Schema.string(),
  Schema.number(),
  Schema.object({
    type: Schema.literal("rich_text"),
    content: Schema.string(),
  })
);

console.log("Status Validation (literals):");
console.log('✅ "published":', statusSchema.validate("published"));
console.log('❌ "invalid":', statusSchema.validate("invalid"));
console.log();

console.log("Mixed Content Validation (union):");
console.log("✅ String:", mixedContentSchema.validate("Hello World"));
console.log("✅ Number:", mixedContentSchema.validate(42));
console.log(
  "✅ Rich Text:",
  mixedContentSchema.validate({
    type: "rich_text",
    content: "<p>Hello <b>World</b></p>",
  })
);
console.log("❌ Invalid:", mixedContentSchema.validate({ invalid: true }));
console.log();

// Demo 7: Performance Test
console.log("=== ⚡ Performance Demo ===\n");

console.log("Testing validation performance with large dataset...");
const largeArrayValidator = Schema.array(Schema.number().min(0));
const largeArray = Array.from({ length: 10000 }, (_, i) => i);

const startTime = Date.now();
const perfResult = largeArrayValidator.validate(largeArray);
const endTime = Date.now();

console.log(
  `✅ Validated ${largeArray.length} numbers in ${endTime - startTime}ms`
);
console.log("Result:", {
  isValid: perfResult.isValid,
  errorCount: perfResult.errors.length,
});
console.log();

// Demo 8: Real-world API Validation Example
console.log("=== 🌐 Real-world API Validation Example ===\n");

const apiRequestSchema = Schema.object({
  method: Schema.oneOf(
    Schema.literal("GET"),
    Schema.literal("POST"),
    Schema.literal("PUT"),
    Schema.literal("DELETE")
  ),
  url: Schema.string().url(),
  headers: Schema.object({
    "Content-Type": Schema.string().optional(),
    Authorization: Schema.string().optional(),
  }).optional(),
  body: Schema.oneOf(Schema.string(), Schema.object({}).optional()).optional(),
  timeout: Schema.number().min(0).max(30000).optional(),
});

const validApiRequest = {
  method: "POST",
  url: "https://api.example.com/users",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
  },
  body: {
    name: "John Doe",
    email: "john@example.com",
  },
  timeout: 5000,
};

console.log("API Request Validation:");
console.log(
  "✅ Valid API Request:",
  apiRequestSchema.validate(validApiRequest)
);
console.log();

console.log("🎉 Demo Complete! The validation library is ready to use.\n");
console.log("📚 Check README.md for complete documentation and examples.");
console.log('🧪 Run "npm test" to see all test cases.');
console.log('📊 Run "npm run coverage" to see test coverage report.');
console.log("\n💡 Try creating your own schemas and validation rules!");
