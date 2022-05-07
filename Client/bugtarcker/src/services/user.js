import http from "../httpcommon.js";

class userDataService{
    signin(data){
        return http.post('/user/login',data)
    }

    signup(data){
        return http.post('user/register',data)
    }
    getUserInfo(data){
        return http.get('user/getuser',{headers:data})
    }
    getusers(data,header,signal){
        return http.put("user/searchUsers",data,{headers:header},{signal:signal})
    }
    getprojects(data){
        return http.get('user/project',{headers:data})
    }
    addproject(data,header){
        return http.post('user/project',data,{headers:header})
    }
    addusertoproject(data,header){
        return http.put('user/project',data,{headers:header})                                                                                                                                                                                                                                                                                                               
    }
    addcategory(data,header){
        return http.put("user/project/addcate",data,{headers:header})
    }
    removecategory(data,header){
        return http.put('user/project/removecate',data,{headers:header})
    }
    getProjectInfo(project_id,header){
        return http.get(`user/project/${project_id}`,{headers:header})
    }
    removeUserFromProject(data,header){
        return http.put('user/removeUser',data,{headers:header})
    }
    getusertickets(header){
        return http.get('user/ticket',{headers:header})
    }
    getTickets(project_id,category_id,header){
        return http.get("user/ticket/"+project_id+"/"+category_id,{headers:header})
    }
    addTicket(data,header){
        return http.post('user/ticket',data,{headers:header})
    }
    changeStatus(data,header){
        return http.put('user/ticket',data,{headers:header})
    }

}

export default new userDataService();