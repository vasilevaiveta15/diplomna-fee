// src/styles/LoginStyles.js

import { Box, Typography } from '@mui/material';

export const LoginContainer = ({ children }) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    height="100vh"
    bgcolor="#003366"
    color="white"
    p={2}
  >
    {children}
  </Box>
);

export const LoginBox = ({ children }) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    maxWidth={400} 
    width="100%"
    p={3}
    bgcolor="white"
    borderRadius={2}
    boxShadow={3}
  >
    {children}
  </Box>
);

export const Title = () => (
  <Typography 
    variant="h3" 
    component="h1" 
    sx={{ 
      fontWeight: 'bold', 
      mb: 3 
    }}
  >
    Електронен дневник
  </Typography>
);
