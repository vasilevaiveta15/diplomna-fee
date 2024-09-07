import React, { useEffect, useState } from 'react';
import './SubjectSelector.css';

const SubjectSelector = ({ term, cls, selectedSubjects, onSelect }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/be/e-journal/all-subjects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Неуспешно получаване на предмети');
        }

        const data = await response.json();
        setSubjects(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <div>Зареждане...</div>;
  }

  if (error) {
    return <div>Грешка: {error}</div>;
  }

  return (
      <div className="term-container">
        <h4>Срок {term}:</h4>
        <div className="subject-buttons">
          {subjects.map(subject => (
              <button
                  key={subject.id}
                  type="button"
                  onClick={() => onSelect(subject.id, term)}
                  className={`subject-button ${selectedSubjects.has(`${cls}-${term}-${subject.id}`) ? 'selected' : ''}`}
              >
                {subject.name}
              </button>
          ))}
        </div>
      </div>
  );
};

export default SubjectSelector;
