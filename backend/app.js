const express = require("express");
const app = express(); 
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");


app.use(express.json());
app.use(cookieParser());

// Route Imports 
const product = require("./routers/productRoute");
const user =  require("./routers/userRoute");
app.use("/api/v1",product);
app.use("/api/v1",user);

// Middlewawre for ErrorHandling
app.use(errorMiddleware);

module.exports= app