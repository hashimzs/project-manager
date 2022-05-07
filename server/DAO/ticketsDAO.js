import { ObjectId } from "mongodb"

let tickets

export default class ticketDAO{
    static async inject(conn){
        if (tickets) return 
        try{
            tickets=await conn.db(process.env.BUGTRACKER_NS).collection('tickets')
        }catch(e){
            console.error('error while connecting to the collection tickets '+e)
        }
    }
    static async createTicket(project_id,user_id,due_date,category_id,task,post_date){
       
       try{
        const ticket={
            _id:new ObjectId(),
            category_id:ObjectId(category_id),
            project_id:ObjectId(project_id),
            user_id:ObjectId(user_id) ,
            start_date:post_date,
            due_date:due_date,
            task:task,
            status:'pending'
        }
        await tickets.insertOne(ticket)
        return ticket
    }
        catch(e){
            console.error("error while inserting the ticket "+e)
        }
    }
    static async editTicket(ticket_id,status){
        await tickets.updateOne(
            {_id:ObjectId(ticket_id)},
            {$set:{status:status}}
        )
    }
    static async getTicketsByProject(project_id,category_id){
        try{
        const pendingTicket= tickets.find({$and:[{project_id:ObjectId(project_id)},{category_id:ObjectId(category_id)},{status:'pending'}]}).toArray()
        const inProgressTicket= tickets.find({$and:[{project_id:ObjectId(project_id)},{category_id:ObjectId(category_id)},{status:'inProgress'}]}).toArray()
        const readyTicket= tickets.find({$and:[{project_id:ObjectId(project_id)},{category_id:ObjectId(category_id)},{status:'ready'}]}).toArray()
        const ticketHolder=await Promise.all([pendingTicket, inProgressTicket, readyTicket])
        const ticket=                      ({pending:{
                                                title:"pending",
                                                items:[...ticketHolder[0]]},
                                        inProgress:{
                                                title:"inProgress",
                                                items:[...ticketHolder[1]]},
                                        ready:{
                                                title:"ready",
                                                items:[...ticketHolder[2]]}
                                        });   
        return ticket
        }catch(e){
            console.error('error while retrieving tickets: '+e)
        }
    }
    static async getTicketsByUserId(user_id){
        const ticket=tickets.find({"user.user_id":ObjectId(user_id)}).project({user:0}).toArray()
        return ticket
    }
}