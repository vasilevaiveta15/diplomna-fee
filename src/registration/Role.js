import React, { useEffect, useState } from 'react';
import AdminPanel from './AdminPanel';
import Student from './Student';
import Teacher from './Teacher';
import LoadingSpinner from './LoadingSpinner'; // Импортирайте LoadingSpinner

const Role = ({ token, onLogout }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // Извикване на API-то за получаване на ролята
        const response = await fetch('http://localhost:8080/api/be/e-journal/role', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Неуспешно получаване на роля');
        }

        const roleData = await response.text(); // Получаване на отговор като текст
        console.log("User role text:", roleData); // Проверете получената роля

        // Проверка на ролята
        const userRole = roleData.replace('ROLE_', '') || 'USER';
        setRole(userRole.toUpperCase());
      } catch (error) {
        console.error('Грешка при получаване на роля:', error);
        setError('Грешка при получаване на роля');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [token]);

  if (loading) {
    return <LoadingSpinner />; // Показване на спинера при зареждане
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {role === 'ADMIN' && <AdminPanel onLogout={onLogout} />}
      {role === 'STUDENT' && <Student onLogout={onLogout} />}
      {role === 'TEACHER' && <Teacher onLogout={onLogout} />}
      {role !== 'ADMIN' && role !== 'STUDENT' && role !== 'TEACHER' && (
        <div>Не разполагате с достъп до тази част на приложението.</div>
      )}
    </div>
  );
};

export default Role;
