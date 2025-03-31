import { Router } from "express"
import * as subCategoryController from "./sub-categories.controller.js"
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/index.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";


const subCategoryRouter=Router()

subCategoryRouter.post('/create',multerMiddleHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(subCategoryController.createSubCategory))
subCategoryRouter.get("/",expressAsyncHandler(subCategoryController.getSpecificSubCategory))
subCategoryRouter.put("/:id",multerMiddleHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(subCategoryController.updateSubCategory))
subCategoryRouter.delete("/:id",expressAsyncHandler(subCategoryController.deleteSubCategory))

export {subCategoryRouter}