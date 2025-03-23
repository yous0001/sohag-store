import slugify from "slugify";
import { uploadFile,generateUniqueString } from "../../utils/index.js";
import { Category } from "../../../DB/models/index.js";




export const createCategroy=async(req, res,next)=>{
    const {name}=req.body
    const slug=slugify(name,{
        lower:true,
        repacement:'_',
        trim:true
    })
    //check if category already exists
    const categoryExists=await Category.findOne({slug})
    if(categoryExists){
        return next(new Error("Category already exists",{cause:409}));
    }

    //upload image of category
    if(!req.file){
        return next(new Error("Please upload an image",{cause:404}));
    }
    const customID=generateUniqueString(6);
    const {public_id, secure_url}=await uploadFile({ file:req.file.path, folder :`${process.env.UPLOADS_FOLDER}/categories/${customID}`})

    const categoryObj={
        name,
        slug,
        Image:{public_id, secure_url},
        customID
    }
    const category=await Category.create(categoryObj)

    res.status(201).json({message:"Category created successfully",category})

}

export const getAllCategories=async(req, res)=>{
    const categories=await Category.find({})
    res.status(200).json({message:"Categories fetched successfully",categories})
}

export const getSpecificCategory=async(req, res, next)=>{
    const {slug,name,id}=req.query;

    //check if query parameters are provided
    if(!slug && !name && !id){
        return next(new Error("Please provide a query parameter like name or slug or id",{cause:400}));
    }
    //build query filter based on query parameters
    const queryFilter={}

    if(name) queryFilter.name=name
    if(id) queryFilter._id=id
    if(slug) queryFilter.slug=slug

    const category=await Category.findOne(queryFilter)
    
    if(!category){
        return next(new Error("Category not found",{cause:404}));
    }
    res.status(200).json({message:"Category fetched successfully",category})
}