import React, {useEffect , useState} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin(){
    const navigate = useNavigate();
    const [User, setUser] = useState({});
    let [allUsers, setAllUsers] = useState([]);

    useEffect(()=>{
        Axios.get("http://localhost:3001/Admin").then((res)=>{
            if(res.data.auth){
                if(res.data.users === undefined){
                    setAllUsers([]);
                } else{
                    setAllUsers(res.data.users);
                }
                setUser(res.data.user);
            } else{
                navigate("/login",{state: {message: "Please login first"}});
            }
        });
    }, []);

    const approve = (id) => {
        console.log(id);
        Axios.post(`http://localhost:3001/Admin/approve/${id}`);
        window.location.reload(false);
    }

    const reject = (id) => {
        console.log(id);
        Axios.post(`http://localhost:3001/Admin/reject/${id}`);
        window.location.reload(false);
    }

    const logout = () => {
        // alert("Loggin out");
        Axios.post("http://localhost:3001/logout");
        navigate("/login");
    }

    return (
        <div>
            <h1>{User.UserName}</h1>
            <h3>{User.Role}</h3>
            {allUsers.map((val)=>{
                return (
                    <div>
                        <p>{val.UserName}&nbsp; &#x2022; &nbsp;{val.Email}</p>
                        <button onClick={() => approve(val._id)}>Approve</button>
                        <button onClick={() => reject(val._id)}>Reject</button>
                    </div>
                )
            })}
            <div><button onClick={logout}>LogOut</button></div>
        </div>
    )
}

export default Admin;