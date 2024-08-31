import validator from "validator";


const checkEmpty = (name,email,password,confirmPassword)=>{

    return validator.isEmpty(validator.trim(name))||validator.isEmpty(validator.trim(email))||validator.isEmpty(password)||validator.isEmpty(confirmPassword);
}

const isEmpty = (email,password)=>{
    return validator.isEmpty(validator.trim(email)) || validator.isEmpty(password);
}

const isEmail = (email)=>{
    return validator.isEmail(email);
}

const isMatch = (password,confirmPassword)=>{
    return validator.equals(password,confirmPassword);
}

export {checkEmpty,isEmail,isMatch,isEmpty};
