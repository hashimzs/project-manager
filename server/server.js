import  Express from "express";
import cors from "cors";
import users from "./api/users.router.js";
const app=Express()
const corsOptions = {
    exposedHeaders: 'authtoken',
  };
app.use(cors(corsOptions))
app.use(Express.json())

app.use("/api/v1/user",users)
app.use("*",(req,res)=>{
    res.status(404).json({error:"not found"})
})



export default app;