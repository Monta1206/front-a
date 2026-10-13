import "./Categories.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";


function Categories() {

    const [categories, setCategories] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");

    const [editingId, setEditingId] = useState(null);



    const fetchCategories = async () => {

        try {

            const response = await api.get("/categories");

            setCategories(response.data);


        } catch(error) {

            console.log(
                "Error loading categories:",
                error.response?.data
            );

        }

    };



    useEffect(() => {

        fetchCategories();

    }, []);





    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            if(editingId) {


                await api.put(`/categories/${editingId}`, {

                    name

                });


            } else {


                await api.post("/categories", {

                    name

                });


            }



            setName("");

            setEditingId(null);

            setShowForm(false);

            fetchCategories();



        } catch(error) {


            console.log(
                "Error saving category:",
                error.response?.data
            );


        }


    };





    const handleEdit = (category) => {


        setName(category.name);

        setEditingId(category._id);

        setShowForm(true);


    };






    const handleDelete = async (id) => {


        const confirmDelete = window.confirm(
            "Delete this category?"
        );


        if(!confirmDelete) return;



        try {


            await api.delete(`/categories/${id}`);


            fetchCategories();



        } catch(error) {


            console.log(
                "Error deleting category:",
                error.response?.data
            );


        }


    };






    return (

        <DashboardLayout>


            <div className="categories-page">


                <div className="page-header">


                    <div>

                        <h1>
                            Menu Categories
                        </h1>


                        <p>
                            Organize your restaurant menu
                        </p>


                    </div>



                    <button
                        onClick={() => {

                            setShowForm(true);

                            setEditingId(null);

                            setName("");

                        }}
                    >

                        + Add Category

                    </button>


                </div>






                {
                    showForm && (

                        <div className="category-form">


                            <form onSubmit={handleSubmit}>


                                <input

                                    type="text"

                                    placeholder="Category name"

                                    value={name}

                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }

                                    required

                                />



                                <button type="submit">

                                    {
                                        editingId
                                        ? "Update"
                                        : "Save"
                                    }

                                </button>



                                <button

                                    type="button"

                                    onClick={() => {

                                        setShowForm(false);

                                        setEditingId(null);

                                        setName("");

                                    }}

                                >

                                    Cancel

                                </button>


                            </form>


                        </div>

                    )
                }







                <div className="categories-grid">



                    {
                        categories.length === 0 ? (


                            <p className="empty">

                                No categories found

                            </p>



                        ) : (


                            categories.map(category => (


                                <div

                                    className="category-card"

                                    key={category._id}

                                >



                                    <h2>

                                        {category.name}

                                    </h2>




                                    <div className="category-actions">


                                        <button

                                            className="edit-button"

                                            onClick={() =>
                                                handleEdit(category)
                                            }

                                        >

                                            Edit

                                        </button>




                                        <button

                                            className="delete-button"

                                            onClick={() =>
                                                handleDelete(category._id)
                                            }

                                        >

                                            Delete

                                        </button>


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



export default Categories;