import React from 'react';
import { Box, IconButton } from '@mui/material';

const Header = ({ isLoggedIn, onLogout }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding="16px"
      bgcolor="#003366"
      color="white"
    >
      <h1>Електронен дневник</h1>
      {isLoggedIn && (
        <IconButton onClick={onLogout} sx={{ color: 'white' }}>
          <img src="/images/logout.png" alt="Logout" style={{ width: 24, height: 24 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default Header;
