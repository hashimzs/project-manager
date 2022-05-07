import  Express  from "express";
import userController from "./users.controller.js";
import projectsController from "./projects.controller.js";
import ticketController from "./tickets.controller.js";
import verify from "./verify.js"; 
const users=Express.Router()
users.route("/").get((req,res)=>{
    res.send("hello")
})
users.route("/register").post(userController.apiSignUp)
users.route("/login").post(userController.apiSignIn)
users.route("/getuser").get(verify,userController.apiGetInfo)
users.route("/searchUsers").put(verify,userController.apiSearchUser)


users.route("/project")
    .post(verify,projectsController.createProject)
    .put(verify,projectsController.addUser)
    .get(verify,projectsController.getprojects)

users.route("/project/removeUser").put(verify,projectsController.removeuser)

users.route("/project/addcate")
        .put(verify,projectsController.addcategory)
users.route("/project/removecate")
        .put(verify,projectsController.removecategory)

users.route('/project/:project_id')
        .get(verify,projectsController.getproject)

users.route('/ticket')
        .post(verify,ticketController.createticket)
        .get(verify,ticketController.getTicketById)
        .put(verify,ticketController.editTicket)

users.route('/ticket/:project_id/:category_id')
        .get(verify,ticketController.getTicketByProject)

export default users