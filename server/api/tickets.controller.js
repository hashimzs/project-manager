
import ticketDAO from "../DAO/ticketsDAO.js"
import userDAO from "../DAO/usersDAO.js"

export default class ticketController{
    static async createticket(req,res,next){
        try{
            const task=req.body.task
            const project_id=req.body.project_id
            const user_id=req.body.user_id
            const start_date=req.body.startDate
            const due_date=req.body.dueDate
            const category_id=req.body.category_id
            const ticket=await ticketDAO.createTicket(project_id,user_id,due_date,category_id,task,start_date)
            res.json(ticket) 
        }catch(error){
            console.error(error.message)
        }
    }
    static async editTicket(req,res,next){
        try {
        const status=req.body.status
        const ticket_id=req.body.ticket_id
        await ticketDAO.editTicket(ticket_id,status)
        return res.json({status:"sucess"})
    } catch (error) {
            console.error("error while editing tickets status: "+error.message)
    }
    }
    static async getTicketByProject(req,res,next){
        try {
            
        
        const project_id=req.params.project_id
        const category_id=req.params.category_id
        const ticket=await ticketDAO.getTicketsByProject(project_id,category_id)
        const pendingTicketPromises=ticket.pending.items.map( async ticket=>{
            const ticketHolderDetails= await userDAO.getUserInfo(ticket.user_id)
            const newTicket={...ticket,user:{...ticketHolderDetails}}
            return newTicket
        })
        const inProgressTicketPromises=ticket.inProgress.items.map( async ticket=>{
            const ticketHolderDetails= await userDAO.getUserInfo(ticket.user_id)
            const newTicket= await {...ticket,user:{...ticketHolderDetails}}
            return newTicket
        })
        const readyTicketPromises=ticket.ready.items.map( async ticket=>{
            const ticketHolderDetails= await userDAO.getUserInfo(ticket.user_id)
            const newTicket=await {...ticket,user:{...ticketHolderDetails}}
            return newTicket    
        }) 
      
        const pendingTickets= await Promise.all(pendingTicketPromises) 
        const inProgressTickets= await Promise.all(inProgressTicketPromises)
        const readytickets= await Promise.all(readyTicketPromises)
        
        ticket.pending.items=pendingTickets
        ticket.ready.items=readytickets
        ticket.inProgress.items=inProgressTickets
       
        res.json(ticket)
    } catch (error) {
        console.error(error)       
    }
    }
    static async getTicketById(req,res,next){
        const user_id=req.user._id
        const tickets=await ticketDAO.getTicketsByUserId(user_id)
        res.json(tickets)
    }
}