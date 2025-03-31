import mongoose from "mongoose";

const {Schema, model}=mongoose

const brandSchema=new Schema({
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
    logo:{
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
    },
    categoryID:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    subCategoryID:{
        type:Schema.Types.ObjectId,
        ref:"SubCategory",
        required:true
    }

},{timestamps:true})

export const Brand=mongoose.models.Brand||model("Brand", brandSchema)