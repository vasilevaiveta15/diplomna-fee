import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import Registration from '../registration/Registration'; // Импортирайте компонента за регистрация
import { LoginContainer, LoginBox } from '../styles/LoginStyles'; // Импортирайте стиловите компоненти
import { login, fetchRole } from '../services/authService'; // Импортирайте функциите за вход и роля

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = async () => {
    setLoginError(null);

    try {
      const token = await login(username, password);
      localStorage.setItem('authToken', token); // Запазване на токена в localStorage
      const role = await fetchRole(token);
      onLogin(token, role);
      setUsername('');
      setPassword('');
    } catch (error) {
      setLoginError('Грешка при влизане, опитайте отново.');
    }
  };

  const handleRegisterClick = () => {
    setShowRegistration(true);
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
  };

  return (
    <LoginContainer style={{ position: 'relative', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box 
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        top="16px"
        width="100%"
        style={{ backgroundColor: '#003366', padding: '10px', color: 'white' }}
      >
        <Typography variant="h4">Електронен дневник</Typography>
      </Box>
      {showRegistration ? (
        <Registration onBackToLogin={handleBackToLogin} />
      ) : (
        <LoginBox style={{ padding: '20px', maxWidth: '400px', width: '100%', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', position: 'relative' }}>
          <TextField
            label="Потребителско име"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Парола"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && (
            <Typography color="error" variant="body2" style={{ marginTop: '8px' }}>
              {loginError}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{ marginTop: '16px' }}
          >
            Вход
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleRegisterClick}
            style={{ position: 'absolute', top: '16px', right: '16px' }} // Позициониране на бутона горе вдясно
          >
            Регистрация
          </Button>
        </LoginBox>
      )}
    </LoginContainer>
  );
};

export default Login;
