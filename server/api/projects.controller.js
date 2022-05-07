
import {ObjectId} from "mongodb" 
import projectsDAO from "../DAO/projectsDAO.js";
import { ConnectionCheckOutFailedEvent } from "mongodb";
import usersDAO from "../DAO/usersDAO.js";
import { response } from "express";

export default class projectsController{
    static async createProject(req,res,next){
        try{
        const name=req.body.name
        const date= new Date()
        const user_id=req.user._id
        let user=await usersDAO.getUserInfo(user_id)
        user={_id:user_id,role:"Admins"}
        const project=await projectsDAO.createProject(name,date,user)
        await usersDAO.addProject(user_id,project._id)
        res.json(project)
    }catch(e){
        console.error('error occurred while receiving project data'+e)
        }
    }   

    static async addUser(req,res,next){
        try{
            const project_id=req.body.project_id
            const user={
                _id:ObjectId(req.body._id) ,
                name:req.body.name,
                email:req.body.email,
                role:""
            } 
            const res1= projectsDAO.addUser(project_id,user)
            const res2= usersDAO.addProject(user._id,project_id)
            await Promise.all([res1,res2])
            res.json(user)
        }catch(e){
            console.error('couldnt add user '+e)
        }
    }

    static async getprojects(req,res,next){
        try{
            const user_id=req.user._id
            const projects=await projectsDAO.getprojects(user_id)
            res.json(projects) 
        }catch(e){
            console.error("couldn'yt get projects"+e)
        }
    }

    static async getproject(req,res,next){
        try{
            const user_id=req.user._id
            const project_id=req.params.project_id
            let project= await projectsDAO.getproject(project_id,user_id)
            const promises=project.users.map(async user=>{
                const userDetails=await usersDAO.getUserInfo(user._id)
                return userDetails
            })
            const users=await Promise.all(promises)
            project.users=users
            res.json(project)
        }catch(e){
            console.error("error while finding the project"+e)
        }
    }

    static async addcategory(req,res,next){
        try{
            const user_id=req.user._id
            const project_id=req.body.project_id
            const category_name=req.body.category_name
            const result =await projectsDAO.addcategory(user_id,project_id,category_name)
            if (result.error) return res.status(400).json(result)
            res.json(result)
        }catch(e){
            console.error("couldn't add category "+e)
        }
    }
    static async removecategory(req,res,next){
        try{
            const user_id=req.user._id
            const project_id=req.body.project_id
            const category_id=req.body.category_id
            const result =await projectsDAO.removecategory(user_id,project_id,category_id)
            if (result.error) return res.status(400).json(result)
            res.json(result)
        }catch(e){
            console.error("couldn't add category "+e)
        }
    }

    static async removeuser(req,res,next){
        try{
            const user_id=req.user._id
            const userToBeremoved=req.body._id
            const project_id=req.body.project_id
            const result =await projectsDAO.removeUser(user_id,project_id,userToBeremoved)
            if (result.error) return res.status(400).json(result)
            const result2 = await usersDAO.removeProject(userToBeremoved,project_id)
            res.json(result)

        }catch(e){
            console.error('error while recieving data or removing a user from a project: '+e)
        }
    }


}