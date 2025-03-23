import multer from "multer"
import { allowedExtensions } from "../utils/index.js";



export const multerMiddleHost = ({
    extensions = allowedExtensions.image,
}) => {


    // diskStorage
    const storage = multer.diskStorage({})

    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const file = multer({ fileFilter, storage })
    return file
}
