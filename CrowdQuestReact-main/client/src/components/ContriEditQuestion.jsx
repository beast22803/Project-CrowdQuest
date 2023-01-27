import React from "react";
import { useEffect , useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
// import "./App.css";

function ContriEditQuestion(){

    const location = useLocation();
    const navigate = useNavigate();
    const [updQuestion, setUpdQuestion] = useState({});
    const [question, setQuestion] = useState({});
    const sub = ["PPS using C", "Data Structures using C++", "OOPs using C++", "Java", "Python", "FLAT-Formal Languages and Automata Theory", "Complier Designing", "Computer Networks", "Cloud Computing", "IOT-Internet Of Things", "Cryptography and Network Security", "Machine Learning", "UML and Design Patterns", "DAA-Design Analysis Algorithms", "AI-Artificial Intelligance"]
    const diff = ["Short", "Long"];
    const type = ["Easy", "Medium", "Hard"];
    const handleChange = ({currentTarget: input}) => {
        setUpdQuestion({...updQuestion,[input.name]: input.value});
    }

    useEffect( ()=> {
        Axios.post(`http://localhost:3001/retQuestion/${location.state.id}`).then((res)=>{
            console.log(res.data.question);
            setQuestion(res.data.question);
        });
    }, []);

    const submit = () => {
        updQuestion._id = question._id;
        console.log(updQuestion);
        Axios.post("http://localhost:3001/Contributor/updQuestion",updQuestion);
        navigate("/Contributor");
    }

    const checkDiff = () => {
        if(question.Difficulty === "Easy"){
            return (
                <div>
                    <input type="radio" name="Difficulty" defaultChecked value="Easy" onChange={handleChange} /> <label htmlFor="easy">Easy</label>&nbsp;
                    <input type="radio" name="Difficulty" value="Medium" onChange={handleChange} /> <label htmlFor="medium">Medium</label>&nbsp;
                    <input type="radio" name="Difficulty" value="Hard" onChange={handleChange} /> <label htmlFor="hard">Hard</label>&nbsp;
                </div>
            )
        } else if(question.Difficulty === "Medium"){
            return (
                <div>
                    <input type="radio" name="Difficulty" value="Easy" onChange={handleChange} /> <label htmlFor="easy">Easy</label>&nbsp;
                    <input type="radio" name="Difficulty" defaultChecked value="Medium" onChange={handleChange} /> <label htmlFor="medium">Medium</label>&nbsp;
                    <input type="radio" name="Difficulty" value="Hard" onChange={handleChange} /> <label htmlFor="hard">Hard</label>&nbsp;
                </div>
            )
        } else if(question.Difficulty === "Hard"){
            return (
                <div>
                    <input type="radio" name="Difficulty" value="Easy" onChange={handleChange} /> <label htmlFor="easy">Easy</label>&nbsp;
                    <input type="radio" name="Difficulty" value="Medium" onChange={handleChange} /> <label htmlFor="medium">Medium</label>&nbsp;
                    <input type="radio" name="Difficulty" defaultChecked value="Hard" onChange={handleChange} /> <label htmlFor="hard">Hard</label>&nbsp;
                </div>
            )
        }
    }

    const checkType = () => {
        if(question.Type === "Short"){
            return (
                <div>
                    <input type="radio" name="Type" defaultChecked value="Short" onChange={handleChange} /> <label htmlFor="short">Short</label>&nbsp;
                    <input type="radio" name="Type" value="Long" onChange={handleChange} /> <label htmlFor="long">Long</label>&nbsp;
                </div>
            )
        } else if(question.Type === "Long"){
            return (
                <div>
                    <input type="radio" name="Type" value="Short" onChange={handleChange} /> <label htmlFor="short">Short</label>&nbsp;
                    <input type="radio" name="Type" defaultChecked value="Long" onChange={handleChange} /> <label htmlFor="long">Long</label>&nbsp;
                </div>
            )
        }
    }

    return (
        <div className="App">
            <h1>Edit Question</h1>
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
                                return <option selected={option===question.Subject}> {option} </option>
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
                        {checkDiff()}
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor=""> Type </label>
                    </td>
                    <td>:</td>
                    <td>
                        {checkType()}
                    </td>
                </tr>
                <tr>
                    <td>
                        <label> Write your post </label>
                    </td>
                    <td>:</td>
                    <td>
                        <textarea name="Question" defaultValue={question.Question} rows={3} cols={40} onChange={handleChange} />
                    </td>
                </tr>
            </table>
            <button onClick={submit}>Submit</button>
        </div>
    )
}

export default ContriEditQuestion;