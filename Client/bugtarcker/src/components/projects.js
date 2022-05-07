import React,{useState,useEffect} from 'react'
import {AiOutlineUsergroupAdd,AiOutlineArrowLeft} from 'react-icons/ai'
import userDataService from "../services/user.js"
import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import {RiArrowRightSFill} from "react-icons/ri"
import getprojects from "../commands/getprojects.js"
import addProject from '../commands/addproject.js'
import { Link } from 'react-router-dom'
import "./projects.css"
const Projects = () => {
    const [displayprojects,setdiplayprojects]=useState(true)
    const dispatch=useDispatch()
    const projects=useSelector(state=>state.projects)
    const user=useSelector(state=>state.user)
    useEffect(()=>{
        userDataService.getprojects(user).then(
            Response=>{
                  dispatch(getprojects(Response.data)) 
            }
        )
    },[])
    const creatingproject=()=>{
        userDataService.addproject({name:projectname},user).then(
            Response=>{
                setaddproject(false)
                setprojectname("")
                setcreateprojectpopup(false)
                dispatch(addProject(Response.data))
            }
        )
    }
    const [projectname,setprojectname]=useState("")
    const [createprojectpopup,setcreateprojectpopup]=useState(false)
    const [createproject,setcreateproject]=useState(false)
    const [joinproject,setjoinproject]=useState(false)
    const [addproject,setaddproject]=useState(false)
    return (
        <>
        
        {addproject? (
            <section className='container3'>
                <div className="header">
                    <button type='button'className='backbutton' onClick={()=>{setaddproject(false)}}>
                        <AiOutlineArrowLeft></AiOutlineArrowLeft>Back
                    </button>
                </div>
              <h3>Join or create a project</h3>
              <div className='options-2'>
                    <div className="box-2" onMouseEnter={()=>{setcreateproject(true)}} onMouseLeave={()=>{setcreateproject(false)}}>
                        <div className="image"></div>
                        <h4>Create a project</h4>
                        <div className="imagerow">
                            <div className="image3"></div>
                            <div className="image3"></div>
                            <div className="image3"></div>
                        </div>
                        <div className="shifter-container">
                        {createproject?(
                            <button className='create-button' type='button' onClick={()=>[setcreateprojectpopup(true)]}><AiOutlineUsergroupAdd className='icon'></AiOutlineUsergroupAdd>Create project</button>
                        ):(
                            <p>Bring everyone together and get to work!</p>
                        )}
                        </div>
                        
                        
                    </div>
                    <div className="box-2" onMouseEnter={()=>{setjoinproject(true)}} onMouseLeave={()=>{setjoinproject(false)}}>
                        <div className="image"></div>
                        <h4>Join a project with a code</h4>
                        <input type="text" placeholder='Enter code'></input>
                        <div className="shifter-container">
                        {joinproject? (
                            <button className='join-button' type='button'>Join project</button>
                        ):(
                            <p> got a code to join a project? Enter it above.</p>
                        )}
                        
                        </div>
                        
                    </div>
                    {createprojectpopup &&
                    <div className="input-tab">
                        <div className="tab">
                            <h3>Create project</h3>
                            <div className="name-field">
                                <h4>Name</h4>
                                <input type="text" value={projectname} onChange={(e)=>{setprojectname(e.target.value)}} />
                            </div>  
                            <div className="buttons">
                                <button type='button'onClick={()=>[setcreateprojectpopup(false)]}>cancel</button>
                                <button type='button' onClick={()=>{creatingproject()}}>submit</button>
                            </div>
                            
                        </div> 
                    </div>
                    
                    }
                    
              </div>
            </section>
             
        ):(<>
            <section className='container3'>
            <div className='header'>
                <h4>Projects</h4>
                <div className='addbutton'>
                    <button type='button' onClick={()=>{setaddproject(true)}}>
                        <AiOutlineUsergroupAdd className='icon'></AiOutlineUsergroupAdd>
                        add or create project
                    </button>
                </div>
            </div>
            <div className="project-tab">
                <button><h5 onClick={()=>{setdiplayprojects(!displayprojects)}}>Your projects <RiArrowRightSFill className={displayprojects? ('arrow active'):('arrow')}></RiArrowRightSFill></h5></button>
              
            </div>
           </section>
           <div className="projects">
                {displayprojects &&
                    projects.map((project)=>{
                        return(
                        <Link to={"/projects/"+project._id} style={{textDecoration: 'none', color:'black'} }>
                        <div className='project'>
                        <div className="image">
                            {project.name.substr(0,2)}
                        </div>
                        <h4>{project.name}</h4>
                       </div> 
                       </Link>)
                        }) 
                }
                </div>
           </>
        )}
        </>
    )
}
export default Projects