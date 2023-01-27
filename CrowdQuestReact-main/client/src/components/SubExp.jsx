import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function SubExp(){
    const navigate = useNavigate();
    const [User, setUser] = useState({});
    let [allQuestions, setAllQuestions] = useState([]);
    const [filter, setFilter] = useState({});

    useEffect(()=>{
        Axios.get("http://localhost:3001/SubjectExpert").then((res)=>{
            if(res.data.auth){
                setAllQuestions(res.data.questions);
                setUser(res.data.user);
            } else{
                navigate("/login",{state: {message: "Please login first"}});
            }
        })
    }, []);

    const approve = (id) => {
        console.log(id);
        Axios.post(`http://localhost:3001/SubjectExpert/approve/${id}`);
        window.location.reload(false);
    }

    const reject = (id) => {
        console.log(id);
        Axios.post(`http://localhost:3001/SubjectExpert/reject/${id}`);
        window.location.reload(false);
    }

    const handleFilterChange = ({currentTarget: input}) => {
        setFilter({...filter,[input.name]: input.value});
        Axios.post("http://localhost:3001/SubjectExpert/search",filter).then((res)=>{
            setAllQuestions(res.data.questions);
        })
    }

    const logout = () => {
        // alert("Loggin out");
        Axios.post("http://localhost:3001/logout");
        navigate("/login");
    }

    return (
        <div>
            <h1>{User.UserName}</h1>
            <div>
                <h1>Filter</h1>
                <table>
                    <tr>
                        <td>
                            <label> Difficulty </label>
                        </td>
                        <td>:</td>
                        <td>
                            <input type="radio" name="Difficulty" value="Easy" onChange={handleFilterChange} /> <label htmlFor="easy">Easy</label>&nbsp;
                            <input type="radio" name="Difficulty" value="Medium" onChange={handleFilterChange} /> <label htmlFor="medium">Medium</label>&nbsp;
                            <input type="radio" name="Difficulty" value="Hard" onChange={handleFilterChange} /> <label htmlFor="hard">Hard</label>&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor=""> Type </label>
                        </td>
                        <td>:</td>
                        <td>
                            <input type="radio" name="Type" value="Short" onChange={handleFilterChange} /> <label htmlFor="short">Short</label>&nbsp;
                            <input type="radio" name="Type" value="Long" onChange={handleFilterChange} /> <label htmlFor="long">Long</label>&nbsp;
                        </td>
                    </tr>
                </table>
                <button onClick={(event)=>{window.location.reload(false);}}>Clear All</button>
            </div>
            <div>
                <h1>All Questions</h1>
                {allQuestions.map((val)=>{
                    return (
                        <div>
                            <p>{val.Question}&nbsp; &#x2022; &nbsp;{val.Type}&nbsp; &#x2022; &nbsp;{val.Difficulty}&nbsp; &#x2022; &nbsp;{val.Subject}</p>
                            <button onClick={() => approve(val._id)}>Approve</button>
                            <button onClick={() => reject(val._id)}>Reject</button>
                        </div>
                    )
                })}
            </div>
            <div><button onClick={logout}>LogOut</button></div>
        </div>
    )
}

export default SubExp;