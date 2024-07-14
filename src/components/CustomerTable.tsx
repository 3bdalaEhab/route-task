import axios from 'axios';
import { useState, useEffect } from 'react';
import TransactionGraph from './TransactionGraph';

const CustomerTable = () => {
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [chartType, setChartType] = useState('doughnut');

    async function getData() {
        const { data } = await axios.get("https://run.mocky.io/v3/60217202-53fa-476b-87e2-7a915f0e2d89");
        console.log(data);
        setCustomers(data.customers);
        setTransactions(data.transactions);
    }

    useEffect(() => {
        getData();
    }, []);

    const handleNameFilter = (event) => {
        setNameFilter(event.target.value.toLowerCase());
    };

    const handleAmountFilter = (event) => {
        setAmountFilter(event.target.value);
    };

    useEffect(() => {
        const filtered = customers.filter(customer => {
            const customerTransactions = transactions.filter(t => t.customer_id === customer.id);
            const totalAmount = customerTransactions.reduce((sum, t) => sum + t.amount, 0);

            return customer.name.toLowerCase().includes(nameFilter) &&
                   (amountFilter === '' || totalAmount >= parseFloat(amountFilter));
        });
        setFilteredCustomers(filtered);
    }, [nameFilter, amountFilter, customers, transactions]);

    return (
        <div>
            <div className='w-100 d-flex gap-4'>
                <input 
                    type="text" 
                    placeholder="Filter by customer name" 
                    className="form-control w-50 mx-auto my-3" 
                    onChange={handleNameFilter} 
                />
                <input 
                    type="number" 
                    placeholder="Filter by minimum total amount" 
                    className="form-control w-50 mx-auto my-3" 
                    onChange={handleAmountFilter} 
                />
                <select 
                    className="form-control w-25 mx-auto my-3" 
                    value={chartType} 
                    onChange={(e) => setChartType(e.target.value)}
                >
                    <option value="doughnut">Doughnut</option>
                    <option value="pie">Pie</option>
                </select>
            </div>
            <table  className='table table-light rounded-5 text-center overflow-auto '>
                <thead>
                    <tr>
                        <th>#ID</th>
                        <th>Name</th>
                        <th>Total Amount</th>
                        <th>Transactions</th>
                        <th>Graph</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(customer => {
                        const customerTransactions = transactions.filter(t => t.customer_id === customer.id);
                        const totalAmount = customerTransactions.reduce((sum, t) => sum + t.amount, 0);

                        return (
                            <tr key={customer.id} className=''>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{totalAmount}</td> 
                                <td>
                                    {customerTransactions.map((transaction, index) => (
                                        <div key={index}>
                                            Amount: {transaction.amount}, Date: {transaction.date}
                                        </div>
                                    ))}
                                </td>
                                <td > 
                                    <div className='w-75'>

                                <TransactionGraph customerId={customer.id} chartType={chartType} />
                                    </div>
                                </td> 
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable;
