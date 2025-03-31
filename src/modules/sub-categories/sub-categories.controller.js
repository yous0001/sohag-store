import { Category,SubCategory } from "../../../DB/models/index.js";
import slugify from "slugify";
import { cloudinaryConfig, uploadFile} from "../../utils/index.js";
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

export const updateSubCategory=async(req,res,next) => {
    const {name}=req.body
    const {id}=req.params

    const subCategory=await SubCategory.findById(id)
    if(!subCategory){
        return next(new Error("Sub category not found",{cause:404}));
    }
    if(name){
        const slug=slugify(name,{
            lower:true,
            replacement:'_',
            trim:true
        })
        //check if sub category already exists
        const subCategoryExists=await SubCategory.findOne({slug,categoryID:subCategory.categoryID})
        if(subCategoryExists){
            return next(new Error("Sub category already exists",{cause:409}));
        }
        subCategory.name=name
        subCategory.slug=slug
    }

    if(req.file?.path){
        const {secure_url}=await cloudinaryConfig().uploader.upload(req.file.path,
                {
                public_id:subCategory.Image.public_id,
                overwrite:true
                })
        subCategory.Image.secure_url=secure_url
    }
    await subCategory.save()
    res.status(200).json({message:"Sub category updated successfully",subCategory})
    
}

export const deleteSubCategory=async(req,res,next) => {
    const {id}=req.params
    const subCategory=await SubCategory.findById(id).populate({path:"categoryID",select:"customID"})
    if(!subCategory){
        return next(new Error("Sub category not found",{cause:404}));
    }
    const folderPath=`${process.env.UPLOADS_FOLDER}/categories/${subCategory.categoryID.customID}/sub-categories/${subCategory.customID}`
    
    const { resources } = await cloudinaryConfig().api.resources({
        type: "upload",
        prefix: folderPath, // Get all images inside the folder
        max_results: 100
    });

    for (const file of resources) {
        await cloudinaryConfig().uploader.destroy(file.public_id);
    }


    await cloudinaryConfig().api.delete_folder(folderPath);

    await SubCategory.findByIdAndDelete(id);

    res.status(200).json({message:"Sub category deleted successfully"})
}