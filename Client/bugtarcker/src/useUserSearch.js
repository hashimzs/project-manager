import {useEffect,useState} from 'react'
import {useSelector} from "react-redux"
import userDataService from './services/user.js'
import axios from 'axios'

export default function useUserSearch(query,pageNumber) {
    
    const test={
        teast_id:'12233',
        testnumber:'3123123',
        data:[]
    }
    const [isLoading,setisLoading]=useState(true)
    const [hasmore,sethasmore]=useState(true)
    const [users,setusers]=useState([])
    const user=useSelector(state=>state.user)
    const controller=new AbortController();
    const signal=controller.signal;

    useEffect(()=>{
      setusers([])
    },[query])
    
    useEffect(()=>{
        const data={search_name:query,page_number:pageNumber}
        setisLoading(true)
      try{
       axios({
         method:'put',
         url:'http://localhost:5000/api/v1/user/searchUsers',
         data:data,
         headers:user,
         signal:signal
       })
        .then(Response=>{
          setusers(preusers=>{
            return [...preusers , ...Response.data.users_list]

          })
          sethasmore(Response.data.users_list.length>0)
          setisLoading(false)
        })
      }catch(e){

      }
        return ()=>controller.abort()
    },[query,pageNumber])

  return {users,isLoading,hasmore}
}
