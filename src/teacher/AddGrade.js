import React, { useState, useEffect } from 'react';
import './AddGrade.css'; // Импортиране на CSS файла за стилизация

const AddGrade = ({ onBack }) => {
  const [studentId, setStudentId] = useState('');
  const [grade, setGrade] = useState('');
  const [subjectId, setSubjectId] = useState(null);
  const [term, setTerm] = useState('1'); // Дефинираме състоянието за срока (по подразбиране "1")

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/be/e-journal/teacher-profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubjectId(data.subjectId);
        } else {
          throw new Error('Неуспешно зареждане на профила на учителя');
        }
      } catch (error) {
        console.error('Грешка при зареждане на профила на учителя:', error);
      }
    };

    fetchTeacherProfile();
  }, []);

  const handleAddGrade = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/be/e-journal/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          studentId,
          grade,
          subjectId,
          term, // Добавяме избраната стойност на срока към заявката
        }),
      });

      if (response.ok) {
        alert('Успешно добавена оценка');
        onBack();
      } else {
        throw new Error('Неуспешно добавяне на оценка');
      }
    } catch (error) {
      console.error('Грешка при добавяне на оценка:', error);
      alert('Грешка при добавяне на оценка. Моля, опитайте отново.');
    }
  };

  return (
      <div className="form-wrapperrr">
        <div className="form-containerrr">
          <h2>Добавяне на оценка</h2>
          <label>
            Номер на ученик:
            <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
            />
          </label>
          <label>
            Оценка:
            <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
            />
          </label>

          {/* Добавяне на бутон за избор на срок */}
          <label>
            Срок:
            <select value={term} onChange={(e) => setTerm(e.target.value)}>
              <option value="1">1ви Срок</option>
              <option value="2">2ри Срок</option>
            </select>
          </label>

          <button onClick={handleAddGrade}>Добави оценка</button>
          <button onClick={onBack} className="back-button">Назад</button>
        </div>
      </div>
  );
};

export default AddGrade;
