import jwt from "jsonwebtoken";


const generateToken = (res,user)=>{
    const payload = {
        email:user.email,
        role:user.role,

    }
    const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"1d",
    });

    const refreshToken = jwt.sign({_id :user._id},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"30d",
    });

    // set Jwt as HTTP-Only cookie
    // const options = {
    //     httpOnly:true,
    //     secure: true,
    //     sameSite:"None",
    // }

     res
     .cookie("accessToken",accessToken,{
        httpOnly:true,
        secure: true,
        sameSite:"None",
    })
     .cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure: true,
        sameSite:"None",
    });

    return {accessToken,refreshToken};
}

export default generateToken;