const login=(person)=>{
    return{
        type:"login",
        payload:person
    }
}
export default login