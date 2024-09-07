import React, { useEffect, useState } from 'react';
import './SubjectSelector.css'; // Добавете необходимите стилове тук

const SubjectSelector = ({ term, selectedSubjects, onSelect }) => {
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

  // Филтриране на предметите по срок
  const filteredSubjects = subjects.filter(subject => subject.term === term);

  return (
      <div className="subject-buttons">
        {filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => (
                <button
                    key={subject.id}
                    type="button"
                    onClick={() => onSelect(subject.id)}
                    className={`subject-button ${selectedSubjects.includes(subject.id) ? 'selected' : ''}`}
                >
                  {subject.name}
                </button>
            ))
        ) : (
            <p>Няма предмети за избраният срок.</p>
        )}
      </div>
  );
};

export default SubjectSelector;
