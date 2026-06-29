import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser
} from "../services/userService";

function Admin() {

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    // Load all users
    const loadUsers = async () => {
        try {
            const data = await getUsers();
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    // Check role + load users
    useEffect(() => {

        const role = localStorage.getItem("role");

        // Block non-admin users
        if (role !== "ADMIN") {
            navigate("/dashboard");
            return;
        }

        let ignore = false;

        loadUsers().then((data) => {
            if (!ignore && data) {
                setUsers(data);
            }
        });

        return () => {
            ignore = true;
        };

    }, [navigate]);


    // Change role
    const handleRoleChange = async (id, role) => {
        try {
            await updateUserRole(id, role);
            const data = await loadUsers();
            if (data) setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };


    // Change active/inactive status
    const handleStatusChange = async (id, active) => {
        try {
            await updateUserStatus(id, active);
            const data = await loadUsers();
            if (data) setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };


    // Delete user
    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            const data = await loadUsers();
            if (data) setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2 className="mb-4">
                    Admin Panel
                </h2>

                {users.map((user) => (

                    <div
                        key={user.id}
                        className="border p-3 mb-3 rounded shadow-sm"
                    >

                        <p>
                            <strong>Name:</strong> {user.username}
                        </p>

                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>

                        <p>
                            <strong>Role:</strong> {user.role}
                        </p>

                        <p>
                            <strong>Status:</strong>
                            {user.active ? " Active" : " Inactive"}
                        </p>


                        <button
                            className="btn btn-warning me-2"
                            onClick={() =>
                                handleRoleChange(user.id, "ADMIN")
                            }
                        >
                            Make Admin
                        </button>


                        <button
                            className="btn btn-info me-2"
                            onClick={() =>
                                handleRoleChange(user.id, "VIEWER")
                            }
                        >
                            Make Viewer
                        </button>


                        <button
                            className="btn btn-secondary me-2"
                            onClick={() =>
                                handleStatusChange(
                                    user.id,
                                    !user.active
                                )
                            }
                        >
                            Toggle Status
                        </button>


                        <button
                            className="btn btn-danger"
                            onClick={() =>
                                handleDelete(user.id)
                            }
                        >
                            Delete User
                        </button>

                    </div>

                ))}

            </div>
        </>
    );
}

export default Admin;