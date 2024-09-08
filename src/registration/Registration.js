import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, Paper, MenuItem } from '@mui/material';

const roles = [
  { value: 'ADMIN', label: 'АДМИН' },
  { value: 'TEACHER', label: 'УЧИТЕЛ' },
];

const roleMapping = {
  'АДМИН': 'ADMIN',
  'УЧИТЕЛ': 'TEACHER',
};

const Registration = ({ onBackToLogin }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatedPassword: '',
    role: '',
    clas: '',
    group: '',
    subjectId: '',
  });

  const [subjects, setSubjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/be/e-journal/all-subjects');
        if (response.ok) {
          const data = await response.json();

          // Премахваме срока от показваните имена на предметите
          const updatedSubjects = data.map(subject => ({
            ...subject,
            displayName: subject.name, // Показва се само името на предмета
          }));

          setSubjects(updatedSubjects);
        } else {
          console.error('Error fetching subjects:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRegister = async () => {
    const registrationData = { ...formValues };

    registrationData.role = roleMapping[formValues.role] || null;

    try {
      const response = await fetch('http://localhost:8080/api/be/e-journal/user/reg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setSuccessMessage('Успешна регистрация!');
      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatedPassword: '',
        role: '',
        clas: '',
        group: '',
        subjectId: '',
      });

      setTimeout(() => setSuccessMessage(null), 5000);
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
          sx={{ backgroundColor: '#003366' }}
      >
        <Paper
            style={{
              padding: 20,
              maxWidth: 600,
              width: '100%',
              backgroundColor: '#004080',
              borderRadius: 8,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              boxSizing: 'border-box',
            }}
        >
          <Typography variant="h5" gutterBottom color="white" align="center">
            Регистрация
          </Typography>
          <Box mb={2}>
            <TextField
                label="Първо име"
                name="firstName"
                fullWidth
                margin="normal"
                value={formValues.firstName}
                onChange={handleInputChange}
                sx={{ input: { color: 'white' }, label: { color: 'white' }, mb: 2 }}
            />
          </Box>
          <Box mb={2}>
            <TextField
                label="Фамилия"
                name="lastName"
                fullWidth
                margin="normal"
                value={formValues.lastName}
                onChange={handleInputChange}
                sx={{ input: { color: 'white' }, label: { color: 'white' }, mb: 2 }}
            />
          </Box>
          <Box mb={2}>
            <TextField
                label="Имейл"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formValues.email}
                onChange={handleInputChange}
                autoComplete="off"
                sx={{ input: { color: 'white' }, label: { color: 'white' }, mb: 2 }}
            />
          </Box>
          <Box mb={2}>
            <TextField
                label="Парола"
                type="password"
                name="password"
                fullWidth
                margin="normal"
                value={formValues.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                sx={{ input: { color: 'white' }, label: { color: 'white' }, mb: 2 }}
            />
          </Box>
          <Box mb={2}>
            <TextField
                label="Повторете парола"
                type="password"
                name="repeatedPassword"
                fullWidth
                margin="normal"
                value={formValues.repeatedPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                sx={{ input: { color: 'white' }, label: { color: 'white' }, mb: 2 }}
            />
          </Box>
          <Box mb={2}>
            <TextField
                select
                label="Роля"
                name="role"
                fullWidth
                margin="normal"
                value={formValues.role}
                onChange={handleInputChange}
                sx={{ input: { color: 'white' }, label: { color: 'white' }, mb: 2 }}
            >
              {roles.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
              ))}
            </TextField>
          </Box>
          {formValues.role === 'УЧИТЕЛ' && (
              <>
                <Box mb={2}>
                  <TextField
                      select
                      label="Предмет"
                      name="subjectId"
                      fullWidth
                      margin="normal"
                      value={formValues.subjectId}
                      onChange={handleInputChange}
                      sx={{ input: { color: 'white' }, label: { color: 'white' }, mb: 2 }}
                  >
                    {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.displayName} {/* Показваме само името на предмета */}
                        </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </>
          )}
          <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              fullWidth
              sx={{ mt: 2 }}
          >
            Регистрация
          </Button>
          {successMessage && (
              <Typography variant="body2" color="success.main" sx={{ mt: 2, textAlign: 'center' }}>
                {successMessage}
              </Typography>
          )}
          <Button
              variant="outlined"
              color="inherit"
              onClick={onBackToLogin}
              fullWidth
              sx={{ mt: 2 }}
          >
            Назад към вход
          </Button>
        </Paper>
      </Box>
  );
};

export default Registration;
