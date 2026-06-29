import API from "../api/api";

// Register
export const registerUser = async (username, email, password) => {
    const response = await API.post(
        "/auth/register",
        { username, email, password },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

// Login
export const loginUser = async (email, password) => {
    const response = await API.post(
        "/auth/login",
        { email, password }
    );

    return response.data;
};