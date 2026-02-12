import React from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';

function Layout({ children }) {
  return (
    <Box
      sx={{
        mx: 'auto',
        maxWidth: '1200px',
        p: 2,
        backgroundColor: 'black',
      }}
    >
      <Head>
        <title>Inventory Management System</title>
      </Head>
      {children}
    </Box>
  );
}

export default Layout;
