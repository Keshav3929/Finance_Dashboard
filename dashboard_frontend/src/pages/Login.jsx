import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {
            console.log(error);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="container mt-5">

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    className="form-control mb-3"
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-primary">
                    Login
                </button>

            </form>

            <p className="mt-3">
                No account? <Link to="/register">Register</Link>
            </p>

        </div>
    );
}

export default Login;