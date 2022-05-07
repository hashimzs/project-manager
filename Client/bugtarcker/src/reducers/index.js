import userReducer  from "./user";
import projectsReducer from "./projects"
import userlistReducer from "./user-list"
import {combineReducers} from "redux"
import projectReducer from "./project";

const allReducers=combineReducers({
    user:userReducer,
    userList:userlistReducer,
    projects:projectsReducer,
    project:projectReducer
})

export default allReducers