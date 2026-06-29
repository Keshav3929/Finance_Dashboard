import { useEffect, useState } from "react";
import {
    getDashboard,
    getMonthlyTrends
} from "../services/dashboardService";

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Chart imports
import { Pie, Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

// Register chart components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);

    const navigate = useNavigate();

    // Fetch dashboard + monthly trends
    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                // summary API
                const data = await getDashboard();
                setSummary(data);

                // monthly trends API
                const trends = await getMonthlyTrends();

                console.log("MONTHLY DATA:", trends);

                setMonthlyData(trends);

            } catch (error) {

                console.log(error);

            }
        };

        fetchDashboard();

    }, []);


    // PIE CHART DATA
    const pieChartData = summary
        ? {
            labels: ["Income", "Expense"],

            datasets: [
                {
                    label: "Finance Summary",

                    data: [
                        summary.totalIncome,
                        summary.totalExpense
                    ],

                    backgroundColor: [
                        "green",
                        "red"
                    ]
                }
            ]
        }
        : null;


    // Month names
    const monthNames = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];


    // BAR CHART DATA
    const barChartData = monthlyData
        ? {
            labels: Object.keys(monthlyData).map(
                month => monthNames[parseInt(month)]
            ),

            datasets: [
                {
                    label: "Monthly Transactions",

                    data: Object.values(monthlyData),

                    backgroundColor: ["blue"]
                }
            ]
        }
        : null;


    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2 className="mb-4">
                    Financial Overview
                </h2>


                {/* SUMMARY CARDS */}

                {summary ? (

                    <div className="row">

                        {/* Income */}

                        <div className="col-md-4">

                            <div className="card shadow p-3 text-center">

                                <h5>Total Income</h5>

                                <h3>
                                    ₹ {summary.totalIncome}
                                </h3>

                            </div>

                        </div>


                        {/* Expense */}

                        <div className="col-md-4">

                            <div className="card shadow p-3 text-center">

                                <h5>Total Expense</h5>

                                <h3>
                                    ₹ {summary.totalExpense}
                                </h3>

                            </div>

                        </div>


                        {/* Balance */}

                        <div className="col-md-4">

                            <div className="card shadow p-3 text-center">

                                <h5>Net Balance</h5>

                                <h3>
                                    ₹ {summary.netBalance}
                                </h3>

                            </div>

                        </div>

                    </div>

                ) : (

                    <p>Loading Dashboard...</p>

                )}


                {/* BUTTON */}

                <div className="mt-5">

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/transactions")}
                    >
                        Manage Transactions
                    </button>

                </div>


                {/* PIE CHART */}

                <div className="mt-5">

                    <h3 className="mb-3">
                        Income vs Expense
                    </h3>

                    {pieChartData && (

                        <div style={{ width: "400px" }}>

                            <Pie data={pieChartData} />

                        </div>

                    )}

                </div>


                {/* BAR CHART */}

                <div className="mt-5">

                    <h3 className="mb-3">
                        Monthly Trends
                    </h3>

                    {barChartData && (

                        <div style={{ width: "700px" }}>

                            <Bar data={barChartData} />

                        </div>

                    )}

                </div>

            </div>
        </>
    );
}

export default Dashboard;