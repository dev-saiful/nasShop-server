import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import orderModel from "../models/order.model.js";

// create order
const addOrderItems = asyncHandler(async(req,res)=>{
   const {orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice} = req.body;
    // checking
    if(orderItems && orderItems.length === 0)
    {
        throw new ApiError(400,"No order items");
    }
    else
    {
        // creating order
        const order = new orderModel({
            orderItems:orderItems.map((x)=>({
                ...x,
                product:x._id,
                _id:undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(200).json(
            new ApiResponse(201,createdOrder,"Order Created Successfully")
        );
    }
 });

// get user orders
const getMyOrders = asyncHandler(async(req,res)=>{
    const orders = await orderModel.find({user:req.user._id});
    res.status(200).json(
        new ApiResponse(200,orders,"Orders Found")
    );
});

// get order by Id
const getOrderById = asyncHandler(async(req,res)=>{
    const order = await orderModel.findById(req.params.id).populate("user","name email");
    console.log(order);
    if(order)
    {
        // new ApiResponse(200,order,"Order Found");
        res.status(200).json(
            new ApiResponse(200,order,"Order Found")
          );
    }
    else
    {
        throw new ApiError(404,"Order not found");
    }
});

// update payment
const updateOrderToPaid = asyncHandler(async(req,res)=>{
    const order = await orderModel.findById(req.params.id);
    if(order)
    {
        order.isPaid = true;
        order.paidAt = Date.now();
        // come from paypal
        order.paymentResult = {
            id: req.body.id,
            status:req.body.status,
            update_time : req.body.update_time,
            email_address: req.body.email_address,
        };

        const updateOrder = await order.save();
        res.status(200).json(
            new ApiResponse(200,updateOrder,"Order updated")
        );
    }
    else
    {
       throw new ApiError(404,"order not found");
    }
});

// update delivery
const updateOrderToDelivered = asyncHandler(async(req,res)=>{
    const order = await orderModel.findById(req.params.id);
    if(order)
    {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        
        res.status(200).json(
            new ApiResponse(200,updatedOrder,"Order updated")
        );
    }
    else
    {
        throw new ApiError(404,"order not found");
    }
});
//  get  all orders
const getOrders = asyncHandler(async(req,res)=>{
    const orders = await orderModel.find({}).populate("user","id name");
    res.status(200).json(
        new ApiResponse(200,orders,"Orders Fetched")
    );
});

export {addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders};