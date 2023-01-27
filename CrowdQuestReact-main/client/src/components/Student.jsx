import React, { useEffect , useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Student(){
    const navigate = useNavigate();
    const [User, setUser] = useState({});
    const sub = ["PPS using C", "Data Structures using C++", "OOPs using C++", "Java", "Python", "FLAT-Formal Languages and Automata Theory", "Complier Designing", "Computer Networks", "Cloud Computing", "IOT-Internet Of Things", "Cryptography and Network Security", "Machine Learning", "UML and Design Patterns", "DAA-Design Analysis Algorithms", "AI-Artificial Intelligance"]
    let [allQuestions, setAllQuestions] = useState([]);
    const [filter, setFilter] = useState({});

    useEffect(()=>{
        Axios.get("http://localhost:3001/Student").then((res)=>{
            if(res.data.auth){
                if(res.data.questions === undefined){
                    setAllQuestions([]);
                } else{
                    setAllQuestions(res.data.questions);
                }
                setUser(res.data.user);
            } else{
                navigate("/login",{state: {message: "Please login first"}});
            }
        });
    }, []);

    const handleFilterChange = ({currentTarget: input}) => {
        setFilter({...filter,[input.name]: input.value});
        Axios.post("http://localhost:3001/Student/search",filter).then((res)=>{
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
                <h1>Filters</h1>
                <table>
                <tr>
                        <td>
                            <label> Subject </label>
                        </td>
                        <td>:</td>
                        <td>
                            <select name="Subject" onChange={handleFilterChange}>
                                <option selected disabled value="">Select the Subject</option>
                                {sub.map((option) => {
                                    return <option> {option} </option>
                                })}
                            </select>
                        </td>
                    </tr>
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
                <h1>All Question</h1>
                {allQuestions.map((val)=>{
                    return (
                        <div>
                            <p>{val.Question}&nbsp; &#x2022; &nbsp;{val.Type}&nbsp; &#x2022; &nbsp;{val.Difficulty}&nbsp; &#x2022; &nbsp;{val.Subject}</p>
                        </div>
                    )
                })}
                <div><button onClick={logout}>LogOut</button></div>
            </div>
        </div>
    )
}

export default Student;