module.exports = theFunc => (req,res,next) =>{
    Promise.resolve(theFunc(req,res,next))
    .catch(next);
}

/**
This code exports a higher-order function (HOF) 
that takes another function (theFunc) as an 
argument. The exported function is designed to be
 used as middleware in an Express.js application.
  Let's break down the code step by step:

  module.exports: This statement exports the 
  functionality of the module. In this case, it
   exports a function that takes theFunc as an argument.

theFunc: This is a function that is passed as an argument 
to the exported function. It is assumed that theFunc is a
 middleware function with the signature (req, res, next) 
 commonly used in Express.js.

(req, res, next) => { ... }: This part defines an arrow function 
that acts as middleware. It takes the standard Express.js middleware 
parameters: req (request), res (response), and next (callback to invoke
    the next middleware in the stack).

Promise.resolve(theFunc(req, res, next)): The middleware function takes the 
input theFunc and invokes it with the current request, response, and next parameters.
 The result of this invocation is wrapped in a Promise.resolve call. This is done 
 to ensure that if theFunc returns a value or a promise, it is handled uniformly as a promise.

.catch(next): The catch block is used to handle any errors that might occur during the execution
 of theFunc. If an error occurs, it will be caught, and the next function will be called with
  the error, effectively passing the error to the next middleware in the stack or the error
   handling middleware.

In summary, this code is a utility that allows you to wrap an existing middleware function
 (theFunc) with error handling. It ensures that if theFunc returns a promise that gets rejected,
  the error is caught and passed to the next middleware in the Express.js stack. This can be useful 
  for standardizing error handling in middleware functions.
 */