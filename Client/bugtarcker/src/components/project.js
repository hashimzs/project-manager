import React, { useEffect, useState,useRef, useCallback } from 'react'
import {AiOutlineArrowLeft,AiOutlineUserAdd,AiOutlineFolderAdd} from 'react-icons/ai'
import {FiMoreHorizontal} from 'react-icons/fi'
import {BsDoorClosedFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {useParams} from "react-router-dom";
import {Outlet, useNavigate} from "react-router-dom"
import userDataService from '../services/user.js'
import setproject from '../commands/setproject.js'
import addusertoproject from '../commands/addUserToProject.js'
import addcategorycommand from '../commands/addcategory.js'
import 'simplebar/dist/simplebar.min.css';
import "./project.css"
import useUserSearch from '../useUserSearch.js'
import { useDispatch,useSelector } from 'react-redux'
import Skeleton from "./Skeleton.js"
const Project = () => {
    const dispatch=useDispatch()
    const [ativeCategory,setactivecategory]=useState('general')
    const [category,setCategory]=useState('')
    const [addcategory,setcategory]=useState(false)
    const [selectedUser,setSelectedUser]=useState({selected:false})
    const [moreOptions,SetMoreOptions]=useState(false)
    const [query,setquery]=useState('')
    const [pageNumber,setPageNumber]=useState(0)
    
    const project=useSelector(state=>state.project)
    const [adduser,setadduser]=useState(false)
    const observer=useRef()
    const {users,isLoading,hasmore}=useUserSearch(query,pageNumber)
    const [isloading,setisloading]=useState(true)
    const lastelement=useCallback(node=>{
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current=new IntersectionObserver(entries=>{
            if (entries[0].isIntersecting  && hasmore  ){
                setPageNumber(prevPageNumber=>prevPageNumber+1)
            }
        })
        if (node) observer.current.observe(node)
    },[isLoading,hasmore])
    let navigate=useNavigate();
    let {project_id}=useParams();
    const user=useSelector(state=>state.user)
    const setaddcategory=(value)=>{
        setcategory(value)
    }
    const handleSearch=(e)=>{
        setquery(e.target.value)
        setPageNumber(0)
    }
    const selectUser=(user)=>{
        setSelectedUser({...user ,selected:true})
    }
    const addUser=()=>{   
        setSelectedUser({selected:false})
        if(selectedUser===null) return
        userDataService.addusertoproject({...selectedUser,project_id:project._id},user).then((res)=>{
            dispatch(addusertoproject(res.data))
        })
        
    }
    const addcate=()=>{
        userDataService.addcategory({project_id:project._id,category_name:category},user).then(res=>{
            dispatch(addcategorycommand(res.data.project.categories))
            setaddcategory(false)
        })
    }
    const leaveTeam=()=>{
        userDataService.removeUserFromProject({project_id:project_id,_id:user._id},user).then(res=>{
            navigate('/projects')
        })
    }
    
    useEffect(()=>{
        const getinfo=async()=>{
            setisloading(true)
            const res = await userDataService.getProjectInfo(project_id,user)
            dispatch(setproject(res.data))     
            navigate(`/projects/${project_id}/category/${res.data.categories[0].category_id}`)
            setactivecategory(res.data.categories[0].category_name)
            setisloading(false)
        }
       getinfo()
        
    },[])
    return (
        <>
             <div className='sidebar' >
                 {isloading?
                 (<Skeleton type="project"></Skeleton>):
                 (
                    <>
                    <Link to={'/Projects'} style={{textDecoration:'none'}}>
                 <div className="backbutton">
                    <AiOutlineArrowLeft></AiOutlineArrowLeft><span>All projects</span>
                </div>
                </Link>
                <div className="project-info">
                    <div className="project-image">
                        {project.name.charAt(0)}
                    </div>
                    <div className="project-title">
                        {project.name}
                        <button > <span><FiMoreHorizontal ></FiMoreHorizontal></span>
                        <div className='listofoptions'>
                            <div className="option" onClick={()=>{setadduser(true)}}>
                                <AiOutlineUserAdd></AiOutlineUserAdd>
                                Add users
                            </div>
                            <div className="option" onClick={()=>{setaddcategory(true)}}>
                                <AiOutlineFolderAdd></AiOutlineFolderAdd>
                                Add category
                            </div>
                            <div className="option" onClick={leaveTeam}>
                                <BsDoorClosedFill></BsDoorClosedFill>
                                Leave the team
                            </div>
                        </div>
                        
                        </button>
                        
                                  
                    </div>
                    <div className="category-title">
                        Category
                    </div>


                </div>
                
                {project.categories.map(category=>{
                    return(
                        <Link style={{textDecoration: 'none', color:'black'}} to={`/projects/${project_id}/category/${category.category_id}`} >
                        <div className={category.category_name===ativeCategory? ("categories active"):("categories")} onClick={()=>setactivecategory(category.category_name)}>
                            <span> {category.category_name}</span> 
                        </div>
                        </Link>
                    )
                })}
                    </>

                 )

                 }
                

                
                
            </div>   
            {adduser &&
            
            <div className="input-tab">
                <div className="tab-2">
                        <div className="search-bar-2">
                            <p>Type a name or email to add.</p>
                            <input placeholder='Search' value={query} onChange={handleSearch}></input>
                            <div className="users-list-2">
                                {
                                    users.map((found,index)=>{
                                        if(users.length===index+1){
                                            return(
                                                <button ref={lastelement} className="user-1 active-user " onClick={()=>selectUser(found)}>
                                                    <div className="user-image" >
                                                        {found.name.substr(0,1)}
                                                    </div>
                                                    <div className="info">
                                                        <h5>{found.name}</h5>
                                                        <p>{found.email}</p>
                                                </div>
                                                </button>
                                            )
                                        }else{
                                           return(
                                            <button className="user-1 active-user " onClick={()=>selectUser(found)}>
                                                <div className="user-image" >
                                                    {found.name.substr(0,1)}
                                            </div>
                                            <div className="info">
                                                <h5>{found.name}</h5>
                                                <p>{found.email}</p>
                                            </div>
                                            </button>
                                        ) 
                                        }
                                        
                                    })
                                }
                                {isLoading && <p>isloading</p> }
                            </div>
                        </div>
                       
                       <div className="buttons buttons-2">
                            <button onClick={()=>{setadduser(false)}}>cancel</button> 
                            {selectedUser.selected?(<button type='button' onClick={addUser}  >Add memeber</button>):(<button type='button' style={{background:"gray"}} onClick={addUser}  >Add member</button>)}
                            
                             
                       </div>
                            
                            
                 </div>
            </div> 
            }
            {addcategory &&
                 <div className="input-tab">
                 <div className="tab">
                     <h3>add project</h3>
                     <div className="name-field">
                         <h4>Name</h4>
                         <input type="text" value={category}  onChange={(e)=>{setCategory(e.target.value)}} />
                     </div>  
                     <div className="buttons">
                         <button type='button'onClick={()=>[setaddcategory(false)]}>cancel</button>
                         <button type='button' onClick={addcate}>submit</button>
                     </div>
                     
                 </div> 
             </div>
            }
             
            
                
            
            <section className="main-body">
                {isloading?
                (<div className="container-2">
                    <Skeleton type='menu'/>
                    <Skeleton type="ticket"></Skeleton>
                </div>
                ):
                (<Outlet ></Outlet>)    
            }
                          
            </section>
            
        </>
    )
}

export default Project
