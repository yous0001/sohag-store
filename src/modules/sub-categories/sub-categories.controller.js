import { Category,SubCategory } from "../../../DB/models/index.js";
import slugify from "slugify";
import { uploadFile} from "../../utils/index.js";
import { nanoid } from "nanoid";

export const createSubCategory=async(req,res,next) => {
    const {name}=req.body
    const category=await Category.findById(req.query.categoryID)
    if(!category){
        return next(new Error("Category not found",{cause:404}));
    }
    const slug=slugify(name,{
        lower:true,
        replacement:'_',
        trim:true
    })
    //check if sub category already exists
    const subCategoryExists=await SubCategory.findOne({slug,categoryID:req.query.categoryID})
    if(subCategoryExists){
        return next(new Error("Sub category already exists",{cause:409}));
    }

    //upload image of sub category
    if(!req.file){
        return next(new Error("Please upload an image",{cause:404}));
    }
    const customID=nanoid(6);
    const folderPath=`${process.env.UPLOADS_FOLDER}/categories/${category.customID}/sub-categories/${customID}`
    const {public_id, secure_url}=await uploadFile({ file:req.file.path, folder:folderPath})

    const subCategoryObj={
        name,
        slug,
        Image:{public_id, secure_url},
        categoryID:category._id,
        customID
    }
    const subCategory=await SubCategory.create(subCategoryObj)

    res.status(201).json({message:"Sub category created successfully",subCategory})
}

export const getSpecificSubCategory=async(req,res) => {
    const {slug,id,name}=req.params

    const queryFilter={}
    if(slug)queryFilter.slug=slug
    if(id)queryFilter._id=id
    if(name)queryFilter.name=name

    const subCategory=await SubCategory.findOne(queryFilter)
    res.status(200).json({message:"Sub category fetched successfully",subCategory})
}