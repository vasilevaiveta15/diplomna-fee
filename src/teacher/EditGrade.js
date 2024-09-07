import React, { useState } from 'react';
import './EditGrade.css'; // Импортиране на CSS файла за стилизация

const EditGrade = ({ selectedGrade, onBack }) => {
  const [newGrade, setNewGrade] = useState('');

  const handleGradeChange = (e) => {
    setNewGrade(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/be/e-journal/grade', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          studentId: selectedGrade.studentId,
          grade: newGrade,
          subjectId: selectedGrade.subjectId,
          gradeId: selectedGrade.gradeId,
        }),
      });

      if (response.ok) {
        alert('Оценката е успешно променена!');
        onBack(); // Връща към списъка с ученици
      } else {
        throw new Error('Неуспешно обновяване на оценката');
      }
    } catch (error) {
      console.error('Грешка при обновяване на оценката:', error);
    }
  };

  return (
      <div className="form-wrapperr">
        <div className="form-containerr">
          <h2>Рефакториране на оценка</h2>
          <label>Номер на ученик:</label>
          <input type="text" value={selectedGrade.studentId} disabled />
          <label>Номер на оценка:</label>
          <input type="text" value={selectedGrade.gradeId} disabled />
          <label>Нова оценка:</label>
          <input type="text" value={newGrade} onChange={handleGradeChange} />
          <button onClick={handleSave}>Промени оценка</button>
          <button onClick={onBack} className="back-button">Назад</button>
        </div>
      </div>
  );
};

export default EditGrade;
