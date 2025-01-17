import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Login successful");
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred during login");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center p-5 bg-gray-200">
            <div className="h-fit w-full max-w-md flex flex-col items-start bg-white px-8 py-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-8">Admin Login</h1>
                <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            className="w-full py-3 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="email@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            className="w-full py-3 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-black text-white rounded-md hover:bg-[#000000eb] focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;


