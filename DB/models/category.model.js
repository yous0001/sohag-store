import mongoose from "mongoose";

const {Schema, model}=mongoose

const categorySchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        },
    slug:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    Image:{
        secure_url:{type:String, required:true},
        public_id:{type:String, required:true} 
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:false //only now until building user model
    },
    customID:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

export const Category= mongoose.models.Category || model("Category", categorySchema) 