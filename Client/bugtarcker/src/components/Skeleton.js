import React from 'react'
import  "./skeleton.css"
import {Link} from "react-router-dom"
import {AiOutlineArrowLeft} from "react-icons/ai"
const Skeleton = ({type}) => {

    const conuter=3
   const TicketsSkeleton =()=>{
       
       return(
        <>
        <div className="box-skl">
            <h6 className='titles-skl'></h6>

            <div className="dropable-col-skl">
                <div className="ticket-skl"></div>
                <div className="ticket-skl"></div>
                <div className="ticket-skl"></div>
            </div>
        </div>
        </>
       )
    
   } 
   const TicketMenu=()=>{
    return(
        <div className="main-body-menu-skl">
        <div className="project-info-skl">
            <div className="project-image-skl-2">
                
            </div>
            <div className="main-body-menu-title-skl">
                
            </div>
        </div>
       
        <button className="add-button-skl" >
             
        </button>
        </div>
    )
   }
   const Sidebar = () => {
       return(
       <div className="sidebar-skl">
            <Link to={'/Projects'} style={{textDecoration:'none'}}>
                 <div className="backbutton">
                    <AiOutlineArrowLeft></AiOutlineArrowLeft><span>All projects</span>
                </div>
            </Link>
            <div className="project-info-skl">
                <div className="project-image-skl">

                </div>
                <div className="project-title-skl">

                </div>
                <div className="category-title">
                        Category
                </div>
            </div>
            <div className="group">
                <div className={"categories-skl"} >
                <span> </span> 
            </div>
            <div className={"categories-skl"} >
                <span> </span> 
            </div>
            <div className={"categories-skl"} >
                <span> </span> 
            </div>
            <div className={"categories-skl"} >
                <span> </span> 
            </div>
            </div>
            
       </div>
       )
   }

  if (type === 'ticket') return Array(conuter).fill(<TicketsSkeleton/>)
   if (type === 'project') return <Sidebar/>
   if (type === 'menu') return <TicketMenu/>
  
}

export default Skeleton