import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const handleLogin = async (e) => {

        e.preventDefault();


        try {

            const response = await api.post("/users/login", {
                email,
                password
            });


            const { token, user } = response.data.data;


            login(user, token);


            navigate("/dashboard");


        } catch(error) {

            console.log(
                error.response?.data || error.message
            );

        }

    };



    return (

        <div className="login-page">


            <div className="login-box">


                <div className="login-brand">

                    <h1>
                        KitchenFlow
                    </h1>

                    <p>
                        Restaurant Control Center
                    </p>

                </div>



                <form onSubmit={handleLogin}>


                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="staff@restaurant.com"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />



                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />



                    <button>
                        Enter Kitchen
                    </button>


                </form>



                <span className="login-footer">
                    Authorized staff only
                </span>


            </div>


        </div>

    );

}


export default Login;