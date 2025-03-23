import { config } from "dotenv";
import express from "express";

config()

const app=express()
const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
