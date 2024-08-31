import {Router} from "express";
import {admin,
    customer,
    deleteUser,
    getUserById,
    getUsers,
    login,
    logout,
    refreshAccessToken,
    register,
    updateUser} from "../controllers/user.controller.js";
import { 
    auth, 
    isAdmin, 
    isUser } from "../middlewares/auth.middleware.js";

const userRoute = Router();
/**
 * @desc Login User
 * @method POST
 * @route http://localhost:{PORT}/api/v1/users/login
 * @params name,email,password,role
 * @access public
 */
userRoute.post("/login",login);
/**
 * @desc Register User
 * @method POST
 * @route http://localhost:{PORT}/api/v1/users/register
 * @params name,email,password,role
 * @access public
 */
userRoute.post("/register",register);
/**
 * @desc User Logout
 * @method POST
 * @route http://localhost:{PORT}/api/v1/users/logout
 * @access private
 */
userRoute.post("/logout",auth,logout);
/**
 * @desc Token Refresh
 * @method POST
 * @route http://localhost:{PORT}/api/v1/users/refresh-token
 * @access private
 */
userRoute.post("/refresh-token",refreshAccessToken);



/**
 * @desc Admin Profile
 * @method GET
 * @route http://localhost:{PORT}/api/v1/users/admin
 * @access private
 */
userRoute.get("/admin",auth,isAdmin,admin);
/**
 * @desc All Users 
 * @method GET
 * @route http://localhost:{PORT}/api/v1/users
 * @access private
 */
userRoute.get("/",auth,isAdmin,getUsers);
/**
 * @desc Individual User
 * @method GET
 * @route http://localhost:{PORT}/api/v1/users
 * @access private
 */
userRoute.get("/:id",auth,isAdmin,getUserById);
/**
 * @desc Update Individual User
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/users
 * @access private
 */
userRoute.put("/:id",auth,isAdmin,updateUser);
/**
 * @desc DELETE Individual User
 * @method DELETE
 * @route http://localhost:{PORT}/api/v1/users
 * @access private
 */
userRoute.delete("/:id",auth,isAdmin,deleteUser);


/**
 * @desc User Profile
 * @method GET
 * @route http://localhost:{PORT}/api/v1/users/customer
 * @access private
 */
userRoute.get("/customer",auth,isUser,customer);
/**
 * @desc Update User Profile
 * @method PUT
 * @route http://localhost:{PORT}/api/v1/users/:id
 * @access private
 */
userRoute.put("/:id",auth,isUser,updateUser);



export default userRoute;