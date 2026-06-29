import { useEffect, useState } from "react";

import {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionsPage
} from "../services/transactionService";

import Navbar from "../components/Navbar";

function Transactions() {

    // all transactions list
    const [transactions, setTransactions] = useState([]);

    // form states
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("INCOME");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    // edit mode
    const [editId, setEditId] = useState(null);

    // FILTER STATES
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("desc");
    const [totalPages, setTotalPages] = useState(0);
    const [filterType, setFilterType] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [searchText, setSearchText] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // tracks whether filters are currently applied
    const [filtersActive, setFiltersActive] = useState(false);

    // role from localStorage
    const role = localStorage.getItem("role");

    // load filtered transactions (no pagination)
    const loadTransactions = async () => {
        try {
            const data = await getTransactions(
                filterType,
                filterCategory,
                searchText,
                startDate,
                endDate
            );

            return data;

        } catch (error) {
            console.log(error);
            return null;
        }
    };

    // load paginated transactions (no filters)
    const loadPaginatedTransactions = async () => {
        try {
            const data = await getTransactionsPage(
                page,
                5,
                order
            );

            return data;

        } catch (error) {
            console.log(error);
            return null;
        }
    };

    // refresh whichever view is currently active (filtered or paginated)
    const refresh = async () => {
        if (filtersActive) {
            const data = await loadTransactions();
            if (data) setTransactions(data);
        } else {
            const data = await loadPaginatedTransactions();
            if (data) {
                setTransactions(data.content);
                setTotalPages(data.totalPages);
            }
        }
    };

    // load on page/order change (only relevant when not filtering)
    useEffect(() => {
        if (filtersActive) return;

        let ignore = false;

        loadPaginatedTransactions().then((data) => {
            if (!ignore && data) {
                setTransactions(data.content);
                setTotalPages(data.totalPages);
            }
        });

        return () => {
            ignore = true;
        };
    }, [page, order, filtersActive]);


    // add or update
    const handleSubmit = async (e) => {

        e.preventDefault();

        const payload = {
            amount: Number(amount),
            type,
            category,
            description
        };

        try {

            // update mode
            if (editId) {

                await updateTransaction(editId, payload);
                setEditId(null);

            } else {

                // add mode
                await addTransaction(payload);

            }

            // clear form
            setAmount("");
            setType("INCOME");
            setCategory("");
            setDescription("");

            // refresh whichever view is active
            await refresh();

        } catch (error) {

            console.log(error);

        }
    };


    // delete transaction
    const handleDelete = async (id) => {

        try {

            await deleteTransaction(id);

            await refresh();

        } catch (error) {

            console.log(error);

        }
    };


    // edit transaction
    const handleEdit = (transaction) => {

        setEditId(transaction.id);

        setAmount(transaction.amount);

        setType(transaction.type);

        setCategory(transaction.category);

        setDescription(transaction.description);
    };


    // apply filters
    const handleApplyFilters = async () => {
        setFiltersActive(true);
        const data = await loadTransactions();
        if (data) setTransactions(data);
    };

    // clear filters and go back to paginated view
    const handleClearFilters = () => {
        setFilterType("");
        setFilterCategory("");
        setSearchText("");
        setStartDate("");
        setEndDate("");
        setFiltersActive(false);
        setPage(0);
    };


    return (
        <>
            <Navbar />

            <div className="mb-4">

                <select
                    className="form-control"
                    value={order}
                    onChange={(e) =>
                        setOrder(e.target.value)
                    }
                >

                    <option value="desc">
                        Newest First
                    </option>

                    <option value="asc">
                        Oldest First
                    </option>

                </select>

            </div>

            <div className="container mt-5">

                <h2>Transactions</h2>

                <hr />

                <h4>Filters</h4>

                <div className="col-md-2">

                    <label className="form-label">
                        Start Date
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) =>
                            setStartDate(e.target.value)
                        }
                    />

                </div>


                <div className="col-md-2">

                    <label className="form-label">
                        End Date
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) =>
                            setEndDate(e.target.value)
                        }
                    />

                </div>

                {!filtersActive && (

                    <div className="mt-4">

                        <button
                            className="btn btn-secondary me-2"
                            disabled={page === 0}
                            onClick={() =>
                                setPage(page - 1)
                            }
                        >
                            Previous
                        </button>

                        <span>
                         Page {page + 1} of {totalPages}
                        </span>

                        <button
                            className="btn btn-secondary ms-2"
                            disabled={page === totalPages - 1}
                            onClick={() =>
                                setPage(page + 1)
                            }
                        >
                            Next
                        </button>

                    </div>

                )}

                <div className="row mb-4">

                    <div className="col-md-3">

                        <select
                            className="form-control"
                            value={filterType}
                            onChange={(e) =>
                                setFilterType(e.target.value)
                            }
                        >
                            <option value="">
                                All Types
                            </option>

                            <option value="INCOME">
                                Income
                            </option>

                            <option value="EXPENSE">
                                Expense
                            </option>

                        </select>

                    </div>


                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Category"
                            value={filterCategory}
                            onChange={(e) =>
                                setFilterCategory(e.target.value)
                            }
                        />

                    </div>


                    <div className="col-md-3">

                        <input
                            className="form-control"
                            placeholder="Search Description"
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.target.value)
                            }
                        />

                    </div>


                    <div className="col-md-3">

                        <button
                            className="btn btn-primary me-2"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </button>

                        {filtersActive && (
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleClearFilters}
                            >
                                Clear
                            </button>
                        )}

                    </div>

                </div>

                <hr />

                {/* FORM hidden for VIEWER */}

                {role !== "VIEWER" && (

                    <form onSubmit={handleSubmit}>

                        <input
                            className="form-control mb-3"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />


                        <select
                            className="form-control mb-3"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option>INCOME</option>
                            <option>EXPENSE</option>
                        </select>


                        <input
                            className="form-control mb-3"
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />


                        <input
                            className="form-control mb-3"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />


                        <button className="btn btn-success">

                            {editId
                                ? "Update Transaction"
                                : "Add Transaction"}

                        </button>

                    </form>

                )}


                <hr />

                <h3>All Transactions</h3>


                {/* LIST */}

                {transactions.map((t) => (

                    <div
                        key={t.id}
                        className="border p-3 mb-3"
                    >

                        <p>
                            <strong>Amount:</strong> ₹ {t.amount}
                        </p>

                        <p>
                            <strong>Type:</strong> {t.type}
                        </p>

                        <p>
                            <strong>Category:</strong> {t.category}
                        </p>

                        <p>
                            <strong>Description:</strong> {t.description}
                        </p>


                        {/* EDIT hidden for VIEWER */}

                        {role !== "VIEWER" && (

                            <button
                                className="btn btn-warning me-2"
                                onClick={() => handleEdit(t)}
                            >
                                Edit
                            </button>

                        )}


                        {/* DELETE only ADMIN */}

                        {role === "ADMIN" && (

                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(t.id)}
                            >
                                Delete
                            </button>

                        )}

                    </div>

                ))}

            </div>
        </>
    );
}

export default Transactions;