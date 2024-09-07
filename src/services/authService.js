// src/services/authService.js

export const login = async (username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  
  try {
    const response = await fetch('http://localhost:8080/api/be/e-journal/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const token = await response.text();
    return token;
  } catch (error) {
    throw error;
  }
};

export const fetchRole = async (token) => {
  try {
    const response = await fetch('http://localhost:8080/api/be/e-journal/role', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch role');
    }

    const role = await response.text();
    return role;
  } catch (error) {
    throw error;
  }
};
