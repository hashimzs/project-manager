import React,{useEffect,useState} from 'react'
import {Outlet, useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import {GrProjects} from 'react-icons/gr'
import {CgProfile} from "react-icons/cg"
import {MdSpaceDashboard} from "react-icons/md"
import {FaBars,FaSearch} from "react-icons/fa"
import {AiFillSetting} from "react-icons/ai"
import {BsSearch } from "react-icons/bs"
import logo from "./LogoMakr-6KRpip.png"
import userDataService from "../services/user.js"
import  "./home.css"
import {useDispatch} from "react-redux"
import getUser from "../commands/getuserinfo"
import signout from "../commands/signout"
import {Link,Route,Routes} from 'react-router-dom'
import removeuserfromlist from '../commands/removeuserfromlist'
import login from "../commands/login.js"
const Home = () => {
    const adduser= ()=>{
        setuserfocus(true)
        dispatch(signout())
    }
    const signOut=()=>{
        dispatch(signout())   
        dispatch(removeuserfromlist(user._id))
    } 
    const changeuser=(user)=>{
        dispatch(login(user))
    }
    const [userfocus,setuserfocus]= useState(false)
    const [activesidebar,setactivesidebar]=useState(false)
    const [activeButton,setactivebutton]=useState('dash')
    const [search,setsearch]=useState('')
    const dispatch=useDispatch()
    const activateButton=(type)=>{
       setactivebutton(type)
    }
    const navigate=useNavigate()
    const user=useSelector(state=>state.user)
    const user_list=useSelector(state=>state.userList)
    useEffect(()=>{
        if (user.authToken===null) return navigate("/login")

    },[user])
    return (
        <>
          <div className={activesidebar? ('navigate active'):('navigate')}>
             
            <ul>
                <Link to={"/"} style={{textDecoration: 'none'}}><li className={activeButton==='dash'?('active'):('')} onClick={()=>{setactivebutton('dash')}}  >
                    <b></b>
                    <b></b>
                    <MdSpaceDashboard className='icon' /> <span>Dashbaord</span>
                </li></Link>
                
                <Link to={"/projects"} style={{textDecoration: 'none'}}> <li className={activeButton==='projects'?('active'):('')} onClick={()=>{setactivebutton('projects')}}>
                    <b></b>
                    <b></b>
                    <GrProjects className='icon'/> <span>Projects</span>
                </li></Link>
               
                <Link to={"/profile"} style={{textDecoration: 'none'}}>
                     <li className={activeButton==='profile'?('active'):("")} onClick={()=>{setactivebutton('profile')}} >
                     <b></b>
                    <b></b>
                        <CgProfile className='icon'/> <span>Profile</span>
                    </li>
                </Link>
               
            </ul>
          </div>  
          <section className={userfocus? ('menu useractive'):('menu')}>
                <div className="pack">
                    <FaBars className='fabar' onClick={()=>{setactivesidebar(!activesidebar)}}/>
                <div className='logo'>
                  <img src={logo}></img>
                </div>  
                </div>
                
                <div className='search-bar'>
                    <BsSearch className='icon'></BsSearch>
                    <input type="text" className='search' placeholder='Search' value={search} onChange={(e)=>{setsearch(e.target.value)}} ></input>
                </div>
                <button className='user-button' onClick={()=>{setuserfocus(true)}}  onBlur={()=>{setuserfocus(false)}} >
                <div className={userfocus? ('user focus'):('user')} >
                    <div className="user-mage" >
                        {user.name.substr(0,1)}
                    </div>
                    <div className='user-info'  onBlur={()=>{setuserfocus(false)}}>
                        <div className="active-user">
                            <div className="user-mage" >
                                {user.name.substr(0,1)}
                            </div>
                            <div className="info">
                                <h5>{user.name}</h5>
                                <p>{user.email}</p>
                            </div>
                            
                        </div>
                        <div className="users-list">
                            <div className="heading">
                                <h6>Other profiles</h6>
                                <AiFillSetting className='icon'></AiFillSetting>
                            </div>
                            
                            
                                {user_list.map(userfromlist=>{
                                    if (userfromlist._id != user._id){
                                    return(
                                        
                                    <div className="users" onClick={()=>{changeuser(userfromlist)}}>
                                        
                                        <div className="user-mage" >
                                            {userfromlist.name.substr(0,1)}
                                        </div>
                                        <div className="info">
                                            <h5>{userfromlist.name}</h5>
                                        </div>
                                    </div>
                                    
                                    )}
                                })}
                                
                            
                            <div className='adduser'   onClick={adduser} ><span>+ Add users</span></div>
                        </div>
                        <div className='signout'  onClick={signOut} ><span>Sign out</span></div>
                    </div>  
                </div>
                </button>
          </section>

          <div className={activesidebar? ('pages active'):('pages')}>
                <Outlet></Outlet>
          </div>
          
          
        </>
    )
}

export default Home
    