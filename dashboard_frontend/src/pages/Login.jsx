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

            navigate("/dashboard");

        } catch (error) {
            console.log(error);
            alert("Login Failed");
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card shadow-lg">

                <h2 className="text-center mb-4">
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin}>

                    <input
                        className="form-control mb-3"
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        className="btn btn-primary w-100 rounded-pill"
                    >
                        Login
                    </button>

                </form>

                <p className="mt-4 text-center">

                    New User?

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;