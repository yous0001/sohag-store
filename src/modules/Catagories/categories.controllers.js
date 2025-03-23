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