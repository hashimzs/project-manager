import joi from "joi"

const registrationValidation=(data)=>{
    const schema=joi.object({
        name:joi.string()
                .min(6)
                .required(),
        email:joi.string()
                .min(6)
                .email()
                .required(),
        password:joi.string()
                    .min(6)
                    .required()
               
    })
    return schema.validate(data)
}

const loginValidation=(data)=>{
    const schema=joi.object({
        email:joi.string()
                .min(6)
                .required(),
        password:joi.string()
                    .min(6)
                    .required()
               
    })
    return schema.validate(data)
}
const validate={registrationValidation:registrationValidation,loginValidation:loginValidation}
export default validate