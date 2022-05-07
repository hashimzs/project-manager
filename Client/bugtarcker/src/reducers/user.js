

const userReducer=(state={authToken:null,name:'name'},action)=>{
    switch (action.type){
        case('login'):
            return {...action.payload}
        case('getuser'):
            return {...state,...action.payload}
        case('signout'):
            return {authToken:null,name:'name'}
        default:
            return state;
    }

}

export default userReducer