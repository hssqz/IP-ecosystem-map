import React from 'react';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
}

export default App;
