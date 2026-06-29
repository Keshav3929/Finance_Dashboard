import { useEffect, useState } from "react";

import {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionsPage,
    exportTransactionsCsv
} from "../services/transactionService";

import Navbar from "../components/Navbar";

function Transactions() {

    const [transactions, setTransactions] = useState([]);

    const [amount, setAmount] = useState("");
    const [type, setType] = useState("INCOME");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const [editId, setEditId] = useState(null);

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("desc");
    const [totalPages, setTotalPages] = useState(0);

    const [filterType, setFilterType] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [searchText, setSearchText] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [filtersActive, setFiltersActive] = useState(false);

    const role = localStorage.getItem("role");

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

    useEffect(() => {
        if (filtersActive) return;

        loadPaginatedTransactions().then((data) => {
            if (data) {
                setTransactions(data.content);
                setTotalPages(data.totalPages);
            }
        });

    }, [page, order, filtersActive]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            amount: Number(amount),
            type,
            category,
            description
        };

        try {
            if (editId) {
                await updateTransaction(editId, payload);
                setEditId(null);
            } else {
                await addTransaction(payload);
            }

            setAmount("");
            setType("INCOME");
            setCategory("");
            setDescription("");

            await refresh();

        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            await refresh();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (transaction) => {
        setEditId(transaction.id);
        setAmount(transaction.amount);
        setType(transaction.type);
        setCategory(transaction.category);
        setDescription(transaction.description);
    };

    const handleApplyFilters = async () => {
        setFiltersActive(true);
        const data = await loadTransactions();
        if (data) setTransactions(data);
    };

    const handleClearFilters = () => {
        setFilterType("");
        setFilterCategory("");
        setSearchText("");
        setStartDate("");
        setEndDate("");
        setFiltersActive(false);
        setPage(0);
    };

    const handleExportCsv = async () => {
        try {
            const blob = await exportTransactionsCsv();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "transactions.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2>Transactions</h2>

                <div className="mb-4">
                    <select
                        className="form-control"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>

                {/* FILTERS */}

                <div
                    className="card shadow p-4 mb-4"
                    style={{ borderRadius: "20px" }}
                >
                    <h4 className="mb-4">Search Filters</h4>

                    <div className="row mb-3">

                        <div className="col-md-2">
                            <label>Start Date</label>
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
                            <label>End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(e.target.value)
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-control"
                                value={filterType}
                                onChange={(e) =>
                                    setFilterType(e.target.value)
                                }
                            >
                                <option value="">All Types</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>

                        <div className="col-md-2">
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
                    </div>

                    <button
                        className="btn btn-primary rounded-pill me-2"
                        onClick={handleApplyFilters}
                    >
                        Apply Filters
                    </button>

                    {filtersActive && (
                        <button
                            className="btn btn-secondary rounded-pill"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* FORM */}

                {role !== "VIEWER" && (
                    <div
                        className="card shadow-lg p-4 mb-4"
                        style={{ borderRadius: "20px" }}
                    >
                        <form onSubmit={handleSubmit}>

                            <input
                                className="form-control mb-3"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                            />

                            <select
                                className="form-control mb-3"
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
                            >
                                <option>INCOME</option>
                                <option>EXPENSE</option>
                            </select>

                            <input
                                className="form-control mb-3"
                                placeholder="Category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            />

                            <input
                                className="form-control mb-3"
                                placeholder="Description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />

                            <button className="btn btn-success rounded-pill">
                                {editId
                                    ? "Update Transaction"
                                    : "Add Transaction"}
                            </button>

                        </form>
                    </div>
                )}

                {/* PAGINATION */}

                {!filtersActive && (
                    <div className="mb-4">
                        <button
                            className="btn btn-secondary me-2 rounded-pill"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>

                        Page {page + 1} of {totalPages}

                        <button
                            className="btn btn-secondary ms-2 rounded-pill"
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* TABLE */}

                <div className="d-flex justify-content-between mb-3">

                    <h3>All Transactions</h3>

                    <button
                        className="btn btn-success rounded-pill"
                        onClick={handleExportCsv}
                    >
                        Download CSV
                    </button>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover table-bordered shadow">

                        <thead className="table-dark">
                        <tr>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {transactions.map((t) => (

                            <tr key={t.id}>

                                <td>₹ {t.amount}</td>

                                <td>
                                    <span
                                        className={
                                            t.type === "INCOME"
                                                ? "badge bg-success"
                                                : "badge bg-danger"
                                        }
                                    >
                                        {t.type}
                                    </span>
                                </td>

                                <td>{t.category}</td>

                                <td>{t.description}</td>

                                <td>

                                    {role !== "VIEWER" && (
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(t)}
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {role === "ADMIN" && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                handleDelete(t.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    )}

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}

export default Transactions;