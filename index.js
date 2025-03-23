import { config } from "dotenv";
import express from "express";
import { DB_connection } from "./DB/connection.js";

config()

const app=express()
const port = process.env.PORT || 5000

DB_connection()
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
