import "./KitchenFlow.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";


function KitchenFlow() {

    const { user } = useAuth();

    const [orders, setOrders] = useState([]);



    const updateStatus = async (orderId, status) => {

        try {

            await api.patch(`/orders/${orderId}/status`, {
                status
            });


            const response = await api.get("/orders");

            setOrders(response.data);


        } catch(error) {

            console.log(
                "Status update error:",
                error.response?.data
            );

        }

    };




    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response = await api.get("/orders");


                setOrders(response.data);


            } catch(error) {

                console.log(
                    "Error fetching orders:",
                    error.response?.data
                );

            }

        };


        fetchOrders();

    }, []);





    const waiting = orders.filter(
        order => order.status === "pending"
    );


    const accepted = orders.filter(
        order => order.status === "accepted"
    );


    const preparing = orders.filter(
        order => order.status === "preparing"
    );


    const ready = orders.filter(
        order => order.status === "ready"
    );


    const served = orders.filter(
        order => order.status === "served"
    );





    return (

        <section className="kitchen-flow">


            <div className="flow-header">

                <h2>
                    Kitchen Flow
                </h2>


                <span>
                    ● LIVE ORDERS
                </span>


            </div>




            <div className="lanes">


                <OrderLane
                    title="New Orders"
                    orders={waiting}
                    type="waiting"
                    updateStatus={updateStatus}
                    role={user?.role}
                />



                <OrderLane
                    title="Accepted"
                    orders={accepted}
                    type="accepted"
                    updateStatus={updateStatus}
                    role={user?.role}
                />



                <OrderLane
                    title="Preparing"
                    orders={preparing}
                    type="preparing"
                    updateStatus={updateStatus}
                    role={user?.role}
                />



                <OrderLane
                    title="Ready To Serve"
                    orders={ready}
                    type="ready"
                    updateStatus={updateStatus}
                    role={user?.role}
                />



                <OrderLane
                    title="Served"
                    orders={served}
                    type="served"
                    updateStatus={updateStatus}
                    role={user?.role}
                />


            </div>


        </section>

    );

}





function OrderLane({ title, orders, type, updateStatus, role }) {


    return (

        <div className={`lane ${type}`}>


            <h3>

                {title}

                <span className="order-count">
                    {orders.length}
                </span>

            </h3>




            {
                orders.length === 0 && (

                    <p className="empty">
                        No orders
                    </p>

                )
            }




            {
                orders.map(order => (

                    <div
                        className="order-card"
                        key={order._id}
                    >



                        <strong>
                            Order #{order._id.slice(-5)}
                        </strong>




                        <p className="table-number">

                            Table {
                                order.table?.tableNumber || "?"
                            }

                        </p>




                        <div className="order-items">


                            {
                                order.items?.map(item => (

                                    <div key={item._id}>

                                        🍽️ {item.menuItem?.name}

                                        {" x"}

                                        {item.quantity}

                                    </div>

                                ))
                            }


                        </div>




                        <div className="order-footer">


                            <span>
                                {order.totalPrice} DT
                            </span>



                            <span>
                                {order.paymentStatus}
                            </span>


                        </div>





                        <div className="order-actions">





                            {
                                role !== "chef" &&
                                order.status === "pending" && (

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                order._id,
                                                "accepted"
                                            )
                                        }
                                    >
                                        Accept Order
                                    </button>

                                )
                            }







                            {
                                role !== "waiter" &&
                                order.status === "accepted" && (

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                order._id,
                                                "preparing"
                                            )
                                        }
                                    >
                                        Start Preparing
                                    </button>

                                )
                            }







                            {
                                role !== "waiter" &&
                                order.status === "preparing" && (

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                order._id,
                                                "ready"
                                            )
                                        }
                                    >
                                        Mark Ready
                                    </button>

                                )
                            }







                            {
                                role !== "chef" &&
                                order.status === "ready" && (

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                order._id,
                                                "served"
                                            )
                                        }
                                    >
                                        Serve Order
                                    </button>

                                )
                            }





                        </div>





                    </div>

                ))
            }



        </div>

    );

}





export default KitchenFlow;