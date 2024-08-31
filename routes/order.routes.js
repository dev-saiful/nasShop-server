import {Router} from "express";
import {addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders} from "../controllers/order.controller.js";
import { 
    auth, 
    isAdmin, 
    isUser } from "../middlewares/auth.middleware.js";

const orderRoute = Router();

//  user
orderRoute.post("/",auth,isUser,addOrderItems);
orderRoute.put("/:id/pay",auth,isUser,updateOrderToPaid);
orderRoute.get("/mine",auth,isUser,getMyOrders);
orderRoute.get("/:id",auth,isUser,getOrderById);

// admin
orderRoute.get("/",auth,isAdmin,getOrders);
orderRoute.put("/:id/deliver",auth,isAdmin,updateOrderToDelivered);


export default orderRoute;