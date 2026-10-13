import "./LiveTableBoard.css";
import { useEffect, useState } from "react";
import api from "../../services/api";


function LiveTableBoard() {


    const [tables, setTables] = useState([]);


    useEffect(() => {

        const fetchTables = async () => {

            try {

                const response = await api.get("/tables");

                setTables(response.data);

            } catch(error) {

                console.log(
                    "Error fetching tables:",
                    error.response?.data
                );

            }

        };


        fetchTables();

    }, []);



    return (

        <section className="table-board">


            <div className="section-header">

                <h2>
                    Live Table Board
                </h2>

                <span>
                    ● LIVE
                </span>

            </div>



            <div className="tables-grid">


                {tables.map((table)=>(


                    <div
                        key={table._id}
                        className={`table-card ${table.status}`}
                    >


                        <div className="table-number">

                            T{String(table.tableNumber).padStart(2,"0")}

                        </div>


                        <div className="table-status">

                            {table.status}

                        </div>


                        <div className="table-info">

                            Live Status

                        </div>


                    </div>


                ))}


            </div>


        </section>

    );

}


export default LiveTableBoard;