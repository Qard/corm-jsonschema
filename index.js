const Validator = require('jsonschema').Validator
const inherits = require('util').inherits

// Export the validates method with the ValidationError class attached
module.exports = validates
validates.ValidationError = ValidationError

function ValidationError (message, errors) {
  var err = Error.call(this, message)
  err.errors = errors
  return err
}
inherits(ValidationError, Error)

function validates (schema) {
  return function* () {
    var v = new Validator()
    var state = v.validate(this, schema)

    if (state.errors.length > 0) {
      var errors = state.errors.map(function (error) {
        return {
          property: error.property.replace(/^instance\./, ''),
          message: error.message
        }
      })

      Object.defineProperty(this, 'errors', {
        enumerable: false,
        value: errors
      })

      throw new ValidationError('validation failed', errors)
    }
  }
}
