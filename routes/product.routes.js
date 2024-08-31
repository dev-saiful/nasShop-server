import { Router } from "express";
import {auth,isAdmin, isUser} from "../middlewares/auth.middleware.js";
import { getProductById,
     getProducts,
     getTopProducts,
     createProduct, 
     updateProduct,
     deleteProduct,
     createProductReview} from "../controllers/product.controller.js";

const productRoute = Router();

/**
 * @desc Get All Products 
 * @method GET
 * @route http://localhost:{PORT}/api/v1/products
 * @params 
 * @access public
 */
productRoute.get("/",getProducts);

/**
 * @desc Get Top Products 
 * @method GET
 * @route http://localhost:{PORT}/api/v1/products/top
 * @params 
 * @access public
 */
productRoute.get("/top",getTopProducts);

/**
 * @desc Creating a Product 
 * @method POST
 * @route http://localhost:{PORT}/api/v1/products
 * @params 
 * @access private/Admin
 */
productRoute.post("/",auth,isAdmin,createProduct);

/**
 * @desc Get  Product By ID
 * @method GET
 * @route http://localhost:{PORT}/api/v1/products/id
 * @params 
 * @access public
 */
productRoute.get("/:id",getProductById);

/**
 * @desc Updating a Product 
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/products
 * @params 
 * @access private/Admin
 */
productRoute.put("/:id",auth,isAdmin,updateProduct);

/**
 * @desc Deleting a Product 
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/products
 * @params 
 * @access private/Admin
 */
productRoute.delete("/:id",auth,isAdmin,deleteProduct);

productRoute.post("/:id/reviews",auth,isUser,createProductReview);

export default productRoute;