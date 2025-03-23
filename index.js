import { config } from "dotenv";
import express from "express";
import { DB_connection } from "./DB/connection.js";
import * as routers from "./src/modules/index.js";
import { globalResponse } from './src/middlewares/globalResponce.middleware.js';

config()

const app=express()
const port = process.env.PORT || 5000

//Middleware
app.use(express.json())

//Routers
app.use('/category', routers.categoryRouter)

app.use(globalResponse)

DB_connection()
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
