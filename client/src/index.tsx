// New, Corrected Code
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import the provider AND the theme
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Create a theme instance
const theme = extendTheme({
  // You can add custom colors, fonts, etc. here later
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Pass the theme to the provider */}
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);