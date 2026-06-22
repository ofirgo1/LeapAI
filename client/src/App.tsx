import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AppRouter from './pages/AppRouter';

const App = () => <AppRouter />;

export default App;
