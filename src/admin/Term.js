import React, { useState } from 'react';

const Term = ({ onBack }) => {
  const [subjects, setSubjects] = useState([
    { name: '', term: '', year: '' }, // Премахване на полето "grade"
  ]);

  const handleInputChange = (index, event) => {
    const newSubjects = [...subjects];
    newSubjects[index][event.target.name] = event.target.value;
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', term: '', year: '' }]); // Премахване на полето "grade"
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleSaveSubjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/be/e-journal/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ subject: subjects }),
      });
      if (!response.ok) {
        throw new Error('Failed to save subjects');
      }
      alert('Предметите са успешно записани!');
      if (onBack) onBack(); // Връщане в менюто на админа след успешно записване
    } catch (error) {
      alert(error.message);
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.title}>Създаване на срокове и предмети</h1>
        <div style={styles.subjectList}>
          {subjects.map((subject, index) => (
              <div key={index} style={styles.subjectBox}>
                <h2 style={styles.subjectTitle}>Предмет</h2>
                <input
                    type="text"
                    name="name"
                    value={subject.name}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Име"
                    style={styles.input}
                />
                <input
                    type="text"
                    name="term"
                    value={subject.term}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Срок"
                    style={styles.input}
                />
                <input
                    type="text"
                    name="year"
                    value={subject.year}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Година"
                    style={styles.input}
                />
                <button
                    onClick={() => handleRemoveSubject(index)}
                    style={styles.removeButton}
                >
                  Изтрий
                </button>
              </div>
          ))}
        </div>
        <button
            onClick={handleAddSubject}
            style={styles.addButton}
        >
          Добави предмет
        </button>
        <button
            onClick={handleSaveSubjects}
            style={styles.saveButton}
        >
          Запази предмети
        </button>
        <button
            onClick={onBack}
            style={styles.backButton}
        >
          Назад
        </button>
      </div>
  );
};

// Основен стилов обект
const styles = {
  container: {
    backgroundColor: '#004080',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
  },
  title: {
    marginBottom: '20px',
  },
  subjectList: {
    width: '100%',
  },
  subjectBox: {
    backgroundColor: '#003366',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
    position: 'relative',
  },
  subjectTitle: {
    marginBottom: '10px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    color: '#000',
  },
  removeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '10px',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '10px',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #ffffff',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '10px',
  },
};

export default Term;
