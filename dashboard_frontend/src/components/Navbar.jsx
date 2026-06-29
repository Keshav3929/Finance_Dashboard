import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        alert("Logged Out");

        navigate("/");
    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <Link
                    className="navbar-brand"
                    to="/dashboard"
                >
                    Finance Dashboard
                </Link>

                <div>

                    <Link
                        className="btn btn-outline-light me-2"
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>


                    <Link
                        className="btn btn-outline-light me-2"
                        to="/transactions"
                    >
                        Transactions
                    </Link>


                    {/* Only ADMIN can see Admin Panel */}

                    {role === "ADMIN" && (

                        <Link
                            className="btn btn-warning me-2"
                            to="/admin"
                        >
                            Admin Panel
                        </Link>

                    )}


                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;