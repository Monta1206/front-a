import "./PublicMenu.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";


function PublicMenu() {


    const { tableNumber } = useParams();


    const [menu, setMenu] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [cart, setCart] = useState([]);

    const [showCart, setShowCart] = useState(false);





    useEffect(() => {


        const fetchMenu = async () => {


            try {


                const response = await api.get(
                    `/public/menu/${tableNumber}`
                );


                setMenu(response.data);



            } catch(error) {


                console.log(
                    error.response?.data
                );


            }


        };


        fetchMenu();


    }, [tableNumber]);









    const addToCart = (item) => {


        const existingItem = cart.find(
            cartItem => cartItem._id === item._id
        );



        if(existingItem){


            const updatedCart = cart.map(cartItem =>


                cartItem._id === item._id

                ?

                {
                    ...cartItem,
                    quantity: cartItem.quantity + 1
                }

                :

                cartItem


            );


            setCart(updatedCart);



        } else {



            setCart([

                ...cart,

                {
                    ...item,
                    quantity:1
                }

            ]);


        }


    };










    const removeFromCart = (itemId) => {


        const updatedCart = cart

            .map(item => {


                if(item._id === itemId){


                    return {

                        ...item,

                        quantity:item.quantity - 1

                    };


                }


                return item;


            })

            .filter(item => item.quantity > 0);



        setCart(updatedCart);


    };


        
        const confirmOrder = async () => {

    try {


        const orderData = {

            table: menu.table.id,

            items: cart.map(item => ({

                menuItem: item._id,

                quantity: item.quantity

            }))

        };



        const response = await api.post(
            "/public/orders",
            orderData
        );


        console.log(response.data);


        alert("Order sent successfully!");

        setCart([]);

        setShowCart(false);



    } catch(error) {


        console.log(
            error.response?.data
        );


        alert("Failed to send order");


    }

};





    const totalPrice = cart.reduce(

        (total,item) =>

            total + (item.price * item.quantity),

        0

    );









    if(!menu){


        return (

            <div className="loading">

                Loading menu...

            </div>

        );


    }









    const categories = {};



    menu.menuItems.forEach(item => {


        const category =
            item.category?.name || "Other";



        if(!categories[category]){


            categories[category] = [];


        }



        categories[category].push(item);



    });









    const categoryNames = [

        "All",

        ...Object.keys(categories)

    ];








    const displayedCategories =

        selectedCategory === "All"

        ?

        categories

        :

        {

            [selectedCategory]:

            categories[selectedCategory]

        };









    return (


        <div className="public-menu">






            <header className="restaurant-header">


                <h1>

                    KitchenFlow

                </h1>



                <p className="welcome-text">

                    Welcome! Choose your favorites

                </p>



                <span className="table-badge">

                    Table {menu.table.tableNumber}

                </span>


            </header>









            <h2 className="menu-title">

                Our Menu

            </h2>









            <div className="category-navigation">


                {

                    categoryNames.map(category => (


                        <button

                            key={category}

                            className={

                                selectedCategory === category

                                ?

                                "active-category"

                                :

                                ""

                            }


                            onClick={() =>
                                setSelectedCategory(category)
                            }

                        >

                            {category}


                        </button>


                    ))

                }


            </div>









            {


                Object.keys(displayedCategories).map(category => (


                    <section

                        className="category-section"

                        key={category}

                    >



                        <h3>

                            {category}

                        </h3>







                        <div className="food-list">



                            {


                                displayedCategories[category].map(item => (



                                    <div

                                        className="food-item"

                                        key={item._id}

                                    >





                                        <img

                                            src={`http://localhost:5000/${item.image}`}

                                            alt={item.name}

                                        />







                                        <div className="food-info">



                                            <h4>

                                                {item.name}

                                            </h4>



                                            <p>

                                                {item.description}

                                            </p>



                                            <strong>

                                                {item.price} DT

                                            </strong>


                                        </div>






                                        <button

                                            onClick={() =>
                                                addToCart(item)
                                            }

                                        >

                                            +

                                        </button>




                                    </div>



                                ))

                            }



                        </div>






                    </section>


                ))

            }









            {
                cart.length > 0 && (


                    <button

                        className="cart-button"

                        onClick={() => setShowCart(true)}

                    >

                        🛒 View Order ({cart.length})

                    </button>


                )
            }









            {
                showCart && (


                    <div

                        className="cart-overlay"

                        onClick={() => setShowCart(false)}

                    >



                        <div

                            className="cart-box"

                            onClick={(e) => e.stopPropagation()}

                        >



                            <h2>

                                Your Order

                            </h2>






                            {


                                cart.map(item => (


                                    <div

                                        className="cart-item"

                                        key={item._id}

                                    >



                                        <div>


                                            <h4>

                                                {item.name}

                                            </h4>



                                            <p>

                                                {item.price} DT x {item.quantity}

                                            </p>


                                        </div>






                                        <div className="cart-actions">


                                            <button

                                                onClick={() =>
                                                    removeFromCart(item._id)
                                                }

                                            >

                                                -

                                            </button>





                                            <span>

                                                {item.quantity}

                                            </span>






                                            <button

                                                onClick={() =>
                                                    addToCart(item)
                                                }

                                            >

                                                +

                                            </button>



                                        </div>



                                    </div>


                                ))

                            }







                            <h3>

                                Total: {totalPrice} DT

                            </h3>







                            <button
    className="confirm-button"
    onClick={confirmOrder}
>
    Confirm Order
</button>






                            <button

                                className="close-cart"

                                onClick={() => setShowCart(false)}

                            >

                                Close

                            </button>




                        </div>



                    </div>


                )
            }







        </div>


    );


}


export default PublicMenu;