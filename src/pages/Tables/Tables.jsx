import "./Tables.css";
import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";


function Tables() {

    const [tables, setTables] = useState([]);
    const [selectedQR, setSelectedQR] = useState(null);

    const { user } = useContext(AuthContext);


    const fetchTables = async () => {

        try {

            const response = await api.get("/tables");

            setTables(response.data);

        } catch (error) {

            console.log(
                "Error loading tables:",
                error.response?.data
            );

        }

    };


    useEffect(() => {

        fetchTables();

    }, []);



    const handleAddTable = async () => {

        try {

            await api.post("/tables");

            fetchTables();

        } catch (error) {

            console.log(
                "Error creating table:",
                error.response?.data
            );

        }

    };



    const handleDeleteTable = async (id) => {


        const confirmed = window.confirm(
            "Are you sure you want to delete this table?"
        );


        if (!confirmed) return;



        try {

            await api.delete(`/tables/${id}`);

            fetchTables();


        } catch (error) {

            console.log(
                "Error deleting table:",
                error.response?.data
            );

        }

    };



    return (

        <DashboardLayout>


            <div className="tables-page">



                <div className="page-header">


                    <div>

                        <h1>
                            Dining Floor
                        </h1>


                        <p>
                            Manage restaurant tables and QR access
                        </p>

                    </div>



                    <button onClick={handleAddTable}>

                        + Add Table

                    </button>


                </div>





                <div className="table-grid">


                    {
                        tables.length === 0 ? (


                            <p className="empty">

                                No tables available

                            </p>



                        ) : (


                            tables.map((table) => (


                                <div
                                    className="table-card"
                                    key={table._id}
                                >



                                    <div className="table-number">

                                        Table {table.tableNumber}

                                    </div>




                                    <span

                                        className={
                                            table.status === "occupied"
                                                ? "status occupied"
                                                : "status available"
                                        }

                                    >

                                        ● {table.status}

                                    </span>





                                    <button

                                        className="qr-button"

                                        onClick={() =>
                                            setSelectedQR(table.qrCode)
                                        }

                                    >

                                        View QR

                                    </button>





                                    {
                                        user?.role === "admin" && (


                                            <button

                                                className="delete-button"

                                                onClick={() =>
                                                    handleDeleteTable(table._id)
                                                }

                                            >

                                                Delete

                                            </button>


                                        )
                                    }



                                </div>


                            ))


                        )
                    }



                </div>





                {
                    selectedQR && (


                        <div

                            className="qr-modal"

                            onClick={() =>
                                setSelectedQR(null)
                            }

                        >



                            <div

                                className="qr-box"

                                onClick={(e) =>
                                    e.stopPropagation()
                                }

                            >



                                <h2>
                                    Table QR Code
                                </h2>




                                <img

                                    src={selectedQR}

                                    alt="QR Code"

                                />





                                <button

                                    className="close-button"

                                    onClick={() =>
                                        setSelectedQR(null)
                                    }

                                >

                                    Close

                                </button>




                            </div>



                        </div>


                    )
                }



            </div>


        </DashboardLayout>


    );

}


export default Tables;