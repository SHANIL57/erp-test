import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Purchase from './pages/Purchase';
import Inventory from './pages/Inventory';
// import SalesmanReceivable from './pages/SalesmanReceivable';
import Reports from './pages/Reports';
import DailyCollectionSheet from './pages/DailyCollectionSheet';
// import SalesRegister from './pages/SalesRegister';
// import SalesSummary from './pages/SalesSummary';
import Statement from './pages/Statement';
import FishBoxesReceived from './pages/FishBoxesReceived';
import FishBoxesSent from './pages/FishBoxesSent';
import CustomerManagement from './pages/CustomerManagement';
import PartyManagement from './pages/PartyManagement';
// import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/inventory" element={<Inventory />} />
{/*               <Route path="/salesman-receivable" element={<SalesmanReceivable />} /> */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/daily-collection" element={<DailyCollectionSheet />} />
{/*               <Route path="/sales-register" element={<SalesRegister />} /> */}
{/*               <Route path="/sales-summary" element={<SalesSummary />} /> */}
              <Route path="/statement" element={<Statement />} />
              <Route path="/fish-boxes-received" element={<FishBoxesReceived />} />
              <Route path="/fish-boxes-sent" element={<FishBoxesSent />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/parties" element={<PartyManagement />} />
{/*               <Route path="/admin" element={<AdminPanel />} /> */}
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
