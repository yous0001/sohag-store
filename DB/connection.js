import mongoose from "mongoose";
import chalk from "chalk";

export const DB_connection=()=>{
    mongoose.connect(process.env.MONGO_ATLAS)
        .then(res=>console.log(chalk.green("Database connected successfully")))
        .catch(err=>console.log(chalk.red("Error connecting to Database:", err)));
}