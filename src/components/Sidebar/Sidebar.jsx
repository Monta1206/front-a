import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Sidebar() {
const { user, logout } = useContext(AuthContext);
    return (
        <aside className="sidebar">

            <div className="brand">
                <h2>
                    KitchenFlow
                </h2>

                <span>
                    Restaurant Control
                </span>
            </div>


            <nav>

                <NavLink to="/dashboard">
                    ◉ Live Floor
                </NavLink>

                <NavLink to="/orders">
                    ▣ Orders
                </NavLink>

                <NavLink to="/menu">
                    🍽 Menu
                </NavLink>

<NavLink to="/categories">
    📂 Categories
</NavLink>

                <NavLink to="/tables">
                    ◫ Tables
                </NavLink>

                <NavLink to="/users">
                    👥 Staff
                </NavLink>

            </nav>


            <div className="staff-status">

    <p>Current User</p>

    <strong>
        {user?.fullname || "Unknown User"}
    </strong>

    <span>
        ● {user?.role || "Offline"}
    </span>


    <button onClick={logout}>
        Logout
    </button>

</div>


        </aside>
    );
}


export default Sidebar;