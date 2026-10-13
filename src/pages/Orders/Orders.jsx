import "./Orders.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";


function Orders() {


    const [orders, setOrders] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState("All");

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);


    const { user } = useAuth();

    const role = user?.role;





    const fetchOrders = async () => {

        try {

            const response = await api.get("/orders");

            setOrders(response.data);


        } catch(error) {

            console.log(
                "Error loading orders:",
                error.response?.data
            );


        } finally {

            setLoading(false);

        }

    };







    useEffect(() => {


        fetchOrders();


        const interval = setInterval(() => {

            fetchOrders();

        }, 10000);



        return () => clearInterval(interval);


    }, []);








    const filteredOrders = orders.filter(order => {


        const statusMatch =
            selectedStatus === "All" ||
            order.status === selectedStatus;



        const searchValue = search.toLowerCase();



        const searchMatch =

            order.table?.tableNumber
            ?.toString()
            .includes(searchValue)

            ||

            order._id
            ?.toLowerCase()
            .includes(searchValue)

            ||

            order.items?.some(item =>
                item.menuItem?.name
                ?.toLowerCase()
                .includes(searchValue)
            );



        return statusMatch && searchMatch;


    });









    const orderStats = {


        pending: orders.filter(
            order => order.status === "pending"
        ).length,


        accepted: orders.filter(
            order => order.status === "accepted"
        ).length,


        preparing: orders.filter(
            order => order.status === "preparing"
        ).length,


        ready: orders.filter(
            order => order.status === "ready"
        ).length,


        served: orders.filter(
            order => order.status === "served"
        ).length


    };









    const updateStatus = async (id, status) => {


        try {


            await api.patch(
                `/orders/${id}/status`,
                {
                    status
                }
            );


            fetchOrders();



        } catch(error) {


            console.log(
                error.response?.data
            );


        }


    };









    const renderActions = (order) => {


        // ADMIN

        if(role === "admin"){


            if(order.status === "pending"){

                return (

                    <button
                        className="action-button accept"
                        onClick={() =>
                            updateStatus(
                                order._id,
                                "accepted"
                            )
                        }
                    >
                        Accept Order
                    </button>

                );

            }


            if(order.status === "accepted"){

                return (

                    <button
                        className="action-button prepare"
                        onClick={() =>
                            updateStatus(
                                order._d,
                                "preparing"
                            )
                        }
                    >
                        Start Preparing
                    </button>

                );

            }



            if(order.status === "preparing"){

                return (

                    <button
                        className="action-button ready"
                        onClick={() =>
                            updateStatus(
                                order._id,
                                "ready"
                            )
                        }
                    >
                        Mark Ready
                    </button>

                );

            }



            if(order.status === "ready"){

                return (

                    <button
                        className="action-button serve"
                        onClick={() =>
                            updateStatus(
                                order._id,
                                "served"
                            )
                        }
                    >
                        Mark Served
                    </button>

                );

            }


        }









        // WAITER

        if(role === "waiter"){


            if(order.status === "pending"){

                return (

                    <button
                        className="action-button accept"
                        onClick={() =>
                            updateStatus(
                                order._id,
                                "accepted"
                            )
                        }
                    >
                        Accept Order
                    </button>

                );

            }



            if(order.status === "ready"){

                return (

                    <button
                        className="action-button serve"
                        onClick={() =>
                            updateStatus(
                                order._id,
                                "served"
                            )
                        }
                    >
                        Mark Served
                    </button>

                );

            }


        }









        // CHEF

        if(role === "chef"){


            if(order.status === "accepted"){

                return (

                    <button
                        className="action-button prepare"
                        onClick={() =>
                            updateStatus(
                                order._id,
                                "preparing"
                            )
                        }
                    >
                        Start Preparing
                    </button>

                );

            }




            if(order.status === "preparing"){

                return (

                    <button
                        className="action-button ready"
                        onClick={() =>
                            updateStatus(
                                order._id,
                                "ready"
                            )
                        }
                    >
                        Mark Ready
                    </button>

                );

            }


        }



        return null;


    };









    if(loading){

        return (

            <DashboardLayout>

                <p>
                    Loading orders...
                </p>

            </DashboardLayout>

        );

    }









    return (

        <DashboardLayout>


            <div className="orders-page">



                <div className="page-header">

                    <h1>
                        Order Management
                    </h1>

                    <p>
                        Track and manage restaurant orders
                    </p>

                </div>









                <div className="order-stats">


                    <div className="stat-card">
                        <span>Pending</span>
                        <strong>
                            {orderStats.pending}
                        </strong>
                    </div>



                    <div className="stat-card">
                        <span>Accepted</span>
                        <strong>
                            {orderStats.accepted}
                        </strong>
                    </div>



                    <div className="stat-card">
                        <span>Preparing</span>
                        <strong>
                            {orderStats.preparing}
                        </strong>
                    </div>



                    <div className="stat-card">
                        <span>Ready</span>
                        <strong>
                            {orderStats.ready}
                        </strong>
                    </div>



                    <div className="stat-card">
                        <span>Served</span>
                        <strong>
                            {orderStats.served}
                        </strong>
                    </div>


                </div>









                <div className="orders-toolbar">


                    <input

                        type="text"

                        placeholder="Search order, table, item..."

                        value={search}

                        onChange={(e)=>
                            setSearch(e.target.value)
                        }

                    />





                    <div className="status-filters">


                        {
                            [
                                "All",
                                "pending",
                                "accepted",
                                "preparing",
                                "ready",
                                "served",
                                "cancelled"

                            ].map(status => (

                                <button

                                    key={status}

                                    className={
                                        selectedStatus === status
                                        ? "filter-active"
                                        : ""
                                    }


                                    onClick={() =>
                                        setSelectedStatus(status)
                                    }

                                >

                                    {status}

                                </button>

                            ))
                        }


                    </div>


                </div>









                <div className="orders-container">


                    {
                        filteredOrders.length === 0 ?


                        (

                            <p className="empty">

                                No orders available

                            </p>

                        )


                        :


                        filteredOrders.map(order => (


                            <div

                                className="order-box"

                                key={order._id}

                            >



                                <div className="order-top">


                                    <h3>

                                        Order #{order._id.slice(-5)}

                                    </h3>


                                    <span
                                        className={`status ${order.status}`}
                                    >

                                        {order.status}

                                    </span>


                                </div>





                                <p>

                                    Table:
                                    {" "}
                                    {order.table?.tableNumber || "?"}

                                </p>




                                <div className="items">


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





                                <div className="order-bottom">


                                    <strong>

                                        {order.totalPrice} DT

                                    </strong>



                                    <span>

                                        Payment:
                                        {" "}
                                        {order.paymentStatus}

                                    </span>


                                </div>





                                <div className="order-actions">

                                    {
                                        renderActions(order)
                                    }

                                </div>



                            </div>


                        ))
                    }



                </div>



            </div>


        </DashboardLayout>

    );


}


export default Orders;