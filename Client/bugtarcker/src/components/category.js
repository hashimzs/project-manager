import React,{useEffect,useState} from 'react';
import userDataService from "../services/user.js"
import {DragDropContext,Draggable,Droppable} from 'react-beautiful-dnd'
import _ from 'lodash'
import {useSelector} from "react-redux"
import { useParams } from 'react-router-dom';
import {IoIosArrowDown} from 'react-icons/io'
import Skeleton from './Skeleton.js'
import {Temporal} from "@js-temporal/polyfill"
const Category = () => {
  


    const initialState={

        "pending":{
            title:"pending",
            items:[]
        },
        "inProgress":{
            title:"inProgress",
            items:[]
        },
        "ready":{
            title:"ready",
            items:[]
        }
    }
    
    
    const now=Temporal.Now.plainDateISO().toString();
    const [selectedUser,setSelectedUser] = useState({name:'select a user', email:""})
    const {project_id,cate}=useParams();
    const [tickets,setTickets]=useState(initialState)
    const {users}=useSelector(state=>state.project)
    const user=useSelector(state=>state.user)
    const [addTicket,setAddTicket]=useState({add:false,task:"",  dueDate:now,startDate:now})
    const [isLoading,setLoading] = useState(true)
    
    const findDuartion=(startDate,dueDate)=>{

        const startdate=new Temporal.PlainDate.from(startDate)
        const duedate=new Temporal.PlainDate.from(dueDate)
        const duration=startdate.until(duedate).days
      
        return duration
    }
    const isDue=(startDate,dueDate)=>{
        const startdate=new Temporal.PlainDate.from(startDate)
        const duedate=new Temporal.PlainDate.from(dueDate)
        const sign=startdate.until(duedate).sign
      
        return sign
    }


    const handleDragEnd=({destination,source})=>{
        if (!destination) return 

        if (destination.index===source.index && destination.droppableId === source.droppableId) return

        if (user._id !== tickets[source.droppableId].items[source.index].user._id) return

        const item={...tickets[source.droppableId].items[source.index]}

        setTickets(prev=>{
            prev={...prev}
            prev[source.droppableId].items.splice(source.index,1)
            prev[destination.droppableId].items.splice(destination.index,0,item)
            return prev

        })
        userDataService.changeStatus({status:destination.droppableId,ticket_id:item._id},user)
    }
    const submitTicket=()=>{
        const ticket={
            task:addTicket.task,
            user_id:selectedUser._id,
            startDate:addTicket.startDate,
            dueDate:addTicket.dueDate,
            project_id:project_id,
            category_id:cate,
        }
        console.log(ticket)
        console.log(selectedUser)
        userDataService.addTicket(ticket,user).then(res=>{
            setTickets(prev=>{
                const ticket={...res.data,user:{...selectedUser}}
                prev={...prev}
                const tickets={...prev, 
                                pending:{
                                title:"pending",
                                items:[...prev.pending.items,ticket]
                            }}
                return tickets
                
            })
        })
    }
    const handleChange=(e)=>{
        setAddTicket(prev=>{
            prev={...prev}
            prev.task=e.target.value
            return prev
        })

    }


    useEffect(()=>{
        const get_tickets= async()=>{
                setLoading(true)
                const res= await userDataService.getTickets(project_id,cate,user)
                setTickets(res.data)
                setLoading(false)
        }
        get_tickets() 
            
    },[])



  return <>
      <div className="container-2">
                {isLoading?
                (<Skeleton type={'menu'}/>)
                :
                (
                    <div className="main-body-menu">
                    <div className="project-info">
                        <div className="project-image">
                            H
                        </div>
                        <div className="main-body-menu-title">
                            Tickets
                        </div>
                    </div>
                   
                    <button className="add-button" onClick={()=>{setAddTicket(prev=> {return {...prev,add:true}})}}>
                        Add Ticket 
                    </button>
                </div>
                )

                }


                
               {isLoading?
                (<Skeleton type="ticket"></Skeleton>)   :
                ( <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(tickets,(cate,key)=>{
                        return(
                        <div className="box">
                            <h6 className={cate.title}>{cate.title}</h6>
                            <Droppable droppableId={key}>
                            {(provided)=>{
                                return(
                                <div className="dropable-col" 
                                ref={provided.innerRef} 
                                {...provided.droppableProps}
                                >
                                    {cate.items.map((item,index)=>{
                                        return(
                                            <Draggable key={item._id}
                                             index={index} 
                                            draggableId={item._id} 
                                            >
                                                {(provided)=>{
                                                    return(
                                                        <div className="ticket" 
                                                        ref={provided.innerRef}
                                                         {...provided.draggableProps} 
                                                         {...provided.dragHandleProps}
                                                         >
                                                            
                                                            <div className={cate.title+" description"}>
                                                                {item.task}
                                                            </div>
                                                            <div className="leftside">
                                                                {
                                                                    isDue(item.start_date,item.due_date)>-1?
                                                                    ( <div className="duration">
                                                                    {findDuartion(item.start_date,item.due_date)} 
                                                                    </div>):
                                                                    ( <div className="duration due">
                                                                    {findDuartion(item.start_date,item.due_date)} 
                                                                    </div>)
                                                                }
                                                                
                                                                <div className="assignee">
                                                                    {item.user.name.substr(0,1)}
                                                                </div> 
                                                            </div>
                                                           
                                                        </div>
                                                    ) 
                                                }}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                    
                                </div>
                                )}}
                            </Droppable>              
                        </div>
                        )
                    })}
                </DragDropContext>)
            }
                
                
              
                
              </div>
                  {addTicket.add &&
                        <div className="input-tab ">
                            <div className="tab form ticket-tab">
                                <h3>Create Ticket</h3>
                                <div className="name-field">
                                    <h4>Task</h4>
                                    <input type="text" value={addTicket.task}  onChange={handleChange} />
                                </div>  
                                <div className="dates">
                                    <div className="dateSelector">
                                        <h4>start Date</h4>
                                        <input type={'date'} value={addTicket.startDate} onChange={(e)=>{setAddTicket(prev=>{return{...prev,startDate:e.target.value}})}}></input>
                                    </div>
                                    <div className="dateSelector">
                                        <h4>Due Date</h4>
                                        <input type={'date'} value={addTicket.dueDate} onChange={(e)=>{setAddTicket(prev=>{return{...prev,dueDate:e.target.value}})}}></input>
                                    </div>
                                </div>
                                

                                <div className="selecteduser">
                                    <div className="active-user user-2">
                                            <div className="user-image" >
                                                {selectedUser.name.substr(0,1)}
                                            </div>
                                            <div className="info">
                                                <h5>{selectedUser.name}</h5>
                                                <p>{selectedUser.email}</p>
                                            </div>
                                    </div>
                                    <button className="remove">
                                        <IoIosArrowDown></IoIosArrowDown>
                                        <div className="users-view">
                                            {users.map(user=>{
                                                return(
                                                    <button className="user-3" onClick={()=>{setSelectedUser(user)}} >
                                                        <div className="user-image" >
                                                            {user.name.substr(0,1)}
                                                        </div>
                                                        <div className="info">
                                                            <h5>{user.name}</h5>
                                                            <p>{user.email}</p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                            
                                        </div>
                                    </button>
                                </div>
                                <div className="buttons">
                                    <button type='button'onClick={()=>{setAddTicket({add:false,task:"", assignedUser:"", dueDate:now,startDate:now})}}>cancel</button>
                                    <button type='button' onClick={submitTicket}  >submit</button>
                                </div>                            
                            </div> 
                        </div>
                    }
  </>;
};

export default Category;
