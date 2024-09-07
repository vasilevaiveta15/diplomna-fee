import React, { useState, useEffect } from 'react';
import './TeacherProfile.css'; // Импортирайте CSS файла за стилизация

const TeacherProfile = ({ onBack }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/be/e-journal/teacher-profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          throw new Error('Неуспешно зареждане на профила на учителя');
        }
      } catch (error) {
        console.error('Грешка при зареждане на профила на учителя:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Зареждане...</div>;

  return (
      <div className="profile-container">
        <h2>Моят профил</h2>
        <div className="profile-box">
          <p>Моят номер: {profile.id}</p>
          <p>Имейл: {profile.email}</p>
          <p>Име: {profile.firstName}</p>
          <p>Фамилия: {profile.lastName}</p>
          <p>Роля: Учител</p>
          <p>Номер на предмет: {profile.subjectId}</p>
          <p>Преподава по предмет: {profile.subjectName} - {profile.term} срок</p>
        </div>
        <button onClick={onBack} className="back-button">Назад</button>
      </div>
  );
};

export default TeacherProfile;
