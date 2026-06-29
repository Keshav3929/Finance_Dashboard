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
            await registerUser(
                username,
                email,
                password
            );
            alert("Registration Successful");

            navigate("/");

        } catch (error) {
            console.log(error);
            alert("Registration Failed");
        }
    };

    return (
        <div className="container mt-5">

            <h2>Register</h2>

            <form onSubmit={handleRegister}>

                <input
                    className="form-control mb-3"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="btn btn-success">
                    Register
                </button>

            </form>

            <p className="mt-3">
                Already registered? <Link to="/">Login</Link>
            </p>

        </div>
    );
}

export default Register;