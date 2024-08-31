import bcrypt from "bcrypt";
import {asyncHandler} from "../utils/asyncHandler.js";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { checkEmpty, isEmail, isEmpty, isMatch } from "../utils/validate.js";
import { ApiResponse } from "../utils/apiResponse.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const register = asyncHandler(async(req,res)=>{
    const {name,email,password,confirmPassword,role} = req.body;
    // checking empty field
    const isEmpty = checkEmpty(name,email,password,confirmPassword);
    if(isEmpty)
    {
        throw new ApiError(400,"Field must be filled up");
    }
    // checking valid email
    if(!isEmail(email))
    {
        throw new ApiError(400,"Invalid Email Address");
    }
    // checking user already exists
    const userExists = await userModel.findOne({email});
    if(userExists)
    {
        throw new ApiError(400,"User Alreday Exists");
    }
    // checking password is match or not
    if(!isMatch(password,confirmPassword))
    {
        throw new ApiError(400,"Mismatch passwords");
    }
    // hashing password
    const hashpass = await bcrypt.hash(password,10);

    // creating user
    const user = await userModel.create({
        name,
        email,
        password:hashpass,
        role,
    });

    const createdUser = await userModel.findById(user._id).select("-password");

    if(!createdUser)
    {
       throw new ApiError(500,"Something went wrong while registering user");
    }

    return res.status(201).json(
        // new  ApiResponse(200,createdUser,"User Register Successfully")
        new ApiResponse(200,{userFound:createdUser},"Register Successfull.")
    );


});

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    // checking empty field
    if(isEmpty(email,password))
    {
        throw new ApiError(400,"Field must be filled up");
    }
    // checking valid email
    if(!isEmail(email))
    {
        throw new ApiError(400,"Invalid Email Address");
    }
    // checking email is exists
    const userFound = await userModel.findOne({email});
    if(!userFound)
    {
        throw new ApiError(404,"User Not Found");
    }

    // compare password
    const matchPassword = await bcrypt.compare(password,userFound.password);
    if(!matchPassword)
    {
        throw new ApiError(400,"Incorrect Password");
    }

    // all is ok then create payload
    const {accessToken,refreshToken} = generateToken(res,userFound);
    userFound.refreshToken = refreshToken;
    await userFound.save({validateBeforeSave:false});
    userFound.password = undefined;
    userFound.refreshToken = undefined;
    if(accessToken)
    {
        return res.status(200).json(
            new ApiResponse(200,
                {
                    userFound,accessToken,refreshToken
                },"Logged In Successfully")
        );
    }
    else
    {
        throw new ApiError(500,"Something went wrong while logging user");
    }

});

const logout = asyncHandler(async(req,res)=>{
    await userModel.findByIdAndUpdate(req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true,
        }
        );

        const options = {
            httpOnly:true,
            secure: true,
            sameSite:"None",
        };

        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            new ApiResponse(200,{},"User Logged Out")
        );
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.header("Authorization").replace("Bearer ","") || req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"unauthorized request");
    }
    try
    {
        const decode = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );

        const user = await userModel.findById(decode?._id);
        if(!user)
        {
            throw new ApiError(401,"Invalid refresh token");
        }

        if(incomingRefreshToken !== user?.refreshToken)
        {
            throw new ApiError(401,"refresh token is expired or used");
        }

        const options = {
            httpOnly:true,
            secure: process.env.NODE_ENV !== "development",
            sameSite:"strict",
            maxAge: 30*24*60*60*1000,
        }

        const {accessToken,newRefreshToken} =  generateToken(res,user);
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"Access token refreshed")
        )
    }
    catch(error)
    {
        throw new ApiError(401,error?.message || "Invalid refresh token");
    }
})

const admin = (req,res)=>{
    res.status(200).json({
        message:"Admin Dashboard",
    })
}

const customer = (req,res)=>{
    res.status(200).json({
        message:"Customer Dashboard",
    })
}

const getUsers = asyncHandler(async(req,res)=>{
    const users = await userModel.find({});
    res.status(200).json(
        new ApiResponse(200,users,"Fetch All users")
    );
})

const getUserById = asyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.params.id);
    if(user)
    {
        res.status(200).json(
            new ApiResponse(200,user,"Fetch  user").select("-password")
        );
    }
    else
    {
        throw new ApiError(404,"user not found");
    }
 
})

const deleteUser = asyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.params.id);
    if(user)
    {
        if(user.role === "Admin")
        {
            throw new ApiError(400,"Cannot delete admin user");
        }
        await userModel.deleteOne({_id:user._id});
        res.status(200).json(
            new ApiResponse(200,null,"User delete successfully")
        );
    }
    else
    {
        throw new ApiError(404,"user not found");
    }
 
})

const updateUser = asyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.params.id);
    if(user)
    {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
       
        const updatedUser = await user.save();

        res.status(200).json(
            new ApiResponse(200,{
                _id:updatedUser._id,
                name:updatedUser.name,
                email:updatedUser.email,
                role:updatedUser.role,

            },"User updated successfully")
        );
        
    }
    else
    {
        throw new ApiError(404,"user not found");
    }
 
})


export {register,login,admin,customer,logout,refreshAccessToken,getUsers,getUserById,deleteUser,updateUser};