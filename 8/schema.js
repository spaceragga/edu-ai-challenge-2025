/**
 * Robust Validation Library
 * A comprehensive type-safe validation library for JavaScript with support for primitive and complex data types
 * Author: AI-Assisted Development with Cursor IDE
 */

/**
 * Base validator class that all specific validators extend from
 * Provides common validation functionality and chaining capabilities
 */
class Validator {
  constructor() {
    this.rules = [];
    this.isOptional = false;
    this.customMessage = null;
  }

  /**
   * Marks this validator as optional, allowing null/undefined values
   * @returns {Validator} The validator instance for chaining
   */
  optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Sets a custom error message for validation failures
   * @param {string} message - Custom error message
   * @returns {Validator} The validator instance for chaining
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Validates a value against all rules in this validator
   * @param {*} value - The value to validate
   * @returns {ValidationResult} Object containing isValid boolean and errors array
   */
  validate(value) {
    // Handle optional values
    if (this.isOptional && (value === null || value === undefined)) {
      return { isValid: true, errors: [] };
    }

    // Check if value is required but missing
    if (!this.isOptional && (value === null || value === undefined)) {
      return {
        isValid: false,
        errors: [this.customMessage || "Value is required"],
      };
    }

    const errors = [];

    // Run all validation rules
    for (const rule of this.rules) {
      if (!rule.test(value)) {
        errors.push(this.customMessage || rule.message);
        break; // Stop at first error unless we want to collect all errors
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Adds a validation rule to this validator
   * @param {Function} testFn - Function that tests the value (returns boolean)
   * @param {string} message - Error message if validation fails
   * @returns {Validator} The validator instance for chaining
   */
  addRule(testFn, message) {
    this.rules.push({ test: testFn, message });
    return this;
  }
}

/**
 * String validator with common string validation methods
 * Supports min/max length, pattern matching, and custom validations
 */
class StringValidator extends Validator {
  constructor() {
    super();
    // Ensure value is a string
    this.addRule(
      (value) => typeof value === "string",
      "Value must be a string"
    );
  }

  /**
   * Sets minimum length requirement for the string
   * @param {number} min - Minimum length
   * @returns {StringValidator} The validator instance for chaining
   */
  minLength(min) {
    this.addRule(
      (value) => value.length >= min,
      `String must be at least ${min} characters long`
    );
    return this;
  }

  /**
   * Sets maximum length requirement for the string
   * @param {number} max - Maximum length
   * @returns {StringValidator} The validator instance for chaining
   */
  maxLength(max) {
    this.addRule(
      (value) => value.length <= max,
      `String must be at most ${max} characters long`
    );
    return this;
  }

  /**
   * Validates string against a regular expression pattern
   * @param {RegExp} pattern - Regular expression to test against
   * @returns {StringValidator} The validator instance for chaining
   */
  pattern(pattern) {
    this.addRule(
      (value) => pattern.test(value),
      `String does not match required pattern`
    );
    return this;
  }

  /**
   * Ensures string is not empty (after trimming whitespace)
   * @returns {StringValidator} The validator instance for chaining
   */
  notEmpty() {
    this.addRule((value) => value.trim().length > 0, "String cannot be empty");
    return this;
  }

  /**
   * Validates that string is a valid email format
   * @returns {StringValidator} The validator instance for chaining
   */
  email() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.addRule(
      (value) => emailPattern.test(value),
      "Must be a valid email address"
    );
    return this;
  }

  /**
   * Validates that string is a valid URL format
   * @returns {StringValidator} The validator instance for chaining
   */
  url() {
    this.addRule((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, "Must be a valid URL");
    return this;
  }
}

/**
 * Number validator with range and type validation
 * Supports integer validation, min/max values, and custom numeric rules
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    // Ensure value is a number
    this.addRule(
      (value) => typeof value === "number" && !isNaN(value),
      "Value must be a valid number"
    );
  }

  /**
   * Sets minimum value requirement
   * @param {number} min - Minimum value (inclusive)
   * @returns {NumberValidator} The validator instance for chaining
   */
  min(min) {
    this.addRule((value) => value >= min, `Number must be at least ${min}`);
    return this;
  }

  /**
   * Sets maximum value requirement
   * @param {number} max - Maximum value (inclusive)
   * @returns {NumberValidator} The validator instance for chaining
   */
  max(max) {
    this.addRule((value) => value <= max, `Number must be at most ${max}`);
    return this;
  }

  /**
   * Ensures number is a positive value (> 0)
   * @returns {NumberValidator} The validator instance for chaining
   */
  positive() {
    this.addRule((value) => value > 0, "Number must be positive");
    return this;
  }

  /**
   * Ensures number is a negative value (< 0)
   * @returns {NumberValidator} The validator instance for chaining
   */
  negative() {
    this.addRule((value) => value < 0, "Number must be negative");
    return this;
  }

  /**
   * Validates that number is an integer (whole number)
   * @returns {NumberValidator} The validator instance for chaining
   */
  integer() {
    this.addRule(
      (value) => Number.isInteger(value),
      "Number must be an integer"
    );
    return this;
  }
}

/**
 * Boolean validator for true/false values
 * Ensures value is strictly a boolean type
 */
class BooleanValidator extends Validator {
  constructor() {
    super();
    // Ensure value is a boolean
    this.addRule(
      (value) => typeof value === "boolean",
      "Value must be a boolean (true or false)"
    );
  }

  /**
   * Ensures boolean value is true
   * @returns {BooleanValidator} The validator instance for chaining
   */
  true() {
    this.addRule((value) => value === true, "Value must be true");
    return this;
  }

  /**
   * Ensures boolean value is false
   * @returns {BooleanValidator} The validator instance for chaining
   */
  false() {
    this.addRule((value) => value === false, "Value must be false");
    return this;
  }
}

/**
 * Date validator for Date objects and date strings
 * Supports date range validation and format checking
 */
class DateValidator extends Validator {
  constructor() {
    super();
    // Ensure value is a valid date
    this.addRule((value) => {
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }, "Value must be a valid date");
  }

  /**
   * Sets minimum date requirement
   * @param {Date|string} minDate - Minimum date (inclusive)
   * @returns {DateValidator} The validator instance for chaining
   */
  after(minDate) {
    this.addRule(
      (value) => new Date(value) > new Date(minDate),
      `Date must be after ${new Date(minDate).toISOString()}`
    );
    return this;
  }

  /**
   * Sets maximum date requirement
   * @param {Date|string} maxDate - Maximum date (inclusive)
   * @returns {DateValidator} The validator instance for chaining
   */
  before(maxDate) {
    this.addRule(
      (value) => new Date(value) < new Date(maxDate),
      `Date must be before ${new Date(maxDate).toISOString()}`
    );
    return this;
  }
}

/**
 * Array validator for validating arrays and their elements
 * Supports length validation and element validation using other validators
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;

    // Ensure value is an array
    this.addRule((value) => Array.isArray(value), "Value must be an array");
  }

  /**
   * Validates the array and all its elements
   * @param {*} value - The array to validate
   * @returns {ValidationResult} Validation result with detailed error information
   */
  validate(value) {
    // First run base validation (checks if it's optional, required, and is an array)
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    // If optional and null/undefined, it's valid
    if (this.isOptional && (value === null || value === undefined)) {
      return { isValid: true, errors: [] };
    }

    const errors = [...baseResult.errors];

    // Validate each item in the array if itemValidator is provided
    if (this.itemValidator && Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemResult = this.itemValidator.validate(item);
        if (!itemResult.isValid) {
          errors.push(
            `Item at index ${index}: ${itemResult.errors.join(", ")}`
          );
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sets minimum array length requirement
   * @param {number} min - Minimum length
   * @returns {ArrayValidator} The validator instance for chaining
   */
  minLength(min) {
    this.addRule(
      (value) => value.length >= min,
      `Array must have at least ${min} items`
    );
    return this;
  }

  /**
   * Sets maximum array length requirement
   * @param {number} max - Maximum length
   * @returns {ArrayValidator} The validator instance for chaining
   */
  maxLength(max) {
    this.addRule(
      (value) => value.length <= max,
      `Array must have at most ${max} items`
    );
    return this;
  }

  /**
   * Ensures array is not empty
   * @returns {ArrayValidator} The validator instance for chaining
   */
  notEmpty() {
    this.addRule((value) => value.length > 0, "Array cannot be empty");
    return this;
  }
}

/**
 * Object validator for validating object structures
 * Validates objects against a schema of field validators
 */
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this.schema = schema;

    // Ensure value is an object
    this.addRule(
      (value) =>
        typeof value === "object" && value !== null && !Array.isArray(value),
      "Value must be an object"
    );
  }

  /**
   * Validates the object against its schema
   * @param {*} value - The object to validate
   * @returns {ValidationResult} Validation result with field-specific errors
   */
  validate(value) {
    // First run base validation (checks if optional, required, and is an object)
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    // If optional and null/undefined, it's valid
    if (this.isOptional && (value === null || value === undefined)) {
      return { isValid: true, errors: [] };
    }

    const errors = [...baseResult.errors];

    // Validate each field in the schema
    if (this.schema && typeof value === "object" && value !== null) {
      for (const [fieldName, fieldValidator] of Object.entries(this.schema)) {
        const fieldValue = value[fieldName];
        const fieldResult = fieldValidator.validate(fieldValue);

        if (!fieldResult.isValid) {
          errors.push(`Field '${fieldName}': ${fieldResult.errors.join(", ")}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Main Schema class - Factory for creating validators
 * Provides static methods to create type-specific validators
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} New string validator instance
   */
  static string() {
    return new StringValidator();
  }

  /**
   * Creates a number validator
   * @returns {NumberValidator} New number validator instance
   */
  static number() {
    return new NumberValidator();
  }

  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} New boolean validator instance
   */
  static boolean() {
    return new BooleanValidator();
  }

  /**
   * Creates a date validator
   * @returns {DateValidator} New date validator instance
   */
  static date() {
    return new DateValidator();
  }

  /**
   * Creates an object validator with the specified schema
   * @param {Object} schema - Object mapping field names to validators
   * @returns {ObjectValidator} New object validator instance
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }

  /**
   * Creates an array validator with element validation
   * @param {Validator} itemValidator - Validator for array elements
   * @returns {ArrayValidator} New array validator instance
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }

  /**
   * Creates a validator that accepts any of the provided validators (union type)
   * @param {...Validator} validators - List of validators to try
   * @returns {Validator} New union validator instance
   */
  static oneOf(...validators) {
    const unionValidator = new Validator();
    unionValidator.addRule((value) => {
      return validators.some((validator) => validator.validate(value).isValid);
    }, "Value does not match any of the allowed types");
    return unionValidator;
  }

  /**
   * Creates a validator for literal values (exact match)
   * @param {*} literalValue - The exact value that must match
   * @returns {Validator} New literal validator instance
   */
  static literal(literalValue) {
    const literalValidator = new Validator();
    literalValidator.addRule(
      (value) => value === literalValue,
      `Value must be exactly ${JSON.stringify(literalValue)}`
    );
    return literalValidator;
  }
}

// Export for use in other modules (if using CommonJS)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Schema,
    Validator,
    StringValidator,
    NumberValidator,
    BooleanValidator,
    DateValidator,
    ArrayValidator,
    ObjectValidator,
  };
}

// Note: For examples and demos, run:
// - node examples.js (simple examples)
// - node demo.js (comprehensive demo)
// - node cli.js (interactive CLI tool)
