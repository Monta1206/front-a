import "./Users.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";


function Users() {


    const [users, setUsers] = useState([]);



    useEffect(() => {


        const fetchUsers = async () => {


            try {


                const response = await api.get("/users");


                setUsers(response.data);



            } catch(error) {


                console.log(
                    "Error loading users:",
                    error.response?.data
                );


            }


        };


        fetchUsers();


    }, []);






    return (


        <DashboardLayout>


            <div className="users-page">


                <div className="page-header">


                    <div>

                        <h1>
                            Staff Management
                        </h1>


                        <p>
                            Manage restaurant employees and permissions
                        </p>

                    </div>



                    <button disabled>
                        + Add Staff
                    </button>


                </div>






                <div className="users-grid">



                    {
                        users.length === 0 ? (


                            <p className="empty">
                                No staff members found
                            </p>


                        ) : (



                            users.map(user => (


                                <div
                                    className="user-card"
                                    key={user._id}
                                >



                                    <div className="avatar">

                                        {
                                            user.fullname
                                            ?.charAt(0)
                                            .toUpperCase()
                                        }

                                    </div>




                                    <div className="user-info">


                                        <h2>
                                            {user.fullname}
                                        </h2>


                                        <p>
                                            {user.email}
                                        </p>


                                        <span className={`role ${user.role}`}>

                                            {user.role}

                                        </span>


                                    </div>



                                </div>


                            ))


                        )
                    }



                </div>




            </div>


        </DashboardLayout>


    );

}



export default Users;