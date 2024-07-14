import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionGraph = ({ customerId, chartType }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get("https://run.mocky.io/v3/60217202-53fa-476b-87e2-7a915f0e2d89");
                setTransactions(data.transactions.filter(t => t.customer_id === customerId));
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        }
        if (customerId !== null) {
            fetchData();
        }
    }, [customerId]);

    const data = {
        labels: transactions.map(t => t.date),
        datasets: [
            {
                label: 'Transaction Amount',
                data: transactions.map(t => t.amount),
                backgroundColor: transactions.map(() => 'rgba(75, 192, 192, 0.2)'),
                borderColor: transactions.map(() => 'rgba(75, 19, 192, 1)'),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Transaction Graph for Customer ${customerId}`,
            },
        },
    };

    return (
        <div className='w-75 mx-auto'>
            {transactions.length > 0 ? (
                chartType === 'doughnut' ? (
                    <Doughnut data={data} options={options} />
                ) : (
                    <Pie data={data} options={options} />
                )
            ) : (
                <p className='text-center'>No transactions available for the selected customer.</p>
            )}
        </div>
    );
};

export default TransactionGraph;
