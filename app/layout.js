// Add dark mode toggle to layout
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Layout({ children }) {
  const theme = useTheme();
  const toggleTheme = () => {
    // Implement theme toggle logic here
    // For now, just toggle the theme for demonstration purposes
    theme.palette.mode = theme.palette.mode === 'light' ? 'dark' : 'light';
  };
  return (
    <ThemeProvider theme={theme}>
      <div style={{margin: 2, padding: 2, backgroundColor: theme.palette.background.default}}>        <Button variant="contained" onClick={toggleTheme}>Toggle Theme</Button>
        {children}
      </div>
    </ThemeProvider>
  );
}