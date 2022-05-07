const projectsReducer=(state=[],action)=>{
    switch (action.type){
        case('setProjects'):
            return action.payload
        case('add'):
            const newArray=[...state,action.payload]
            return newArray
        default:
            return state
    }
}
export default projectsReducer