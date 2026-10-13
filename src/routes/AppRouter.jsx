import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import Categories from "../pages/Categories/Categories";
import Menu from "../pages/Menu/Menu";
import Orders from "../pages/Orders/Orders";
import Tables from "../pages/Tables/Tables";
import PublicMenu from "../pages/PublicMenu/PublicMenu";
import NotFound from "../pages/NotFound/NotFound";

import ProtectedRoute from "./ProtectedRoute";


function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>


                {/* Public Routes */}

                <Route 
                    path="/" 
                    element={<Login />} 
                />


                <Route 
                    path="/menu/:tableNumber" 
                    element={<PublicMenu />} 
                />





                {/* Protected Routes */}


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <Categories />
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/menu"
                    element={
                        <ProtectedRoute>
                            <Menu />
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/tables"
                    element={
                        <ProtectedRoute>
                            <Tables />
                        </ProtectedRoute>
                    }
                />





                {/* 404 */}

                <Route 
                    path="*" 
                    element={<NotFound />} 
                />


            </Routes>


        </BrowserRouter>

    );

}


export default AppRouter;