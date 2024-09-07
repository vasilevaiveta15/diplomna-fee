import React, { useState } from 'react';
import './css/StudentRegistration.css';
import SubjectSelector from './components/SubjectSelector';

const StudentRegistration = ({ onBack }) => {
  const [selectedSubjects, setSelectedSubjects] = useState(new Map());
  const [currentClass, setCurrentClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatedPassword: '',
    myClas: '',
    group: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubjectToggle = (subjectId, term) => {
    setSelectedSubjects(prevSelectedSubjects => {
      const updatedSubjects = new Map(prevSelectedSubjects);
      if (updatedSubjects.has(subjectId)) {
        updatedSubjects.delete(subjectId);
      } else {
        updatedSubjects.set(subjectId, term);
      }
      return updatedSubjects;
    });
  };

  const handleAddClass = () => {
    if (currentClass) {
      setClasses(prevClasses => {
        const newClass = parseInt(prevClasses[prevClasses.length - 1]) + 1;
        return [...prevClasses, newClass];
      });
      setCurrentClass('');
      setFormData(prevFormData => ({
        ...prevFormData,
        myClas: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, repeatedPassword, myClas, group } = formData;

    if (password !== repeatedPassword) {
      alert('Паролите не съвпадат');
      return;
    }

    try {
      // Преобразуване на избраните предмети в необходимия формат
      const subjects = [];
      classes.forEach(cls => {
        const term1Subjects = [...selectedSubjects.entries()].filter(([id, term]) => term === 1).map(([id]) => id);
        const term2Subjects = [...selectedSubjects.entries()].filter(([id, term]) => term === 2).map(([id]) => id);
        subjects.push({
          classs: cls,
          subjects: {
            ...Object.fromEntries(term1Subjects.map(id => [id, 1])),
            ...Object.fromEntries(term2Subjects.map(id => [id, 2]))
          }
        });
      });

      const response = await fetch('http://localhost:8080/api/be/e-journal/user/reg/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          repeatedPassword,
          role: 'STUDENT',
          myClas,
          group,
          requestSubj: subjects,
        }),
      });

      if (response.status === 201) {
        alert('Успешно създадохте ученически профил.');
        if (typeof onBack === 'function') {
          onBack();
        }
      } else {
        console.error('Неуспешна регистрация:', response.status);
        throw new Error('Неуспешна регистрация на ученик');
      }
    } catch (error) {
      console.error('Грешка при регистрация:', error);
      alert('Грешка при регистрация. Моля, опитайте отново.');
    }
  };

  return (
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-content">
          <h2>Регистрация на Ученик</h2>
          <div>
            <label>Име:</label>
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Фамилия:</label>
            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Имейл:</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Парола:</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Повторете Парола:</label>
            <input
                type="password"
                name="repeatedPassword"
                value={formData.repeatedPassword}
                onChange={handleChange}
                required
            />
          </div>
          <div>
            <label>Клас:</label>
            <input
                type="text"
                name="myClas"
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value)}
                required
            />
            <button type="button" className="btn-next-class" onClick={handleAddClass}>
              Следващ клас
            </button>
          </div>
          <div className="subject-selector">
            {classes.map((cls, index) => (
                <div key={index} className="class-section">
                  {index === 0 ? null : <h3>Клас {cls}:</h3>}
                  <SubjectSelector
                      term={1}
                      selectedSubjects={selectedSubjects}
                      onSelect={handleSubjectToggle}
                  />
                  <SubjectSelector
                      term={2}
                      selectedSubjects={selectedSubjects}
                      onSelect={handleSubjectToggle}
                  />
                </div>
            ))}
          </div>
          <button type="submit" className="submit-button">Регистрирай</button>
          <button type="button" onClick={onBack} className="back-button">Назад</button>
        </form>
      </div>
  );
};

export default StudentRegistration;
