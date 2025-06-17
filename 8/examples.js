/**
 * Simple Examples - Getting Started with the Validation Library
 * Copy and run these examples to learn how to use the library
 */

const { Schema } = require("./schema.js");

console.log("📖 Simple Examples - Getting Started\n");

// Example 1: Basic String Validation
console.log("1️⃣ Basic String Validation");
const nameValidator = Schema.string().minLength(2);
console.log("✅", nameValidator.validate("John")); // Valid
console.log("❌", nameValidator.validate("J")); // Too short
console.log();

// Example 2: Email Validation
console.log("2️⃣ Email Validation");
const emailValidator = Schema.string().email();
console.log("✅", emailValidator.validate("user@example.com")); // Valid
console.log("❌", emailValidator.validate("not-an-email")); // Invalid
console.log();

// Example 3: Number Validation
console.log("3️⃣ Number Validation");
const ageValidator = Schema.number().min(0).max(120);
console.log("✅", ageValidator.validate(25)); // Valid
console.log("❌", ageValidator.validate(-5)); // Negative
console.log("❌", ageValidator.validate(150)); // Too high
console.log();

// Example 4: Object Validation
console.log("4️⃣ Object Validation");
const userValidator = Schema.object({
  name: Schema.string().minLength(2),
  email: Schema.string().email(),
  age: Schema.number().min(0).optional(),
});

const validUser = { name: "Alice", email: "alice@test.com", age: 30 };
const invalidUser = { name: "A", email: "bad-email" };

console.log("✅ Valid user:", userValidator.validate(validUser));
console.log("❌ Invalid user:", userValidator.validate(invalidUser));
console.log();

// Example 5: Array Validation
console.log("5️⃣ Array Validation");
const tagsValidator = Schema.array(Schema.string()).minLength(1);
console.log("✅", tagsValidator.validate(["javascript", "node"])); // Valid
console.log("❌", tagsValidator.validate([])); // Empty
console.log();

// Example 6: Optional Fields
console.log("6️⃣ Optional Fields");
const profileValidator = Schema.object({
  username: Schema.string(),
  bio: Schema.string().optional(), // This field can be missing
});

console.log(
  "✅ With bio:",
  profileValidator.validate({ username: "john", bio: "Developer" })
);
console.log("✅ Without bio:", profileValidator.validate({ username: "john" }));
console.log();

// Example 7: Custom Error Messages
console.log("7️⃣ Custom Error Messages");
const passwordValidator = Schema.string()
  .minLength(8)
  .withMessage("Password must be at least 8 characters long");

console.log("❌ Custom message:", passwordValidator.validate("123"));
console.log();

console.log("🎉 Try modifying these examples and run: node examples.js");
console.log("📚 For more examples, run: node demo.js");
console.log("🔧 For CLI testing, run: node cli.js");
