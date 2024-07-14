// src/App.js
import './App.css';
import CustomerTable from './components/CustomerTable';

function App() {

    return (
        <div className="App container p-2">
            <h1 className='bg-info text-center mx-auto rounded-3 mt-2 py-4'>Customer Transactions</h1>
            <CustomerTable  />
        </div>
    );
}

export default App;
