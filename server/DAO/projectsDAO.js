
import mongodb from "mongodb";

let projects;
const ObjectId=mongodb.ObjectId
export default class projectsDAO{
    static async injectDB(conn){
        if (projects)  return

        try{
            projects=await conn.db(process.env.BUGTRACKER_NS).collection("projects")
        }catch(e){
            console.error('unable to establis connecion handles in userDAO: ',e.message)
        }
    }

    static async createProject(name,date,user){
        try{
            let project={
                _id: new ObjectId(),
                name:name,
                date:date,
                users:[{_id: ObjectId(user._id),role:user.role}],
                categories:[{category_id:new ObjectId(),category_name:'general'}]
            }
            await projects.insertOne(project)
            return project
        }catch(e){
            console.error('error while creating project: '+e)
        }
    }

    static async addUser(project_id,user){
        let project
        try{
        project=await projects.findOne(
                            {_id:ObjectId(project_id),users:{$elemMatch:{"_id":ObjectId(user._id)}}})
        }catch(e){
            console.error('couldnt find project '+e)
        }
        
        if(project) return {status:'user already added'}
        
        try{
        project=await projects.findOne(
                            {_id:ObjectId(project_id)},
                        )

        project.users.push({_id:ObjectId(user._id),role:user.role})

        projects.replaceOne(
                            {_id:ObjectId(project_id)},
                            project
        )}catch(e){
            console.error("couldn't add user to the database "+e)
        }
        return {status:'sucess user added'}
        
    }
    static async getprojects(user_id){
        const project=await projects.find({users:{$elemMatch:{"_id":ObjectId(user_id)}}}).project({users:0,categories:0}).toArray()
        return project
    }

    static async getproject(project_id,user_id){
        try{
            const project=await projects.findOne({$and:[{_id:ObjectId(project_id)},{users:{$elemMatch:{_id:ObjectId(user_id)}}}]})
           
            return project
        }catch(e){
            console.error("error while finding the project"+e)
        }
    }

    static async addcategory(user_id,project_id,category_name){
        let project
        try{
            project=await projects.findOne({_id:ObjectId(project_id),users:{$elemMatch:{_id:ObjectId(user_id)}}})
        }catch(e){
            console.error("couldn't find project "+e)
        }
        if (!project) return {error:'user is not in the project'}
        
        
        try{
            await project.categories.push({category_id:new ObjectId(),category_name:category_name})
            await projects.replaceOne({_id:ObjectId(project_id)},project)
            return {project}
        }catch(e){
            console.error("couldn't add category "+e)
        }
    }
    static async removecategory(user_id,project_id,category_id){
        let project
        try{
            project=await projects.findOne({$and:[{_id:ObjectId(project_id)},{users:{$elemMatch:{_id:ObjectId(user_id)}}}]})
        }catch(e){
            console.error("couldn't find project "+e)
        }
        if (!project) return {error:'user is not in the project'}
        
        
        try{
            await projects.updateOne({_id:ObjectId(project_id)},{$pull:{categories:{category_id:ObjectId(category_id)}}})
            return {success:"category removed succesfully"}
        }catch(e){
            console.error("couldn't remove category "+e)
        }
    }
    static async removeUser(user_id,project_id,userToBeRemoved){
        let project
        try{
            project=await projects.findOne({_id:ObjectId(project_id)})
        }catch(e){
            console.error("couldn't find project "+e)
        }
        if (!project) return {error:'user is not in the project'}

        try{
            await projects.updateOne({_id:ObjectId(project_id)},{$pull:{users:{_id:ObjectId(userToBeRemoved)}}})
            return {success:"user removed succesfully"}
        }catch(e){
            console.error("couldn't remove user: "+e)
        }

    }
}