import mongoose from "mongoose";
import chalk from "chalk";

export const DB_connection=()=>{
    mongoose.connect(process.env.MONGO_ATLAS)
        .then(res=>console.log(chalk.green("Connected successfully to MongoDB")))
        .catch(err=>console.log(chalk.red("Error connecting to MongoDB:", err)));
}