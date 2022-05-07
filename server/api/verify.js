import jwt from "jsonwebtoken"

const verify=(req,res,next)=>{
    const token =req.header("authToken")
    if (!token) return res.status(400).json({error:"acces denied"})

    try{
        const verify=jwt.verify(token,process.env.SECRET)
        req.user=verify
        next();
    }catch(e){
        res.status(400).json({error:"acces denied"})
    }
}
export default verify