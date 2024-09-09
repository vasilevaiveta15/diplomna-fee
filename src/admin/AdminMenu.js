import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import StudentRegistration from './StudentRegistration';
import Term from './Term';
import FinalGrade from './FinalGrade';
import UsersAdmin from './UsersAdmin'; // Импортираме новия компонент UsersAdmin

const AdminMenu = () => {
  const [showStudentRegistration, setShowStudentRegistration] = useState(false);
  const [showTerm, setShowTerm] = useState(false);
  const [showFinalGrade, setShowFinalGrade] = useState(false);
  const [showUsersAdmin, setShowUsersAdmin] = useState(false); // Добавяме състояние за UsersAdmin
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleShowStudentRegistration = () => {
    setShowStudentRegistration(true);
    setShowTerm(false);
    setShowFinalGrade(false);
    setShowUsersAdmin(false); // Скриваме останалите компоненти
  };

  const handleShowTerm = () => {
    setShowStudentRegistration(false);
    setShowTerm(true);
    setShowFinalGrade(false);
    setShowUsersAdmin(false);
  };

  const handleShowFinalGrade = () => {
    setShowStudentRegistration(false);
    setShowTerm(false);
    setShowFinalGrade(true);
    setShowUsersAdmin(false);
  };

  const handleShowUsersAdmin = () => {
    setShowStudentRegistration(false);
    setShowTerm(false);
    setShowFinalGrade(false);
    setShowUsersAdmin(true); // Показваме компонента UsersAdmin
  };

  const handleBack = () => {
    setShowStudentRegistration(false);
    setShowTerm(false);
    setShowFinalGrade(false);
    setShowUsersAdmin(false);
  };

  const handleAddNextYear = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/be/e-journal/next-year', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Неуспешно добавяне на нова година');
      }

      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 4000);
    } catch (error) {
      alert(error.message);
    }
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
            <Term onBack={handleBack} onSuccess={() => setShowTerm(false)} />
        ) : showFinalGrade ? (
            <FinalGrade onBack={handleBack} />
        ) : showUsersAdmin ? (
            <UsersAdmin onBack={handleBack} /> // Добавяме новия компонент UsersAdmin
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
              <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleShowUsersAdmin}>
                Потребители {/* Нов бутон за Потребители */}
              </Button>
              <Button variant="contained" color="secondary" sx={{ marginTop: 2 }} onClick={handleAddNextYear}>
                Добавяне на нова година
              </Button>
            </Box>
        )}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            message="Успешно добавихте нова година на всички ученици!"
            ContentProps={{
              sx: { backgroundColor: 'green', color: 'white', textAlign: 'center' },
            }}
        />
      </Box>
  );
};

export default AdminMenu;
