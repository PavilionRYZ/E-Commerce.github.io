// Error handler class
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode= statusCode
 // Capture the stack trace of the error, excluding the constructor call itself
        Error.captureStackTrace(this,this.constructor);

    }
}

module.exports = ErrorHandler

// This code defines a JavaScript class named `ErrorHandler` that extends the built-in ` Error `class. The purpose of this custom error class is to handle errors in a more structured way by including additional information such as an error message and an HTTP status code.

/**
Class Definition:

class ErrorHandler extends Error: This line defines a new class named ErrorHandler that extends the built-in Error class. By extending Error, the ErrorHandler class inherits properties and methods from the Error class, making it suitable for representing and handling errors.
Constructor:

constructor(message, statusCode): This is the constructor method of the ErrorHandler class. It takes two parameters:
message: A string representing the error message.
statusCode: An integer representing the HTTP status code associated with the error.
Super Constructor Call:

super(message): This line calls the constructor of the parent class (Error class) with the provided message. It sets the error message for the instance.
Custom Property:

this.statusCode = statusCode: This line assigns the provided statusCode parameter to a property named statusCode of the current instance of the ErrorHandler class. This allows you to associate an HTTP status code with the error.
Capture Stack Trace:

Error.captureStackTrace(this, this.constructor): This line captures the current stack trace for the error object. It helps in identifying the location where the error occurred. The this.constructor argument specifies to exclude the ErrorHandler constructor from the captured stack trace.
Export Module:

module.exports = ErrorHandler;: This line exports the ErrorHandler class so that it can be used in other files by requiring this module.
*/

