import React, { useState } from 'react';
import './css/StudentRegistration.css';
import SubjectSelector from './components/SubjectSelector';

const StudentRegistration = ({ onBack }) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatedPassword: '',
    role: 'STUDENT',
    clas: '',
    group: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prevSelectedSubjects => {
      const isSelected = prevSelectedSubjects.includes(subjectId);
      if (isSelected) {
        return prevSelectedSubjects.filter(id => id !== subjectId);
      } else {
        return [...prevSelectedSubjects, subjectId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, repeatedPassword, clas, group } = formData;

    if (password !== repeatedPassword) {
      alert('Паролите не съвпадат');
      return;
    }

    try {
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
          role: 'STUDENT',
          clas,
          group,
          subjectId: selectedSubjects
        })
      });

      if (response.status === 201) {
        setSuccessMessage('Успешно създадохте ученически профил.');
        setTimeout(() => {
          if (typeof onBack === 'function') {
            onBack();
          } else {
            console.error('onBack не е функция');
          }
        }, 2000);
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
                name="clas"
                value={formData.clas}
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
                required
            />
          </div>

          {/* Subject Selector разделен на Срок 1 и Срок 2 */}
          <div className="subject-selector">
            <h3>Предмети:</h3>
            <div className="term-container">
              <h4>Срок 1</h4>
              <SubjectSelector
                  term={1}
                  selectedSubjects={selectedSubjects}
                  onSelect={handleSubjectToggle}
              />
              <h4>Срок 2</h4>
              <SubjectSelector
                  term={2}
                  selectedSubjects={selectedSubjects}
                  onSelect={handleSubjectToggle}
              />
            </div>
          </div>

          <button type="submit" className="btn-register">Регистрирай ученик</button>
          <button type="button" onClick={onBack} className="btn-back">Назад</button>
        </form>
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
  );
};

export default StudentRegistration;
