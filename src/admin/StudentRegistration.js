import React, { useState } from 'react';
import './css/StudentRegistration.css';
import SubjectSelector from './components/SubjectSelector';

const StudentRegistration = ({ onBack }) => {
  const [selectedSubjects, setSelectedSubjects] = useState(new Map());
  const [startClass, setStartClass] = useState(1); // Начален клас
  const [classes, setClasses] = useState([1]);  // Започваме от клас 1
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatedPassword: '',
    group: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubjectToggle = (subjectId, term, cls) => {
    setSelectedSubjects(prevSelectedSubjects => {
      const updatedSubjects = new Map(prevSelectedSubjects);
      const key = `${cls}-${term}-${subjectId}`; // Уникален ключ за всеки предмет по клас и срок
      if (updatedSubjects.has(key)) {
        updatedSubjects.delete(key);
      } else {
        updatedSubjects.set(key, { term, class: cls });
      }
      return updatedSubjects;
    });
  };

  const handleAddClass = () => {
    setClasses(prevClasses => {
      const newClass = prevClasses[prevClasses.length - 1] + 1;
      if (newClass <= 12) { // Ограничаваме максималния клас до 12
        return [...prevClasses, newClass];
      }
      return prevClasses;
    });
  };

  const handleStartClassChange = (value) => {
    const newClass = startClass + value;
    if (newClass >= 1 && newClass <= 12) {
      setStartClass(newClass);
      setClasses([newClass]); // Обновяваме класовете спрямо новия начален клас
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, repeatedPassword, group } = formData;

    if (password !== repeatedPassword) {
      alert('Паролите не съвпадат');
      return;
    }

    try {
      const subjectsByClass = new Map();

      selectedSubjects.forEach((value, key) => {
        const { class: cls, term } = value;
        if (!subjectsByClass.has(cls)) {
          subjectsByClass.set(cls, { classs: cls, subjects: {} });
        }
        const classEntry = subjectsByClass.get(cls);
        classEntry.subjects[key.split('-')[2]] = term; // Извличаме предмета от ключа
      });

      const subjects = Array.from(subjectsByClass.values());

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
          myClas: classes.length,
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
            <label>Група:</label>
            <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleChange}
            />
          </div>
          <div>
            <label>Начален клас:</label>
            <div className="class-selector">
              <button type="button" onClick={() => handleStartClassChange(-1)}>-</button>
              <input
                  type="number"
                  value={startClass}
                  min="1"
                  max="12"
                  readOnly
              />
              <button type="button" onClick={() => handleStartClassChange(1)}>+</button>
            </div>
          </div>
          <div>
            <button type="button" className="btn-next-class" onClick={handleAddClass}>
              Следващ клас
            </button>
          </div>
          <div className="subject-selector">
            {classes.map((cls, index) => (
                <div key={index} className="class-section">
                  <h3>Клас {cls}:</h3>
                  <SubjectSelector
                      term={1}
                      cls={cls}
                      selectedSubjects={selectedSubjects}
                      onSelect={(subjectId, term) => handleSubjectToggle(subjectId, term, cls)}
                  />
                  <SubjectSelector
                      term={2}
                      cls={cls}
                      selectedSubjects={selectedSubjects}
                      onSelect={(subjectId, term) => handleSubjectToggle(subjectId, term, cls)}
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
