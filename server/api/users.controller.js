
import usersDAO from "../DAO/usersDAO.js"
import validate from "../validation.js"


export default class userController{
    static async apiSignUp(req,res,next){
        try{
            const {error}= validate.registrationValidation(req.body)
            if (error) return res.json({error:error.details[0].message})

            
            const name=req.body.name
            const email=req.body.email
            const Password=req.body.password

            const response=await usersDAO.register(name,email,Password)
            res.json(response)
        }
        catch(e){
            console.error("error while recieviong data")
        }
       
    }

    static async apiSignIn(req,res,next){
        try{
            const email=req.body.email
            const Password=req.body.password

            const response=await usersDAO.login(email,Password)
            
            if (response.error) return res.json(response)
            
            res.header("authtoken",response.token).json(response.user)
            

        }catch(e){
            console.error("error while recieviong data"+e)
        }
        
    }
    static async apiGetInfo(req,res,next){
        try{
            const _id=req.user._id
            
            const user=await usersDAO.getUserInfo(_id)
            res.json(user)
        }catch(e){
            console.error("error occured"+e)
        }
    }
    static async apiSearchUser(req,res,next){
        try{
            const search_name=req.body.search_name
            const pageNumber=req.body.page_number
            const users_list=await usersDAO.SearchUsers(search_name,pageNumber)
            res.json(users_list)
        }
        catch(e){
            console.error("error while searching for the users"+e)
        }
    }
}