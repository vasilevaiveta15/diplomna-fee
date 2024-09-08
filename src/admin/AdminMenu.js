import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import StudentRegistration from './StudentRegistration'; // Импортирайте компонента за регистрация на ученик
import Term from './Term'; // Импортирайте компонента Term
import FinalGrade from './FinalGrade'; // Импортирайте новия компонент FinalGrade

const AdminMenu = () => {
  const [showStudentRegistration, setShowStudentRegistration] = useState(false);
  const [showTerm, setShowTerm] = useState(false);
  const [showFinalGrade, setShowFinalGrade] = useState(false); // Добавяме състояние за FinalGrade

  const handleShowStudentRegistration = () => {
    setShowStudentRegistration(true);
    setShowTerm(false);
    setShowFinalGrade(false);
  };

  const handleShowTerm = () => {
    setShowStudentRegistration(false);
    setShowTerm(true);
    setShowFinalGrade(false);
  };

  const handleShowFinalGrade = () => {
    setShowStudentRegistration(false);
    setShowTerm(false);
    setShowFinalGrade(true);
  };

  const handleBack = () => {
    setShowStudentRegistration(false);
    setShowTerm(false);
    setShowFinalGrade(false);
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
        ) : showFinalGrade ? (
            <FinalGrade onBack={handleBack} />
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
                Създаване на предмети
              </Button>
              <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleShowFinalGrade}>
                Добавяне на срочна оценка
              </Button>
            </Box>
        )}
      </Box>
  );
};

export default AdminMenu;
