import API from "../api/api";

// Get all users
export const getUsers = async () => {
    const response = await API.get("/users");
    return response.data;
};

// Create user
export const createUser = async (userData) => {
    const response = await API.post(
        "/users",
        userData
    );

    return response.data;
};

// Update role
export const updateUserRole = async (id, role) => {
    const response = await API.put(
        `/users/${id}/role?role=${role}`
    );

    return response.data;
};

// Update active status
export const updateUserStatus = async (id, active) => {
    const response = await API.put(
        `/users/${id}/status?active=${active}`
    );

    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await API.delete(
        `/users/${id}`
    );

    return response.data;
};