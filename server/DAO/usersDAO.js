import mongodb from "mongodb" 
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "express"

let users
const ObjectId=mongodb.ObjectId

export default class usersDAO{
    static async injection(conn){
        if (users)  return

        try{
            users=await conn.db(process.env.BUGTRACKER_NS).collection("users")
        }catch(e){
            console.error('unable to establis connecion handles in userDAO: ',e.message)
        }
    }

    static async register(name,email,Password){
        try{
            const emailExists= await users.findOne({email:email})
            if (emailExists) return {error:"email already exists"}

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(Password,salt)
            
            const userDoc={
                name:name,
                Password:hashPassword,
                email:email,
                projects:[]
            }
            

            users.insertOne(userDoc)
            return {status:"success"}
        }catch(e){
            console.error("can't user post user" )
            return {e:e}
        }
    }

    static async login(email,Password){
        const user= await users.findOne({email:email})
        if (!user) return {error:"account does not exists"}

        const validPassword=await bcrypt.compare(Password,user.Password)
        if (!validPassword) return {error:"password is wrong"}

        const token =  jwt.sign({_id:user._id},process.env.SECRET)

        delete user.Password
        return {token:token,user:{...user}}

    }
    static async getUserInfo(_id){
        try{
        const user=await users.findOne({_id:ObjectId(_id)},{projection:{Password:0,projects:0}})
        return user
        }
        catch(e){
            console.error("error while finding user"+e)
        }
    }
    
    static async SearchUsers(search_name,page_number=0){
        let cursor
        let query
        try{
            query={email:{$regex:new RegExp(search_name)}}
            cursor=await users.find(query).project({Password:0})
        }
        catch(e){
            console.error("error while extracting users from the database"+e)
        }
        const displayCursor=await cursor.limit(7).skip(7*page_number)
        try{
            const users_list=await displayCursor.toArray()
            const numberOfUsers= await users.countDocuments(query)
            return{users_list,numberOfUsers}
        }catch(e){
            console.error("unable to convert cursor to array or count documents, ",{e})
        }
    }

    static async addProject(user_id,project_id){
        try {
            const user=await users.findOne({$and:[{_id:ObjectId(user_id)},{projects:ObjectId(project_id)}]})
            if(user) return {status:"user already in project"}
        } catch (error) {
            console.error("error while chehcking if user is in the project "+ error.message)
        }
        
        try {
            await users.updateOne({_id:ObjectId(user_id)},{$push:{projects:ObjectId(project_id)}})
            return {status:"success"}
        }   catch (error) {
            console.error("error while updating project list " + error.message)
        } 
    }

    static async removeProject(user_id,project_id){
        try {
            await users.updateOne({_id:ObjectId(user_id)},{$pull:{projects:ObjectId(project_id)}})
            return {status:"success"}
        }   catch (error) {
            console.error("error while updating project list " + error.message)
        } 
    }
    static async find_Project_users(project_id){
        try {
            const users = await users.find({projects:project_id} )
        }catch (error){
            console.error("error while retrieving users " + error.message)
        }

    }

}
