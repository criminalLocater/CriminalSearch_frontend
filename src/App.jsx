// src/App.jsx
import React from 'react';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import Home from './components/Home';
import './index.css';
import Routing from './Routes/Routing';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Routing />
    </div>
  );
}

export default App;