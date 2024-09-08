import React, { useState, useEffect } from 'react';
import './Student.css'; // Импортиране на CSS файла за стилизация

const Student = ({ onLogout }) => {
  const [groupedGrades, setGroupedGrades] = useState({});
  const [myClass, setMyClass] = useState(null); // Променлива за текущия клас

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/be/e-journal/grades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load grades');
        }

        const data = await response.json();

        // Извличане на текущия клас от отговора на сървиса
        const currentClass = data.length > 0 ? data[0].myClass : null;
        setMyClass(currentClass);

        // Групиране на оценките по години (класове), срокове и предмети
        const grouped = data.reduce((acc, grade) => {
          const { term, name, grade: gradeValue, finalGrade, classs } = grade;

          if (!acc[classs]) {
            acc[classs] = { term1: {}, term2: {} };
          }

          const termKey = `term${term}`;

          if (!acc[classs][termKey][name]) {
            acc[classs][termKey][name] = {
              name,
              grades: [],
              finalGrade: null,
            };
          }

          acc[classs][termKey][name].grades.push(gradeValue);
          acc[classs][termKey][name].finalGrade = finalGrade;

          return acc;
        }, {});

        setGroupedGrades(grouped);

      } catch (error) {
        alert(error.message);
      }
    };

    fetchGrades();
  }, []);

  // Изчисляване на среден успех за срок
  const calculateAverage = (subjects) => {
    const finalGrades = subjects.map(subject => subject.finalGrade).filter(grade => grade !== null);
    if (finalGrades.length === 0) return null;
    const sum = finalGrades.reduce((total, grade) => total + grade, 0);
    return (sum / finalGrades.length).toFixed(2);
  };

  return (
      <div className="student-container">
        <h2>Добре дошъл, студент!</h2>
        <button onClick={onLogout} className="logout-button">Изход</button>
        <div className="grades-container">
          {Object.keys(groupedGrades).sort().map((classs) => {
            const { term1, term2 } = groupedGrades[classs];

            const hasFirstTerm = Object.keys(term1).length > 0;
            const hasSecondTerm = Object.keys(term2).length > 0;

            // Определяме дали текущият клас е този, в който се намираме
            const isCurrentClass = myClass && parseInt(myClass) === parseInt(classs);

            const term1Average = calculateAverage(Object.values(term1));
            const term2Average = calculateAverage(Object.values(term2));
            const yearlyAverage = (term1Average && term2Average)
                ? ((parseFloat(term1Average) + parseFloat(term2Average)) / 2).toFixed(2)
                : null;

            return (
                <div key={classs} className={`year-container ${isCurrentClass ? 'highlight-current-class' : ''}`}>
                  <h3>
                    Клас: {classs}
                  </h3>

                  {/* Първи срок */}
                  {hasFirstTerm ? (
                      <>
                        <h4>Срок 1</h4>
                        <table className="grades-table">
                          <thead>
                          <tr>
                            <th>Предмет</th>
                            <th>Оценки</th>
                            <th>Срочна оценка</th>
                          </tr>
                          </thead>
                          <tbody>
                          {Object.values(term1).map((subject, index) => (
                              <tr key={index}>
                                <td>{subject.name}</td>
                                <td>{subject.grades.join(', ')}</td>
                                <td>{subject.finalGrade || '-'}</td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                        <div className="average-grade">
                          Средна оценка за Срок 1: {term1Average || 'Все още няма въведена оценка'}
                        </div>
                      </>
                  ) : (
                      <div className="no-grade-message">
                        Крайна срочна оценка за 1ви Срок: Няма срочна оценка
                      </div>
                  )}

                  {/* Втори срок */}
                  {hasSecondTerm ? (
                      <>
                        <h4>Срок 2</h4>
                        <table className="grades-table">
                          <thead>
                          <tr>
                            <th>Предмет</th>
                            <th>Оценки</th>
                            <th>Срочна оценка</th>
                          </tr>
                          </thead>
                          <tbody>
                          {Object.values(term2).map((subject, index) => (
                              <tr key={index}>
                                <td>{subject.name}</td>
                                <td>{subject.grades.join(', ')}</td>
                                <td>{subject.finalGrade || '-'}</td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                        <div className="average-grade">
                          Средна оценка за Срок 2: {term2Average || 'Все още няма въведена оценка'}
                        </div>
                      </>
                  ) : (
                      <div className="no-grade-message">
                        Крайна срочна оценка за 2ри Срок: Няма срочна оценка
                      </div>
                  )}

                  {/* Годишен успех */}
                  <div className="yearly-grade">
                    <p>
                      Годишна Оценка: {yearlyAverage || 'Все още няма годишна оценка'}
                    </p>
                  </div>
                </div>
            );
          })}
        </div>
      </div>
  );
};

export default Student;
