const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//Handlinh Uncaught Exception 

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1)
})


// Setting up config file
dotenv.config({path:"backend/config/config.env"})

// Connect to database
connectDatabase();


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})


// Unhandled Promise Rejction
 process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1)
    })
 });