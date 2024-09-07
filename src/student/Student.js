import React, { useState, useEffect } from 'react';
import './Student.css'; // Импортирайте CSS файла за стилизация

const Student = ({ onLogout }) => {
  const [groupedGrades, setGroupedGrades] = useState({});

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

        // Групиране на оценките по години, срокове и предмети
        const grouped = data.reduce((acc, grade) => {
          const { year, term, name, grade: gradeValue, finalGrade } = grade;

          if (!acc[year]) {
            acc[year] = { term1: {}, term2: {} };
          }

          const termKey = `term${term}`;

          if (!acc[year][termKey][name]) {
            acc[year][termKey][name] = {
              name,
              grades: [],
              finalGrade: null,
            };
          }

          acc[year][termKey][name].grades.push(gradeValue);
          acc[year][termKey][name].finalGrade = finalGrade;

          return acc;
        }, {});

        setGroupedGrades(grouped);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchGrades();
  }, []);

  const calculateAverage = (grades) => {
    const sum = grades.reduce((total, grade) => total + (grade.finalGrade || 0), 0);
    return (sum / grades.length).toFixed(2);
  };

  return (
      <div className="student-container">
        <h2>Добре дошъл, студент!</h2>
        <button onClick={onLogout} className="logout-button">Изход</button>
        <div className="grades-container">
          {Object.keys(groupedGrades).sort((a, b) => a - b).map((year) => {
            const { term1, term2 } = groupedGrades[year];

            const hasFirstTerm = Object.keys(term1).length > 0;

            if (!hasFirstTerm) return null; // Пропускаме годината, ако няма данни за 1ви срок

            return (
                <div key={year} className="year-container">
                  <h3>{year}</h3>

                  {/* Първи срок */}
                  {hasFirstTerm && (
                      <>
                        <h4>Първи срок</h4>
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
                          Средна оценка: {calculateAverage(Object.values(term1))}
                        </div>
                      </>
                  )}

                  {/* Втори срок */}
                  {Object.keys(term2).length > 0 && (
                      <>
                        <h4>Втори срок</h4>
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
                          Средна оценка: {calculateAverage(Object.values(term2))}
                        </div>
                      </>
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );
};

export default Student;
