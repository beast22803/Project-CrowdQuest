import React from "react";
import { useState } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
// import "./App.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassord] = useState("");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [subject, setSubject] = useState("");
    const sub = ["PPS using C", "Data Structures using C++", "OOPs using C++", "Java", "Python", "FLAT-Formal Languages and Automata Theory", "Complier Designing", "Computer Networks", "Cloud Computing", "IOT-Internet Of Things", "Cryptography and Network Security", "Machine Learning", "UML and Design Patterns", "DAA-Design Analysis Algorithms", "AI-Artificial Intelligance"]
    const rl = ["Student", "Contributor", "SubjectExpert"];
    let msg = "";
    const navigate = useNavigate();
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const register = () => {
        console.log(email + " " + role + " " + password + " " + confirmPassword + " " + userName + " " + subject);
        if (password === confirmPassword && password.match(regex)) {
            msg = "";
            Axios.post("http://localhost:3001/register", {
                email: email,
                password: password,
                role: role,
                username: userName,
                subject: subject
            });
            navigate("/login");
        } else {
            if (password !== confirmPassword) {
                msg = "Both passwords are wrong";
            }
        }

    }

    const check = () => {
        if (role === "SubjectExpert") {
            return (
                <tr>
                    <td>
                        <label> Subject: </label>
                    </td>
                    <td>:</td>
                    <td>
                        <select onChange={(event) => { setSubject(event.target.value) }}>
                            <option selected disabled value="">Select the Subject</option>
                            {sub.map((option) => {
                                return <option> {option} </option>
                            })}
                        </select>
                    </td>
                </tr>
            )
        }
    }

    const passwordCheck = () => {
        if (!password.match(regex)) {
            return (
                <p>Password should have a capital letter, special character, a number</p>
            )
        }
    }

    const confirmPasswordCheck = () => {
        if (confirmPassword !== password && password !== "") {
            return (
                <p>Please check your password</p>
            )
        }
    }

    return (
        <div className="App">
            <h1>Register</h1>
            <table>
                <tr>
                    <td>
                        <label> Email: </label>
                    </td>
                    <td>:</td>
                    <td><input type="email" placeholder="Email" onChange={(event) => { setEmail(event.target.value) }} /></td>
                </tr>
                <tr>
                    <td>
                        <label> User Name: </label>
                    </td>
                    <td>:</td>
                    <td><input type="text" placeholder="User Name" onChange={(event) => { setUserName(event.target.value) }} /></td>
                </tr>
                <tr>
                    <td>
                        <label> Role: </label>
                    </td>
                    <td>:</td>
                    <td>
                        <select onChange={(event) => { setRole(event.target.value); }}>
                            <option selected disabled value="">Select your role</option>
                            {rl.map((option) => {
                                return <option> {option} </option>
                            })}
                        </select>
                    </td>
                </tr>
                {check()}
                <tr>
                    <td>
                        <label> Password: </label>
                    </td>
                    <td>:</td>
                    <td><input type="password" placeholder="Password" onChange={(event) => { setPassword(event.target.value) }} /></td>
                    {passwordCheck()}
                </tr>
                <tr>
                    <td>
                        <label> Confirm Password: </label>
                    </td>
                    <td>:</td>
                    <td><input type="password" placeholder="Confirm Password" onChange={(event) => { setConfirmPassord(event.target.value) }} /></td>
                    {confirmPasswordCheck()}
                </tr>
            </table>
            {msg}
            <button onClick={register}>Submit</button>
            <p>Already have an account, <Link to="/login">Login here</Link></p>
        </div>
    );
}

export default Login;