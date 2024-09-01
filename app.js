import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";
import orderRoute from "./routes/order.routes.js";
import uploadRoute from "./routes/upload.routes.js";
import { errorHandler,notFound } from "./middlewares/error.middleware.js";
import job from "./cron.js";

dotenv.config();
job.start();

export const app = express();
/**
 * @desc middlewares needed
 */
app.use(cors({
    origin:["https://nasstore.vercel.app"],
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/v1/users",userRoute);
app.use("/api/v1/products",productRoute);
app.use("/api/v1/orders",orderRoute);
app.use("/api/v1/upload",uploadRoute);

app.get("/api/config/paypal",(req,res)=>{
    res.send({clientId : process.env.PAYPAL_CLIENT_ID});
});


app.get("/",(req,res)=>{
   
        res.send("Api is running");
});

app.use(notFound);
app.use(errorHandler);