/* eslint-disable no-unused-vars */
import React, { useState , useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
// import "./App.css";

function Contributor(){
    const [User, setUser] = useState({});
    const [addQuestion, setAddQuestion] = useState({});
    let [allQuestions, setAllQuestions] = useState([]);
    const [filter, setFilter] = useState({});
    const navigate = useNavigate();
    const sub = ["PPS using C", "Data Structures using C++", "OOPs using C++", "Java", "Python", "FLAT-Formal Languages and Automata Theory", "Complier Designing", "Computer Networks", "Cloud Computing", "IOT-Internet Of Things", "Cryptography and Network Security", "Machine Learning", "UML and Design Patterns", "DAA-Design Analysis Algorithms", "AI-Artificial Intelligance"]

    const submit = () => {
        Axios.get("http://localhost:3001/userInfo").then((res) => {
            console.log(res.data.User);
            if(_.isEmpty(res.data.User)){
                alert("Not logged in");
                navigate("/login");
            } else{
                addQuestion.UserID = res.data.User._id;
                console.log(addQuestion);
                console.log(res.data.User);
                Axios.post("http://localhost:3001/contributor/addQuestion",addQuestion);
                window.location.reload(false);
            }
        })
    }

    const handleChange = ({currentTarget: input}) => {
        setAddQuestion({...addQuestion,[input.name]: input.value});
    }

    const handleFilterChange = ({ currentTarget: input }) => {
    
        setFilter((prevState) => {
            // Use the updated state
            const newFilter = { ...prevState, [input.name]: input.value };
            
            // Make API call inside the setState function to ensure the latest state is used
            Axios.post("http://localhost:3001/contributor/search", newFilter)
                .then((res) => {
                    setAllQuestions(res.data.questions);
                })
                .catch((err) => {
                    console.error("Error fetching questions:", err);
                });
            
            return newFilter;
        });
    };
    

    useEffect(()=>{
        Axios.get("http://localhost:3001/contributor").then((res)=>{
            console.log(res.data.message);
            
            if(res.data.auth){
                // alert(res.data.message);
                if(res.data.questions === undefined){
                    setAllQuestions([]);
                } else{
                    console.log(res.data);
                    
                    setAllQuestions(res.data.questions);
                }
                setUser(res.data.user);
            } else{
                navigate("/login");
            }
        },)

        Axios.get("http://localhost:3001/userInfo").then((res) => {
            console.log(res.data);
            
            setUser(res.data.User)
        })
    }, [navigate]);

    const update = (id) => {
        console.log(id);
        navigate("/"+User.Role+"/editQuestion",{ state: {id: id} });
    }

    const deleted = (id) => {
        console.log(id);
        Axios.delete(`http://localhost:3001/Contributor/delete/${id}`);
        window.location.reload(false);
    }

    const logout = () => {
        // alert("Loggin out");
        Axios.post("http://localhost:3001/logout");
        navigate("/login",{state: {message: "Please login first"}});
    }

    const check = () => {
        if(allQuestions.length === 0){
            return <p>No questions posted</p>
        } else{
            return (
                allQuestions.map( (val) => {
                    return (
                        <div>
                            <p>{val.Question}&nbsp; &#x2022; &nbsp;{val.Type}&nbsp; &#x2022; &nbsp;{val.Difficulty}&nbsp; &#x2022; &nbsp;{val.Subject}</p>
                            <button onClick={() => update(val._id)}>Edit</button>
                            <button onClick={() => deleted(val._id)}>Delete</button>
                        </div>
                    )
                })
            )
        }
    }

    return (
        <div className="App">
            <div>
                <h1>{User?.UserName}</h1>
                <h3>{User?.Role}</h3>
                <h1>Add Question</h1>
                <table>
                    <tr>
                        <td>
                            <label> Subject </label>
                        </td>
                        <td>:</td>
                        <td>
                            <select name="Subject" onChange={handleChange}>
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
                            <input type="radio" name="Difficulty" value="Easy" onChange={handleChange} /> <label htmlFor="easy">Easy</label>&nbsp;
                            <input type="radio" name="Difficulty" value="Medium" onChange={handleChange} /> <label htmlFor="medium">Medium</label>&nbsp;
                            <input type="radio" name="Difficulty" value="Hard" onChange={handleChange} /> <label htmlFor="hard">Hard</label>&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor=""> Type </label>
                        </td>
                        <td>:</td>
                        <td>
                            <input type="radio" name="Type" value="Short" onChange={handleChange} /> <label htmlFor="short">Short</label>&nbsp;
                            <input type="radio" name="Type" value="Long" onChange={handleChange} /> <label htmlFor="long">Long</label>&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label> Write your post </label>
                        </td>
                        <td>:</td>
                        <td>
                            <textarea name="Question" rows={3} cols={40} onChange={handleChange} />
                        </td>
                    </tr>
                </table>
                <button onClick={submit}>Submit</button>
            </div>
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
                {check()}
            </div>
            <div><button onClick={logout}>LogOut</button></div>
        </div>
    )
}

export default Contributor;