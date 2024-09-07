import React, { useState } from 'react';

const StudentDetailsPopup = ({ student, onClose }) => {
  const [grade, setGrade] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddGrade = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/be/e-journal/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          studentId: student.id,
          grade,
        }),
      });

      if (response.status === 201) {
        alert('Успешно добавена оценка');
        onClose();
      } else {
        throw new Error('Неуспешно добавяне на оценка');
      }
    } catch (error) {
      console.error('Грешка при добавяне на оценка:', error);
      alert('Грешка при добавяне на оценка. Моля, опитайте отново.');
    }
  };

  const handleEditGrade = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/be/e-journal/grade', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          studentId: student.id,
          grade,
        }),
      });

      if (response.status === 201) {
        alert('Успешно редактирана оценка');
        onClose();
      } else {
        throw new Error('Неуспешно редактиране на оценка');
      }
    } catch (error) {
      console.error('Грешка при редактиране на оценка:', error);
      alert('Грешка при редактиране на оценка. Моля, опитайте отново.');
    }
  };

  return (
    <div className="popup">
      <h2>Добави/Редактирай оценка за {student.firstName} {student.lastName}</h2>
      <input
        type="text"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        placeholder="Въведете оценка"
      />
      <button onClick={isEditing ? handleEditGrade : handleAddGrade}>
        {isEditing ? 'Редактирай оценка' : 'Добави оценка'}
      </button>
      <button onClick={onClose}>Назад</button>
    </div>
  );
};

export default StudentDetailsPopup;
