/**
 * Comprehensive Test Suite for Validation Library
 * Tests all validator types and edge cases to ensure robust validation
 */

const {
  Schema,
  Validator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator,
} = require("./schema.js");

/**
 * Test helper functions
 */
function expectValid(result) {
  if (!result.isValid) {
    throw new Error(
      `Expected valid but got errors: ${result.errors.join(", ")}`
    );
  }
}

function expectInvalid(result, expectedErrorCount = null) {
  if (result.isValid) {
    throw new Error("Expected invalid but validation passed");
  }
  if (
    expectedErrorCount !== null &&
    result.errors.length !== expectedErrorCount
  ) {
    throw new Error(
      `Expected ${expectedErrorCount} errors but got ${result.errors.length}`
    );
  }
}

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`✓ ${testName}`);
    return true;
  } catch (error) {
    console.log(`✗ ${testName}: ${error.message}`);
    return false;
  }
}

let passedTests = 0;
let totalTests = 0;

/**
 * Base Validator Tests
 */
console.log("\n=== Base Validator Tests ===");

totalTests++;
passedTests += runTest("Base validator - required value", () => {
  const validator = new Validator();
  expectInvalid(validator.validate(null));
  expectInvalid(validator.validate(undefined));
});

totalTests++;
passedTests += runTest("Base validator - optional value", () => {
  const validator = new Validator().optional();
  expectValid(validator.validate(null));
  expectValid(validator.validate(undefined));
});

totalTests++;
passedTests += runTest("Base validator - custom message", () => {
  const validator = new Validator().withMessage("Custom error message");
  const result = validator.validate(null);
  expectInvalid(result);
  if (!result.errors.includes("Custom error message")) {
    throw new Error(`Expected custom error message, got: ${result.errors[0]}`);
  }
});

/**
 * String Validator Tests
 */
console.log("\n=== String Validator Tests ===");

totalTests++;
passedTests += runTest("String validator - valid string", () => {
  const validator = Schema.string();
  expectValid(validator.validate("hello"));
  expectValid(validator.validate(""));
  expectValid(validator.validate("123"));
});

totalTests++;
passedTests += runTest("String validator - invalid types", () => {
  const validator = Schema.string();
  expectInvalid(validator.validate(123));
  expectInvalid(validator.validate(true));
  expectInvalid(validator.validate({}));
  expectInvalid(validator.validate([]));
});

totalTests++;
passedTests += runTest("String validator - minLength", () => {
  const validator = Schema.string().minLength(3);
  expectValid(validator.validate("abc"));
  expectValid(validator.validate("abcd"));
  expectInvalid(validator.validate("ab"));
  expectInvalid(validator.validate(""));
});

totalTests++;
passedTests += runTest("String validator - maxLength", () => {
  const validator = Schema.string().maxLength(5);
  expectValid(validator.validate(""));
  expectValid(validator.validate("hello"));
  expectInvalid(validator.validate("hello world"));
});

totalTests++;
passedTests += runTest("String validator - length range", () => {
  const validator = Schema.string().minLength(2).maxLength(10);
  expectValid(validator.validate("ab"));
  expectValid(validator.validate("hello"));
  expectValid(validator.validate("1234567890"));
  expectInvalid(validator.validate("a"));
  expectInvalid(validator.validate("12345678901"));
});

totalTests++;
passedTests += runTest("String validator - pattern matching", () => {
  const validator = Schema.string().pattern(/^\d+$/);
  expectValid(validator.validate("123"));
  expectValid(validator.validate("0"));
  expectInvalid(validator.validate("abc"));
  expectInvalid(validator.validate("123abc"));
});

totalTests++;
passedTests += runTest("String validator - notEmpty", () => {
  const validator = Schema.string().notEmpty();
  expectValid(validator.validate("hello"));
  expectValid(validator.validate("a b")); // Non-empty with spaces
  expectInvalid(validator.validate(""));
  expectInvalid(validator.validate("   ")); // Only whitespace
  expectInvalid(validator.validate(" ")); // Single space gets trimmed
});

totalTests++;
passedTests += runTest("String validator - email", () => {
  const validator = Schema.string().email();
  expectValid(validator.validate("test@example.com"));
  expectValid(validator.validate("user.name+tag@domain.co.uk"));
  expectInvalid(validator.validate("invalid-email"));
  expectInvalid(validator.validate("@domain.com"));
  expectInvalid(validator.validate("user@"));
});

totalTests++;
passedTests += runTest("String validator - URL", () => {
  const validator = Schema.string().url();
  expectValid(validator.validate("https://example.com"));
  expectValid(validator.validate("http://localhost:3000"));
  expectValid(validator.validate("ftp://files.example.com"));
  expectInvalid(validator.validate("not-a-url"));
  expectInvalid(validator.validate("http://"));
});

/**
 * Number Validator Tests
 */
console.log("\n=== Number Validator Tests ===");

totalTests++;
passedTests += runTest("Number validator - valid numbers", () => {
  const validator = Schema.number();
  expectValid(validator.validate(0));
  expectValid(validator.validate(123));
  expectValid(validator.validate(-456));
  expectValid(validator.validate(3.14));
  expectValid(validator.validate(-2.5));
});

totalTests++;
passedTests += runTest("Number validator - invalid types", () => {
  const validator = Schema.number();
  expectInvalid(validator.validate("123"));
  expectInvalid(validator.validate(true));
  expectInvalid(validator.validate({}));
  expectInvalid(validator.validate([]));
  expectInvalid(validator.validate(NaN));
});

totalTests++;
passedTests += runTest("Number validator - min value", () => {
  const validator = Schema.number().min(10);
  expectValid(validator.validate(10));
  expectValid(validator.validate(15));
  expectInvalid(validator.validate(5));
  expectInvalid(validator.validate(-10));
});

totalTests++;
passedTests += runTest("Number validator - max value", () => {
  const validator = Schema.number().max(100);
  expectValid(validator.validate(50));
  expectValid(validator.validate(100));
  expectInvalid(validator.validate(150));
});

totalTests++;
passedTests += runTest("Number validator - range", () => {
  const validator = Schema.number().min(0).max(10);
  expectValid(validator.validate(0));
  expectValid(validator.validate(5));
  expectValid(validator.validate(10));
  expectInvalid(validator.validate(-1));
  expectInvalid(validator.validate(11));
});

totalTests++;
passedTests += runTest("Number validator - positive", () => {
  const validator = Schema.number().positive();
  expectValid(validator.validate(1));
  expectValid(validator.validate(0.1));
  expectInvalid(validator.validate(0));
  expectInvalid(validator.validate(-1));
});

totalTests++;
passedTests += runTest("Number validator - negative", () => {
  const validator = Schema.number().negative();
  expectValid(validator.validate(-1));
  expectValid(validator.validate(-0.1));
  expectInvalid(validator.validate(0));
  expectInvalid(validator.validate(1));
});

totalTests++;
passedTests += runTest("Number validator - integer", () => {
  const validator = Schema.number().integer();
  expectValid(validator.validate(0));
  expectValid(validator.validate(123));
  expectValid(validator.validate(-456));
  expectInvalid(validator.validate(3.14));
  expectInvalid(validator.validate(-2.5));
});

/**
 * Boolean Validator Tests
 */
console.log("\n=== Boolean Validator Tests ===");

totalTests++;
passedTests += runTest("Boolean validator - valid booleans", () => {
  const validator = Schema.boolean();
  expectValid(validator.validate(true));
  expectValid(validator.validate(false));
});

totalTests++;
passedTests += runTest("Boolean validator - invalid types", () => {
  const validator = Schema.boolean();
  expectInvalid(validator.validate("true"));
  expectInvalid(validator.validate(1));
  expectInvalid(validator.validate(0));
  expectInvalid(validator.validate({}));
  expectInvalid(validator.validate([]));
});

totalTests++;
passedTests += runTest("Boolean validator - must be true", () => {
  const validator = Schema.boolean().true();
  expectValid(validator.validate(true));
  expectInvalid(validator.validate(false));
});

totalTests++;
passedTests += runTest("Boolean validator - must be false", () => {
  const validator = Schema.boolean().false();
  expectValid(validator.validate(false));
  expectInvalid(validator.validate(true));
});

/**
 * Date Validator Tests
 */
console.log("\n=== Date Validator Tests ===");

totalTests++;
passedTests += runTest("Date validator - valid dates", () => {
  const validator = Schema.date();
  expectValid(validator.validate(new Date()));
  expectValid(validator.validate("2023-01-01"));
  expectValid(validator.validate("2023-12-31T23:59:59Z"));
  expectValid(validator.validate(Date.now()));
});

totalTests++;
passedTests += runTest("Date validator - invalid dates", () => {
  const validator = Schema.date();
  expectInvalid(validator.validate("invalid-date"));
  expectInvalid(validator.validate("2023-13-01"));
  expectInvalid(validator.validate({}));
  expectInvalid(validator.validate([]));
});

totalTests++;
passedTests += runTest("Date validator - after date", () => {
  const validator = Schema.date().after("2023-01-01");
  expectValid(validator.validate("2023-06-01"));
  expectValid(validator.validate("2024-01-01"));
  expectInvalid(validator.validate("2022-12-31"));
});

totalTests++;
passedTests += runTest("Date validator - before date", () => {
  const validator = Schema.date().before("2023-12-31");
  expectValid(validator.validate("2023-01-01"));
  expectValid(validator.validate("2023-06-01"));
  expectInvalid(validator.validate("2024-01-01"));
});

/**
 * Array Validator Tests
 */
console.log("\n=== Array Validator Tests ===");

totalTests++;
passedTests += runTest("Array validator - valid arrays", () => {
  const validator = Schema.array(Schema.string());
  expectValid(validator.validate([]));
  expectValid(validator.validate(["a", "b", "c"]));
});

totalTests++;
passedTests += runTest("Array validator - invalid types", () => {
  const validator = Schema.array(Schema.string());
  expectInvalid(validator.validate("not-array"));
  expectInvalid(validator.validate(123));
  expectInvalid(validator.validate({}));
});

totalTests++;
passedTests += runTest("Array validator - element validation", () => {
  const validator = Schema.array(Schema.string());
  expectValid(validator.validate(["hello", "world"]));
  expectInvalid(validator.validate(["hello", 123]));
  expectInvalid(validator.validate([true, false]));
});

totalTests++;
passedTests += runTest("Array validator - nested validation", () => {
  const validator = Schema.array(Schema.number().min(0));
  expectValid(validator.validate([1, 2, 3]));
  expectInvalid(validator.validate([1, -2, 3]));
});

totalTests++;
passedTests += runTest("Array validator - minLength", () => {
  const validator = Schema.array(Schema.string()).minLength(2);
  expectValid(validator.validate(["a", "b"]));
  expectValid(validator.validate(["a", "b", "c"]));
  expectInvalid(validator.validate([]));
  expectInvalid(validator.validate(["a"]));
});

totalTests++;
passedTests += runTest("Array validator - maxLength", () => {
  const validator = Schema.array(Schema.string()).maxLength(3);
  expectValid(validator.validate([]));
  expectValid(validator.validate(["a", "b", "c"]));
  expectInvalid(validator.validate(["a", "b", "c", "d"]));
});

totalTests++;
passedTests += runTest("Array validator - notEmpty", () => {
  const validator = Schema.array(Schema.string()).notEmpty();
  expectValid(validator.validate(["a"]));
  expectValid(validator.validate(["a", "b"]));
  expectInvalid(validator.validate([]));
});

/**
 * Object Validator Tests
 */
console.log("\n=== Object Validator Tests ===");

totalTests++;
passedTests += runTest("Object validator - valid objects", () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number(),
  });
  expectValid(validator.validate({ name: "John", age: 30 }));
});

totalTests++;
passedTests += runTest("Object validator - invalid types", () => {
  const validator = Schema.object({});
  expectInvalid(validator.validate("not-object"));
  expectInvalid(validator.validate(123));
  expectInvalid(validator.validate([]));
  expectInvalid(validator.validate(null));
});

totalTests++;
passedTests += runTest("Object validator - field validation", () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number(),
  });
  expectValid(validator.validate({ name: "John", age: 30 }));
  expectInvalid(validator.validate({ name: 123, age: 30 }));
  expectInvalid(validator.validate({ name: "John", age: "thirty" }));
});

totalTests++;
passedTests += runTest("Object validator - missing required fields", () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number(),
  });
  expectInvalid(validator.validate({ name: "John" }));
  expectInvalid(validator.validate({ age: 30 }));
  expectInvalid(validator.validate({}));
});

totalTests++;
passedTests += runTest("Object validator - optional fields", () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number().optional(),
  });
  expectValid(validator.validate({ name: "John" }));
  expectValid(validator.validate({ name: "John", age: 30 }));
  expectValid(validator.validate({ name: "John", age: null }));
});

totalTests++;
passedTests += runTest("Object validator - nested objects", () => {
  const addressValidator = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
  });

  const userValidator = Schema.object({
    name: Schema.string(),
    address: addressValidator,
  });

  expectValid(
    userValidator.validate({
      name: "John",
      address: { street: "123 Main St", city: "Anytown" },
    })
  );

  expectInvalid(
    userValidator.validate({
      name: "John",
      address: { street: 123, city: "Anytown" },
    })
  );
});

/**
 * Complex Schema Tests
 */
console.log("\n=== Complex Schema Tests ===");

totalTests++;
passedTests += runTest("Complex user schema - valid data", () => {
  const userSchema = Schema.object({
    id: Schema.string(),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().email(),
    age: Schema.number().min(0).max(150).optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()).minLength(1),
    address: Schema.object({
      street: Schema.string().notEmpty(),
      city: Schema.string().notEmpty(),
      postalCode: Schema.string().pattern(/^\d{5}$/),
    }).optional(),
  });

  expectValid(
    userSchema.validate({
      id: "12345",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      tags: ["developer", "designer"],
      address: {
        street: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
      },
    })
  );
});

totalTests++;
passedTests += runTest(
  "Complex user schema - multiple validation errors",
  () => {
    const userSchema = Schema.object({
      id: Schema.string(),
      name: Schema.string().minLength(2),
      email: Schema.string().email(),
      age: Schema.number().min(0),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()).notEmpty(),
    });

    const result = userSchema.validate({
      id: 123, // Should be string
      name: "J", // Too short
      email: "invalid-email", // Invalid format
      age: -5, // Negative
      isActive: "yes", // Should be boolean
      tags: [], // Empty array
    });

    expectInvalid(result);
    // Should have multiple errors
    if (result.errors.length < 5) {
      throw new Error(
        `Expected at least 5 errors, got ${result.errors.length}`
      );
    }
  }
);

/**
 * Union and Literal Types Tests
 */
console.log("\n=== Union and Literal Types Tests ===");

totalTests++;
passedTests += runTest("Union validator - oneOf", () => {
  const validator = Schema.oneOf(
    Schema.string(),
    Schema.number(),
    Schema.boolean()
  );

  expectValid(validator.validate("hello"));
  expectValid(validator.validate(123));
  expectValid(validator.validate(true));
  expectInvalid(validator.validate({}));
  expectInvalid(validator.validate([]));
});

totalTests++;
passedTests += runTest("Literal validator", () => {
  const validator = Schema.literal("exact-value");
  expectValid(validator.validate("exact-value"));
  expectInvalid(validator.validate("different-value"));
  expectInvalid(validator.validate(123));
});

/**
 * Edge Cases and Error Handling Tests
 */
console.log("\n=== Edge Cases Tests ===");

totalTests++;
passedTests += runTest("Chaining validators", () => {
  const validator = Schema.string()
    .minLength(3)
    .maxLength(10)
    .pattern(/^[a-z]+$/)
    .notEmpty();

  expectValid(validator.validate("hello"));
  expectInvalid(validator.validate("ab")); // Too short
  expectInvalid(validator.validate("verylongstring")); // Too long
  expectInvalid(validator.validate("Hello")); // Contains uppercase
  expectInvalid(validator.validate("")); // Empty
});

totalTests++;
passedTests += runTest("Optional chaining", () => {
  const validator = Schema.string().minLength(5).optional();
  expectValid(validator.validate(null));
  expectValid(validator.validate(undefined));
  expectValid(validator.validate("hello"));
  expectInvalid(validator.validate("hi")); // Too short when provided
});

totalTests++;
passedTests += runTest("Custom error messages", () => {
  const validator = Schema.string().minLength(5).withMessage("Name too short!");
  const result = validator.validate("hi");
  expectInvalid(result);
  if (!result.errors.includes("Name too short!")) {
    throw new Error(`Expected custom message, got: ${result.errors[0]}`);
  }
});

/**
 * Performance Tests
 */
console.log("\n=== Performance Tests ===");

totalTests++;
passedTests += runTest("Large array validation performance", () => {
  const validator = Schema.array(Schema.number().min(0));
  const largeArray = Array.from({ length: 1000 }, (_, i) => i);

  const startTime = Date.now();
  const result = validator.validate(largeArray);
  const endTime = Date.now();

  expectValid(result);
  if (endTime - startTime > 100) {
    throw new Error(`Validation took too long: ${endTime - startTime}ms`);
  }
});

totalTests++;
passedTests += runTest("Deep nested object validation", () => {
  const deepSchema = Schema.object({
    level1: Schema.object({
      level2: Schema.object({
        level3: Schema.object({
          value: Schema.string(),
        }),
      }),
    }),
  });

  expectValid(
    deepSchema.validate({
      level1: {
        level2: {
          level3: {
            value: "deep",
          },
        },
      },
    })
  );

  expectInvalid(
    deepSchema.validate({
      level1: {
        level2: {
          level3: {
            value: 123,
          },
        },
      },
    })
  );
});

/**
 * Test Results Summary
 */
console.log("\n=== Test Results Summary ===");
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed!");
  process.exit(0);
} else {
  console.log("❌ Some tests failed!");
  process.exit(1);
}
