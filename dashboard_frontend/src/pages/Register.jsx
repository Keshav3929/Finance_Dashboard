import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            await registerUser({
                username,
                email,
                password
            });

            alert("Registration Successful");

            navigate("/");

        } catch (error) {
            console.log(error);
            alert("Registration Failed");
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card shadow-lg">

                <h2 className="text-center mb-4">
                    Create Account
                </h2>

                <form onSubmit={handleRegister}>

                    <input
                        className="form-control mb-3"
                        placeholder="Username"
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

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
                        className="btn btn-success w-100 rounded-pill"
                    >
                        Register
                    </button>

                </form>

                <p className="mt-4 text-center">

                    Already have account?

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;