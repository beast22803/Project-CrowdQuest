import React from "react";
import { useState , useEffect } from "react";
import Axios from 'axios';
import { Link, useLocation, useNavigate } from "react-router-dom";
// import "./App.css";

function Login() {
    const location = useLocation();
    const [email , setEmail] = useState("");
    const [password , setPassord] = useState("");
    const navigate = useNavigate();

    const login = () => {
        Axios.post("http://localhost:3001/login",{
            email: email,
            password: password
        }).then(res => {
            console.log(res.data);
            
            alert(res.data.message);
            navigate("/"+res.data.user.Role);
        });
    }

    return (
      <div className="App">
        <h1>Login</h1>
        <table>
            <tr>
                <td>
                <label> Email: </label>
                </td>
                <td><input type="email" placeholder="Email" onChange={(event)=>{setEmail(event.target.value)}} /></td>
            </tr>
            <tr>
                <td>
                <label> Password: </label>
                </td>
                <td><input type="password" placeholder="Password" onChange={(event)=>{setPassord(event.target.value)}}/></td>
            </tr>
        </table>
        <button onClick={login}>Submit</button>
        <p>Forgot your password, <Link to="/Forget">Click here</Link></p>
        <p>Create an account, <Link to="/register">Click here</Link></p>
      </div>
    );
  }
  
  export default Login;