import  Express  from "express";
import usersDAO from "./DAO/usersDAO.js"
import mongodb from "mongodb";
import app from "./server.js";
import dotenv from "dotenv";
import projectsDAO from "./DAO/projectsDAO.js"
import ticketDAO from "./DAO/ticketsDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient
const port =process.env.PORT

MongoClient.connect(
    process.env.BUGTRACKER_DB_URI, 
    {
        maxPoolSize: 50,
        wTimeoutMS:2500,
        useNewUrlParser: true
    })
    .catch(err => {
        console.log(err.stack)
        process.exit(1)
    })
    .then(async client =>{
        await usersDAO.injection(client)
        await projectsDAO.injectDB(client)
        await ticketDAO.inject(client)
        app.listen(port, () => {
            console.log("server is listening on port ",{port})
        })
    
    }
    )