import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        // Fetch initial data for the default page
        fetchData(currentPage);
    }, []);

    const fetchData = async (page) => {
        try {
            const response = await Axios.post("http://localhost:3001/admin/dashboard", {
                currentPage: page,
            });
            console.log("API Response:", response.data);

            if (response.data.success) {
                setData(response.data.users || []);
                setUser(response.data.user);
                setCurrentPage(response.data.currentPage)
            } else {
                console.error("Failed to fetch data");
                setData([]);
            }
        } catch (err) {
            console.error("Error while calling /admin/dashboard:", err);
            setData([]);
        }
    };

    const approve = (id) => {
        Axios.post(`http://localhost:3001/admin/approve/${id}`);
        window.location.reload(false);
    };

    const reject = (id) => {
        Axios.post(`http://localhost:3001/admin/reject/${id}`);
        window.location.reload(false);
    };

    const deleted = (id) => {
        Axios.post(`http://localhost:3001/admin/delete/${id}`, { currentPage: currentPage });
        window.location.reload(false);
    };

    const block = (id) => {
        Axios.post(`http://localhost:3001/admin/block/${id}`);
        window.location.reload(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page);
    };

    const logout = () => {
        Axios.post("http://localhost:3001/logout");
        navigate("/login");
    };

    return (
        <div>
            <h1>{user.UserName}</h1>
            <h3>{user.Role}</h3>
            <div className="mt-4">
                <button onClick={() => handlePageChange("accountRequests")}>
                    Account Requests
                </button>
                <button onClick={() => handlePageChange("accountDirectory")}>
                    Account Directory
                </button>
                <button onClick={() => handlePageChange("questionDirectory")}>
                    Question Directory
                </button>
            </div>

            <div className="mt-4">
                {currentPage === "accountRequests" && (
                    <div>
                        <h3>Account Requests</h3>
                        {data.map((val) => (
                            <div key={val._id}>
                                <p>{val.UserName}&nbsp; &#x2022; &nbsp;{val.Email}</p>
                                <button onClick={() => approve(val._id)}>Approve</button>
                                <button onClick={() => reject(val._id)}>Reject</button>
                            </div>
                        ))}
                    </div>
                )}

                {currentPage === "accountDirectory" && (
                    <div>
                        <h3>Account Directory</h3>
                        <div>
                            {data.length > 0 ? (
                                <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((val) => (
                                            <tr key={val._id}>
                                                <td>{val.UserName}</td>
                                                <td>{val.Email}</td>
                                                <td>{val.Role}</td>
                                                <td style={{display: "flex"}}>
                                                    {val.Role === "subjectexpert" && val.AppRejUser !== -1 && (
                                                        <button style={{marginRight: "0.5rem"}} type="button" onClick={() => block(val._id)}>
                                                            Block
                                                        </button>
                                                    )}

                                                    <form onSubmit={() => { deleted(val._id) }} >
                                                        <input type="hidden" name="id" value={val._id} />
                                                        <button type="submit" className="dangerBtn">
                                                            Delete
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            ) : (
                                <p>No data available</p>
                            )}
                        </div>
                    </div>
                )}

                {currentPage === "questionDirectory" && (
                    <div>
                        <h3>Question Directory</h3>
                        {data.length > 0 ? (
                            <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Question</th>
                                        <th>Type</th>
                                        <th>Difficulty</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((val) => (
                                        <tr key={val._id}>
                                            <td>{val.Subject}</td>
                                            <td>{val.Question}</td>
                                            <td>{val.Type}</td>
                                            <td>{val.Difficulty}</td>
                                            <td class="text-center">
                                                <form onSubmit={() => deleted(val._id)}>
                                                    <input type="text" name="id" id="" value="<%= quest._id %>" hidden />
                                                    <button type="submit" class="dangerBtn">Delete</button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for {currentPage}</p>
                        )}
                    </div>
                )}

                {currentPage === "" && (
                    <p>Nothing is here</p>
                )}
            </div>

            <div className="mt-5">
                <button onClick={logout}>LogOut</button>
            </div>
        </div>
    );
}

export default Admin;
