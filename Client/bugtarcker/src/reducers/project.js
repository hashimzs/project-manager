const projectReducer=(state=[],action)=>{
    const defaultstate={
        name:"",
        users:[],
        categories:[]
    }
    
    switch (action.type){
        case('setProject'):
            return action.payload
        case('adduser'):
            const newArray={...state,users:[...state.users,action.payload]}
            return newArray
        case('addcategory'):
            const newstate={...state,categories:[...action.payload]}
            return newstate
        default:
            return defaultstate
    }
}
export default projectReducer