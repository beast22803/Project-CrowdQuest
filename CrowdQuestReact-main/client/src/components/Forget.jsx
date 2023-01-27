import React, {useState, useEffect} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Forget(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassord] = useState("");
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

    const forget = () => {
        console.log(email+" "+password+" "+confirmPassword);
        if (password === confirmPassword && password.match(regex)) {
            Axios.post("http://localhost:3001/forget", {
                email: email,
                password: password,
            });
            navigate("/login");
        } else {
            if (password !== confirmPassword) {
                alert("Both passwords are wrong");
            }
        }
    }

    return (
        <div>
            <h1>Change Password</h1>
            <table>
                <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td><input type="email" placeholder="Email" onChange={(event) => { setEmail(event.target.value) }} /></td>
                </tr>
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
            <button onClick={forget}>Submit</button>
        </div>
    )
}

export default Forget;