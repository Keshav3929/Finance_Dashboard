import API from "../api/api";

export const getDashboard = async () => {

    const response = await API.get(
        "/dashboard/summary"
    );

    return response.data;
};


export const getMonthlyTrends = async () => {

    const response = await API.get(
        "/dashboard/monthly-trends"
    );

    return response.data;
};