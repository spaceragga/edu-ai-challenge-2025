# Robust Validation Library - Getting Started Guide

A comprehensive JavaScript validation library with type-safe validators for primitive and complex data types.

## 🚀 Quick Setup & Run

### Step 1: Get the Files
```bash
# Navigate to the validation library folder
cd 8

# Optional: Install development dependencies for coverage reporting
npm install
```

### Step 2: Try It Out (Choose One)

#### Option A: Simple Examples (Recommended for Beginners)
```bash
npm run examples
# OR
node examples.js
```
**What you'll see:** Basic validation examples with strings, numbers, objects, and arrays.

#### Option B: Interactive CLI Tool
```bash
npm run cli
# OR
node cli.js
```
**What you'll see:** Help menu with commands to test validation interactively.

Try these commands:
```bash
node cli.js string "user@test.com" email
node cli.js number 25 min:0 max:100
node cli.js string "hello" minLength:3 maxLength:10
```

#### Option C: Full Demo
```bash
npm run demo
# OR
node demo.js
```
**What you'll see:** Comprehensive demo with real-world examples, performance tests, and all features.

## 📝 How to Use the Validation Library

### Basic Usage Pattern

1. **Import the library:**
```javascript
const { Schema } = require('./schema.js');
```

2. **Create a validator:**
```javascript
const validator = Schema.string().email();
```

3. **Validate data:**
```javascript
const result = validator.validate('user@example.com');
if (result.isValid) {
  console.log('✅ Valid!');
} else {
  console.log('❌ Errors:', result.errors);
}
```

### Step-by-Step Examples

#### Example 1: Validate a String
```javascript
const { Schema } = require('./schema.js');

// Create validator
const nameValidator = Schema.string().minLength(2).maxLength(50);

// Test data
console.log('Testing "John":', nameValidator.validate('John'));
// Result: { isValid: true, errors: [] }

console.log('Testing "J":', nameValidator.validate('J')); 
// Result: { isValid: false, errors: ['String must be at least 2 characters long'] }
```

#### Example 2: Validate Email
```javascript
const emailValidator = Schema.string().email();

console.log(emailValidator.validate('user@example.com')); // ✅ Valid
console.log(emailValidator.validate('invalid-email'));    // ❌ Invalid
```

#### Example 3: Validate Numbers
```javascript
const ageValidator = Schema.number().min(0).max(120);

console.log(ageValidator.validate(25));   // ✅ Valid
console.log(ageValidator.validate(-5));   // ❌ Too low
console.log(ageValidator.validate(150));  // ❌ Too high
```

#### Example 4: Validate Objects
```javascript
const userValidator = Schema.object({
  name: Schema.string().minLength(2),
  email: Schema.string().email(),
  age: Schema.number().min(0).optional() // Optional field
});

const userData = {
  name: 'Alice',
  email: 'alice@test.com',
  age: 30
};

const result = userValidator.validate(userData);
console.log('User validation:', result);
```

#### Example 5: Validate Arrays
```javascript
const tagsValidator = Schema.array(Schema.string()).minLength(1);

console.log(tagsValidator.validate(['javascript', 'node'])); // ✅ Valid
console.log(tagsValidator.validate([]));                     // ❌ Empty array
```

## 🛠️ Available Validators

### String Validators
```javascript
Schema.string()
  .minLength(2)           // Minimum length
  .maxLength(100)         // Maximum length
  .email()                // Valid email format
  .url()                  // Valid URL format
  .pattern(/^\d+$/)       // Regex pattern
  .notEmpty()             // Not empty after trimming
  .optional()             // Allow null/undefined
  .withMessage('Custom error message')
```

### Number Validators
```javascript
Schema.number()
  .min(0)                 // Minimum value
  .max(100)               // Maximum value
  .positive()             // Must be > 0
  .negative()             // Must be < 0
  .integer()              // Whole numbers only
  .optional()
  .withMessage('Custom error')
```

### Boolean Validators
```javascript
Schema.boolean()
  .true()                 // Must be true
  .false()                // Must be false
  .optional()
```

### Array Validators
```javascript
Schema.array(Schema.string())  // Array of strings
  .minLength(1)                // Minimum array length
  .maxLength(10)               // Maximum array length
  .notEmpty()                  // Cannot be empty
  .optional()
```

### Object Validators
```javascript
Schema.object({
  name: Schema.string(),
  age: Schema.number().optional(),
  email: Schema.string().email()
}).optional()
```

### Advanced Validators
```javascript
// Union types (accepts multiple types)
Schema.oneOf(
  Schema.string(),
  Schema.number(),
  Schema.boolean()
)

// Literal values (exact match)
Schema.literal('active')
Schema.oneOf(
  Schema.literal('draft'),
  Schema.literal('published'),
  Schema.literal('archived')
)
```

## 🧪 Testing Your Code

### Run Tests
```bash
npm test
# OR
node schema.test.js
```
**What you'll see:** All 50 test cases running with 100% pass rate.

### Check Test Coverage
```bash
npm run coverage-report
```
**What you'll see:** Detailed coverage report saved to `test_report.txt` (99.67% coverage).

## 🔧 Interactive Command Line Usage

The CLI tool lets you test validators quickly:

```bash
# Show help
node cli.js

# Test email validation
node cli.js string "user@example.com" email

# Test number range
node cli.js number 25 min:0 max:100

# Test string length
node cli.js string "hello" minLength:3 maxLength:10

# Test with custom error message
node cli.js string "hi" minLength:5 message:"Too short!"
```

## 📋 Real-World Usage Example

Here's how to validate a user registration form:

```javascript
const { Schema } = require('./schema.js');

// Define the validation schema
const registrationSchema = Schema.object({
  username: Schema.string().minLength(3).maxLength(20),
  email: Schema.string().email(),
  password: Schema.string().minLength(8),
  age: Schema.number().min(13).max(120),
  newsletter: Schema.boolean().optional(),
  tags: Schema.array(Schema.string()).maxLength(5).optional()
});

// Example user data
const formData = {
  username: 'johndoe',
  email: 'john@example.com', 
  password: 'mypassword123',
  age: 25,
  newsletter: true,
  tags: ['developer', 'javascript']
};

// Validate the data
const result = registrationSchema.validate(formData);

if (result.isValid) {
  console.log('✅ Registration data is valid!');
  // Process the registration...
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach(error => console.log(`  - ${error}`));
  // Show errors to user...
}
```

## 🌐 Using in Different Environments

### Node.js
```javascript
const { Schema } = require('./schema.js');
// Use as shown in examples above
```

### Browser
```html
<script src="schema.js"></script>
<script>
  const validator = Schema.string().email();
  const result = validator.validate('user@example.com');
  console.log(result.isValid); // true
</script>
```

### ES6 Modules
```javascript
import { Schema } from './schema.js';
// Use as shown in examples above
```

## 🎯 Next Steps

1. **Start Simple:** Run `npm run examples` to see basic usage
2. **Try Interactive:** Use `node cli.js` to test your own data
3. **See Full Power:** Run `npm run demo` for comprehensive examples
4. **Build Your Schema:** Create validators for your specific data structures
5. **Run Tests:** Use `npm test` to ensure everything works

## 📚 File Structure

```
8/
├── schema.js          # Main validation library
├── examples.js        # Simple usage examples
├── demo.js           # Comprehensive demonstration
├── cli.js            # Interactive command-line tool
├── schema.test.js    # Test suite (50 tests)
├── package.json      # NPM configuration
├── README.md         # This guide
└── test_report.txt   # Test coverage report
```

## 🔗 Quick Reference Commands

```bash
# Get started with examples
npm run examples

# Try interactive testing  
npm run cli

# See full demonstration
npm run demo

# Run all tests
npm test

# Generate coverage report
npm run coverage-report
```

## ❓ Need Help?

1. **Run examples first:** `npm run examples`
2. **Check the demo:** `npm run demo` 
3. **Try the CLI:** `node cli.js` (shows help)
4. **Look at test cases:** `schema.test.js` has 50+ examples

The validation library is ready to use - just pick your starting point and begin validating data! 🚀 