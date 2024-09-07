import React, { useState } from 'react';
import Login from './main/Login';
import Registration from './registration/Registration';
import AdminMenu from './admin/AdminMenu';
import Header from './Header';
import Student from './student/Student'; // Импортирайте компонента Student
import Teacher from './teacher/Teacher'; // Импортирайте компонента Teacher

function App() {
  const [token, setToken] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [role, setRole] = useState(null);

  const handleLogin = (token, role) => {
    setToken(token);
    setRole(role);
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
  };

  return (
    <div className="App">
      <Header isLoggedIn={!!token} onLogout={handleLogout} />
      {!token && !showRegistration && (
        <Login onLogin={handleLogin} onShowRegistration={handleShowRegistration} />
      )}
      {showRegistration && <Registration onBackToLogin={handleBackToLogin} />}
      {token && role === 'ADMIN' && <AdminMenu />}
      {token && role === 'STUDENT' && <Student onLogout={handleLogout} />}
      {token && role === 'TEACHER' && <Teacher onLogout={handleLogout} />} {/* Добавете Teacher компонент за ролята TEACHER */}
    </div>
  );
}

export default App;
