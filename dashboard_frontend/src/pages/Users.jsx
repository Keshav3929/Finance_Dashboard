import { useEffect, useState } from "react";

import {
    getUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser
} from "../services/userService";

import Navbar from "../components/Navbar";

function Users() {

    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);


    const handleRoleChange = async (id, role) => {
        await updateUserRole(id, role);
        loadUsers();
    };

    const handleStatus = async (id, active) => {
        await updateUserStatus(id, active);
        loadUsers();
    };

    const handleDelete = async (id) => {
        await deleteUser(id);
        loadUsers();
    };


    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2>User Management</h2>

                {users.map((user) => (

                    <div
                        key={user.id}
                        className="border p-3 mb-3"
                    >

                        <p>
                            <strong>Username:</strong> {user.username}
                        </p>

                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>

                        <p>
                            <strong>Role:</strong> {user.role}
                        </p>

                        <p>
                            <strong>Status:</strong>

                            {user.active
                                ? " Active"
                                : " Inactive"}
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
                            className="btn btn-secondary me-2"
                            onClick={() =>
                                handleStatus(
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
                            Delete
                        </button>

                    </div>
                ))}

            </div>
        </>
    );
}

export default Users;