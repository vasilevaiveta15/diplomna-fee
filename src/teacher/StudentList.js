import React, { useState, useEffect } from 'react';
import './StudentList.css'; // Импортиране на CSS файла за стилизация

const StudentList = ({ onEditGrade, onBack }) => {
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/be/e-journal/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          throw new Error('Неуспешно зареждане на списъка с ученици');
        }
      } catch (error) {
        console.error('Грешка при зареждане на списъка с ученици:', error);
      }
    };

    fetchStudents();
  }, []);

  // Групиране на предмети по година и срок
  const groupSubjects = (subjects) => {
    const grouped = {};

    subjects.forEach(subject => {
      const year = subject.year;
      const term = subject.term;

      if (!grouped[year]) {
        grouped[year] = { 1: {}, 2: {} }; // Инициализиране на година с два срока
      }

      if (!grouped[year][term][subject.name]) {
        grouped[year][term][subject.name] = [];
      }

      grouped[year][term][subject.name].push({
        grade: subject.grade,
        gradeId: subject.gradeId,
      });
    });

    return grouped;
  };

  // Функция за обработка на клик върху бутон с оценка
  const handleGradeClick = (studentId, subjectName, year, term, gradeId) => {
    setSelectedGrade({ studentId, subjectName, year, term, gradeId });
    onEditGrade({ studentId, subjectName, year, term, gradeId });
  };

  return (
      <div className="students-container">
        {students.map(student => {
          const groupedSubjects = groupSubjects(student.subjects);

          return (
              <div key={student.id} className="student-details">
                {/* Информация за ученика */}
                <div className="student-info">
                  <p><strong>Име:</strong> {student.name}</p>
                  <p><strong>Фамилия:</strong> {student.lastName}</p>
                  <p><strong>Номер на ученик:</strong> {student.id}</p>
                  <p><strong>Група:</strong> {student.group}</p>
                  <p><strong>Клас:</strong> {student.clas}</p>
                </div>

                {/* Таблици с оценки за всеки срок и година */}
                {Object.keys(groupedSubjects).map(year => (
                    <div key={year} className="year-table">
                      <h3>Година: {year}</h3>
                      {Object.keys(groupedSubjects[year]).map(term => (
                          <div key={term} className="term-table">
                            <h4>{term === '1' ? '1ви Срок' : '2ри Срок'}</h4>
                            <table className="grades-table">
                              <thead>
                              <tr>
                                <th>Предмет</th>
                                <th>Оценки</th>
                              </tr>
                              </thead>
                              <tbody>
                              {Object.keys(groupedSubjects[year][term]).length > 0
                                  ? Object.keys(groupedSubjects[year][term]).map((subjectName, index) => (
                                      <tr key={index}>
                                        <td>{subjectName}</td>
                                        <td>
                                          {groupedSubjects[year][term][subjectName].length > 0
                                              ? groupedSubjects[year][term][subjectName].map((subject, gradeIndex) => (
                                                  subject.grade !== null ? (
                                                      <button
                                                          key={gradeIndex}
                                                          onClick={() => handleGradeClick(
                                                              student.id,
                                                              subjectName,
                                                              year,
                                                              term,
                                                              subject.gradeId
                                                          )}
                                                          className="grade-button"
                                                      >
                                                        {subject.grade}
                                                      </button>
                                                  ) : (
                                                      <span key={gradeIndex}>Все още няма въведени оценки</span>
                                                  )
                                              ))
                                              : <span>Все още няма въведени оценки</span>}
                                        </td>
                                      </tr>
                                  ))
                                  : (
                                      <tr>
                                        <td colSpan="2">Няма данни за {term === '1' ? '1ви Срок' : '2ри Срок'}</td>
                                      </tr>
                                  )}
                              </tbody>
                            </table>
                          </div>
                      ))}
                    </div>
                ))}
              </div>
          );
        })}
        <button onClick={onBack} className="back-button">Назад</button>
        {selectedGrade && (
            <button onClick={() => onEditGrade(selectedGrade)} className="edit-grade-button">Редактиране на оценка</button>
        )}
      </div>
  );
};

export default StudentList;
