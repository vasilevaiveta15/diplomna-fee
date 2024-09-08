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

  // Групиране на предмети по клас и срок
  const groupSubjectsByClassAndTerm = (subjects) => {
    const grouped = {};

    subjects.forEach(subject => {
      const classs = subject.classs;
      const term = subject.term;

      if (!grouped[classs]) {
        grouped[classs] = { 1: {}, 2: {} }; // Инициализиране на клас с два срока
      }

      if (!grouped[classs][term][subject.name]) {
        grouped[classs][term][subject.name] = [];
      }

      grouped[classs][term][subject.name].push({
        grade: subject.grade,
        finalGrade: subject.finalGrade, // Добавяме финална срочна оценка
        gradeId: subject.gradeId,
      });
    });

    return grouped;
  };

  // Изчисляване на крайна срочна оценка за всички предмети
  const calculateOverallTermGrade = (subjects) => {
    const finalGrades = [];
    Object.values(subjects).forEach(subjectArr => {
      subjectArr.forEach(subject => {
        if (subject.finalGrade !== null) {
          finalGrades.push(subject.finalGrade);
        }
      });
    });

    if (finalGrades.length === 0) return null;
    const sum = finalGrades.reduce((acc, grade) => acc + grade, 0);
    return (sum / finalGrades.length).toFixed(2);
  };

  // Функция за обработка на клик върху бутон с оценка
  const handleGradeClick = (studentId, subjectName, classs, term, gradeId) => {
    setSelectedGrade({ studentId, subjectName, classs, term, gradeId });
    onEditGrade({ studentId, subjectName, classs, term, gradeId });
  };

  return (
      <div className="students-container">
        {students
            .sort((a, b) => a.classs - b.classs) // Сортираме учениците по клас
            .map(student => {
              const groupedSubjects = groupSubjectsByClassAndTerm(student.subjects);

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

                    {/* Таблици с оценки за всеки срок и клас */}
                    {Object.keys(groupedSubjects).map(classs => {
                      const subjectsForClass = groupedSubjects[classs];
                      const finalGradeTerm1 = calculateOverallTermGrade(subjectsForClass[1]) || 'Няма срочна оценка';
                      const finalGradeTerm2 = calculateOverallTermGrade(subjectsForClass[2]) || 'Няма срочна оценка';
                      const yearlyGrade = finalGradeTerm1 !== 'Няма срочна оценка' && finalGradeTerm2 !== 'Няма срочна оценка'
                          ? ((parseFloat(finalGradeTerm1) + parseFloat(finalGradeTerm2)) / 2).toFixed(2)
                          : 'Няма годишна оценка';

                      return (
                          <div key={classs} className="class-table">
                            <h3>Клас: {classs}</h3>

                            {/* Таблица за 1ви срок */}
                            <div className="term-table">
                              <h4>1ви Срок</h4>
                              <table className="grades-table">
                                <thead>
                                <tr>
                                  <th>Предмет</th>
                                  <th>Оценки</th>
                                  <th>Срочна оценка</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.keys(subjectsForClass[1]).length > 0
                                    ? Object.keys(subjectsForClass[1]).map((subjectName, index) => (
                                        <tr key={index}>
                                          <td>{subjectName}</td>
                                          <td>
                                            {subjectsForClass[1][subjectName].length > 0
                                                ? subjectsForClass[1][subjectName].map((subject, gradeIndex) => (
                                                    subject.grade !== null ? (
                                                        <button
                                                            key={gradeIndex}
                                                            onClick={() =>
                                                                handleGradeClick(student.id, subjectName, classs, 1, subject.gradeId)
                                                            }
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
                                          <td>
                                            {subjectsForClass[1][subjectName][0].finalGrade || 'Няма срочна оценка'}
                                          </td>
                                        </tr>
                                    ))
                                    : (
                                        <tr>
                                          <td colSpan="3">Няма данни за 1ви Срок</td>
                                        </tr>
                                    )}
                                </tbody>
                              </table>
                              <div className="final-grade">
                                <p>Крайна срочна оценка за 1ви Срок: {finalGradeTerm1}</p>
                              </div>
                            </div>

                            {/* Таблица за 2ри срок */}
                            <div className="term-table">
                              <h4>2ри Срок</h4>
                              <table className="grades-table">
                                <thead>
                                <tr>
                                  <th>Предмет</th>
                                  <th>Оценки</th>
                                  <th>Срочна оценка</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.keys(subjectsForClass[2]).length > 0
                                    ? Object.keys(subjectsForClass[2]).map((subjectName, index) => (
                                        <tr key={index}>
                                          <td>{subjectName}</td>
                                          <td>
                                            {subjectsForClass[2][subjectName].length > 0
                                                ? subjectsForClass[2][subjectName].map((subject, gradeIndex) => (
                                                    subject.grade !== null ? (
                                                        <button
                                                            key={gradeIndex}
                                                            onClick={() =>
                                                                handleGradeClick(student.id, subjectName, classs, 2, subject.gradeId)
                                                            }
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
                                          <td>
                                            {subjectsForClass[2][subjectName][0].finalGrade || 'Няма срочна оценка'}
                                          </td>
                                        </tr>
                                    ))
                                    : (
                                        <tr>
                                          <td colSpan="3">Няма данни за 2ри Срок</td>
                                        </tr>
                                    )}
                                </tbody>
                              </table>
                              <div className="final-grade">
                                <p>Крайна срочна оценка за 2ри Срок: {finalGradeTerm2}</p>
                              </div>
                            </div>

                            {/* Годишен успех */}
                            <div className="yearly-grade">
                              <p>Годишна Оценка: {yearlyGrade}</p>
                            </div>
                          </div>
                      );
                    })}
                  </div>
              );
            })}
        <button onClick={onBack} className="back-button">Назад</button>
      </div>
  );
};

export default StudentList;
