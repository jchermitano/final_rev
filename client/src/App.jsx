// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Layout from './components/Layout'; // Import Layout component
import Log from './components/Log';
import Account from './components/Account';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AdminPanel />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="logs" element={<Log />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
