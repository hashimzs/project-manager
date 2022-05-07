const userslistReducer=(state=[],action)=>{
    switch(action.type){
        case('addusertolist'):
            let useralreadyregistered=false
            for (var i = 0; i < state.length; i++) {
                if (state[i]._id==action.payload._id) {
                    useralreadyregistered=true;
                    break;
                }
            }
            if (!useralreadyregistered) state.push(action.payload)
            return state
        case('remove'):
            console.log(action.payload)
            const newstate=state.filter((user)=>{
               return user._id!==action.payload
            })
            return newstate
        default:
            return state

    }

}

export default userslistReducer