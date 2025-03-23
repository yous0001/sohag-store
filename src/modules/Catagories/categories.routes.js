import { Router } from "express";
import * as categoryControllers from "./categories.controllers.js"
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/index.js";
import expressAsyncHandler from "express-async-handler";

const categoryRouter =Router()

categoryRouter.post('/create',multerMiddleHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(categoryControllers.createCategroy))
categoryRouter.get('/',expressAsyncHandler(categoryControllers.getAllCategories))
export { categoryRouter } 