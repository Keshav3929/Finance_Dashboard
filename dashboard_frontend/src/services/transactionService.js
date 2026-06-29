import API from "../api/api";

// get all transactions
export const getTransactions = async (
    type,
    category,
    search,
    startDate,
    endDate
) => {

    let url = "/transactions?";

    if (type) {
        url += `type=${type}&`;
    }

    if (category) {
        url += `category=${category}&`;
    }

    if (search) {
        url += `search=${search}&`;
    }

    if (startDate) {
        url += `startDate=${startDate}&`;
    }

    if (endDate) {
        url += `endDate=${endDate}&`;
    }

    const response = await API.get(url);

    return response.data;
};

export const getTransactionsPage = async (
    page,
    size,
    order
) => {

    const response = await API.get(
        `/transactions/page?page=${page}&size=${size}&sortBy=date&order=${order}`
    );

    return response.data;
};

// create transaction
export const addTransaction = async (data) => {
    const response = await API.post("/transactions", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data;
};

// delete transaction
export const deleteTransaction = async (id) => {
    const response = await API.delete(`/transactions/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data;
};

// update transaction
export const updateTransaction = async (id, data) => {
    const response = await API.put(`/transactions/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data;
};