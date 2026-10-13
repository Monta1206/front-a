import "./Menu.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";


function Menu() {


    const [items, setItems] = useState([]);

    const [categories, setCategories] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);



    const [formData, setFormData] = useState({

        name:"",
        description:"",
        price:"",
        category:"",
        image:null

    });





    const fetchMenu = async () => {

        try {

            const response = await api.get("/menu-items");

            setItems(response.data);


        } catch(error) {

            console.log(error.response?.data);

        }

    };





    const fetchCategories = async () => {

        try {

            const response = await api.get("/categories");

            setCategories(response.data);


        } catch(error) {

            console.log(error.response?.data);

        }

    };





    useEffect(() => {

        fetchMenu();

        fetchCategories();

    }, []);








    const handleChange = (e) => {


        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });


    };





    const handleImage = (e) => {


        setFormData({

            ...formData,

            image:e.target.files[0]

        });


    };







    const handleSubmit = async (e) => {

        e.preventDefault();



        try {


            const data = new FormData();


            data.append("name", formData.name);

            data.append(
                "description",
                formData.description
            );


            data.append(
                "price",
                formData.price
            );


            data.append(
                "category",
                formData.category
            );



            if(formData.image){

                data.append(
                    "image",
                    formData.image
                );

            }





            if(editingId){


                await api.put(
                    `/menu-items/${editingId}`,
                    data,
                    {
                        headers:{
                            "Content-Type":"multipart/form-data"
                        }
                    }
                );


            } else {



                await api.post(
                    "/menu-items",
                    data,
                    {
                        headers:{
                            "Content-Type":"multipart/form-data"
                        }
                    }
                );


            }





            setFormData({

                name:"",
                description:"",
                price:"",
                category:"",
                image:null

            });



            setEditingId(null);

            setShowForm(false);


            fetchMenu();



        } catch(error){

            console.log(
                "Error saving item:",
                error.response?.data
            );

        }


    };









    const handleEdit = (item) => {


        setFormData({

            name:item.name,

            description:item.description,

            price:item.price,

            category:item.category._id,

            image:null

        });


        setEditingId(item._id);

        setShowForm(true);


    };








    const handleDelete = async (id) => {


        const confirm = window.confirm(
            "Delete this dish?"
        );


        if(!confirm) return;



        try {


            await api.delete(
                `/menu-items/${id}`
            );


            fetchMenu();



        } catch(error){

            console.log(
                error.response?.data
            );

        }


    };







    const toggleAvailability = async (item) => {


        try {


            await api.put(
                `/menu-items/${item._id}`,
                {
                    available: !item.available
                }
            );


            fetchMenu();



        } catch(error){

            console.log(
                error.response?.data
            );

        }


    };









    return (

        <DashboardLayout>


            <div className="menu-page">


                <div className="page-header">


                    <div>

                        <h1>
                            Menu Control
                        </h1>

                        <p>
                            Manage dishes and restaurant offers
                        </p>

                    </div>



                    <button
                        onClick={() => {

                            setEditingId(null);

                            setShowForm(true);

                        }}
                    >

                        + Add Dish

                    </button>



                </div>







                {
                    showForm && (

                        <div className="menu-form">


                            <form onSubmit={handleSubmit}>


                                <input

                                    name="name"

                                    placeholder="Dish name"

                                    value={formData.name}

                                    onChange={handleChange}

                                    required

                                />



                                <textarea

                                    name="description"

                                    placeholder="Description"

                                    value={formData.description}

                                    onChange={handleChange}

                                    required

                                />



                                <input

                                    name="price"

                                    type="number"

                                    placeholder="Price"

                                    value={formData.price}

                                    onChange={handleChange}

                                    required

                                />




                                <select

                                    name="category"

                                    value={formData.category}

                                    onChange={handleChange}

                                    required

                                >

                                    <option value="">
                                        Select category
                                    </option>


                                    {
                                        categories.map(category => (

                                            <option

                                                key={category._id}

                                                value={category._id}

                                            >

                                                {category.name}

                                            </option>

                                        ))
                                    }


                                </select>




                                <input

                                    type="file"

                                    onChange={handleImage}

                                />




                                <button>

                                    {
                                        editingId
                                        ? "Update"
                                        : "Save"
                                    }

                                </button>




                                <button

                                    type="button"

                                    onClick={() => setShowForm(false)}

                                >

                                    Cancel

                                </button>


                            </form>


                        </div>

                    )
                }









                <div className="menu-grid">


                    {
                        items.map(item => (


                            <div

                                className="menu-card"

                                key={item._id}

                            >



                                <img

                                    src={`http://localhost:5000/${item.image}`}

                                    alt={item.name}

                                    className="food-image"

                                />



                                <h3>
                                    {item.name}
                                </h3>



                                <p className="category">

                                    {item.category?.name}

                                </p>




                                <div className="price">

                                    {item.price} DT

                                </div>




                                <span
                                    className={
                                        item.available
                                        ? "available"
                                        : "unavailable"
                                    }
                                    onClick={() =>
                                        toggleAvailability(item)
                                    }
                                >

                                    ● {
                                        item.available
                                        ? "Available"
                                        : "Unavailable"
                                    }

                                </span>





                                <button

                                    className="edit-button"

                                    onClick={() =>
                                        handleEdit(item)
                                    }

                                >

                                    Edit

                                </button>




                                <button

                                    className="delete-button"

                                    onClick={() =>
                                        handleDelete(item._id)
                                    }

                                >

                                    Delete

                                </button>



                            </div>


                        ))
                    }


                </div>



            </div>


        </DashboardLayout>

    );

}


export default Menu;