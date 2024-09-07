import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import StudentRegistration from './StudentRegistration'; // Импортирайте компонента за регистрация на ученик
import Term from './Term'; // Импортирайте компонента Term

const AdminMenu = () => {
  const [showStudentRegistration, setShowStudentRegistration] = useState(false);
  const [showTerm, setShowTerm] = useState(false);

  const handleShowStudentRegistration = () => {
    setShowStudentRegistration(true);
    setShowTerm(false);
  };

  const handleShowTerm = () => {
    setShowStudentRegistration(false);
    setShowTerm(true);
  };

  const handleBack = () => {
    setShowStudentRegistration(false);
    setShowTerm(false);
  };

  const handleTermSuccess = () => {
    setShowTerm(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: '#003366', padding: 3 }}
    >
      {showStudentRegistration ? (
        <StudentRegistration onBack={handleBack} />
      ) : showTerm ? (
        <Term onBack={handleBack} onSuccess={handleTermSuccess} />
      ) : (
        <Box
          sx={{
            backgroundColor: '#004080',
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            width: '100%',
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" color="white" gutterBottom>
            Админ меню
          </Typography>
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleShowStudentRegistration}>
            Създаване на ученически профил
          </Button>
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleShowTerm}>
            Създаване на срокове и предмети
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AdminMenu;
