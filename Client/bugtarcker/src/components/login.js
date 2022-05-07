import React,{useState,useEffect} from 'react'
import {useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import  login from "../commands/login.js"
import userDataService from "../services/user.js"
import {useSelector} from "react-redux"
import addusertolist  from "../commands/addusertolist"

import "./form.css"
const Login = () => {
    const user=useSelector(state=>state.user)
    const navigate = useNavigate()
    useEffect(()=>{
        if (user.authToken) navigate('/')
    })
    const dispatch=useDispatch()
    const handlesubmission=(e)=>{
        e.preventDefault();
        userDataService.signup(person).then(Response=>{
            console.log(Response.data.error)
            if (Response.data.error){ 
                seterror({er:true ,message:Response.data.error})
                console.log(error)
                return
            }
            setsucces(true)
            seterror({er:false ,message:""})
        })
    }
    const handlesubmit=(e)=>{
        e.preventDefault();
        userDataService.signin(person)
        .then(Response=>{
            if (Response.data.error) return seterror({er:true ,message:Response.data.error})
            dispatch(login({authToken:Response.headers.authtoken,...Response.data}))
            dispatch(addusertolist(Response.data) )
            navigate("/")

        })
        
    }
    const handlechange=(e)=>{
        const name=e.target.name
        const value=e.target.value
        setperson({...person,[name]:value } )
    }
    const [succes,setsucces]=useState(false)
    const [error,seterror]=useState({er:false, message:""})
    const [signup,setsignup]=useState(false)
    const [person,setperson]=useState({email:"",password:"",name:""});
    const [name,setname]=useState(false)
    const goToLogin=()=>{
       setsignup(false) 
       seterror({er:false ,message:""})
       setperson({email:"",password:"",name:""})
       setsucces(false)
    }
    const goToSignUp=()=>{
        setsignup(true)
        setperson({email:"",password:"",name:""})
        seterror({er:false ,message:""})
    }
    const getname=(e)=>{
        e.preventDefault();
        setname(true)
    }
    const getuserinfo=(e)=>{
        e.preventDefault();
        setname(false)
    }
    
    return (
        <>
            <section className="container">
                <div className="main">
                <div className={signup ? "login side" : "login" }>

                    <div className="firstside">
                        <h1>Login</h1>
                        <form className="form">
                            { error.er && <p className='errormessage'>{error.message}</p>}
                            
                            <div className="input">
                                <input placeholder="Email"type="email" id="email" name="email" value={person.email} onChange={handlechange}></input>
                            </div>
                            <div className="input">
                                <input placeholder="Password"type="password" id="password" name="password"value={person.password} onChange={handlechange}></input>
                            </div>
                            <div className="submission">
                                <p><button >Forgot Password?</button></p>
                                <button type="submit" className="submit" onClick={handlesubmit}>submit</button>
                                <p>Not a member?<button type="button"  className="signup" onClick={goToSignUp}>Signup</button></p>
                            </div>
                        </form>
                    </div>

                    <div className="secondside">
                        <h1>Sign up</h1>
                        <form className="form">
                            <div className="input">
                                <input placeholder="Email"type="email" id="email" name="email" value={person.email} onChange={handlechange}></input>
                            </div>
                            <div className="input">
                                <input placeholder="Password"type="password" id="password" name="password"value={person.password} onChange={handlechange}></input>
                            </div>
                            <div className="submission">
                                
                                <button type="submit" className="submit" onClick={getname}>Next</button>
                                <p>Already a member?<button type="button" className="signup" onClick={goToLogin}>login</button></p>
                            </div>
                        </form>
                        <form className={name? "form second-Slide-active second-Slide":"form second-Slide"}>
                        { error.er && <p className='errormessage'>{error.message}</p>}
                           
                           
                            <div className="submission">
                                {succes? (<div>
                                            <p className="succes-message">sign up was succesful plz go back to login</p>
                                            <button type="button" className='submit2' onClick={goToLogin}>Login</button>
                                        </div>
                                        )
                                    :(
                                        <div>  
                                            <div className="input second-slide-input">
                                                <input placeholder="UserName"type="text" id="name" name="name" value={person.name} onChange={handlechange}></input>
                                            </div>
                                            <button type="submit" className="submit2"  onClick={getuserinfo} >go back</button>
                                            <button type="submit" className="submit2" onClick={handlesubmission} >submit</button>                           
                                            <p>Already a member?<button type="button" className="signup" onClick={goToLogin}>login</button></p>
                                        </div>
                                    )
                            }
                               
                            </div>
                        </form>
                    </div>
                    </div>
                </div>
          
            </section>
           
        </>
    )
}

export default Login
