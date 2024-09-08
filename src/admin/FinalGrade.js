import React, { useState } from 'react';
import './css/FinalGrade.css'; // Импортиране на CSS файл

const FinalGrade = ({ onBack }) => {
    const [subjectId, setSubjectId] = useState('');
    const [userId, setUserId] = useState('');
    const [finalGrade, setFinalGrade] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/be/e-journal/final-grade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Формат на заявката
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: new URLSearchParams({
                    subjectId,
                    userId,
                    finalGrade
                }),
            });

            if (!response.ok) {
                throw new Error('Неуспешно добавяне на срочна оценка');
            }

            alert('Срочната оценка беше добавена успешно!');
            setSubjectId('');
            setUserId('');
            setFinalGrade('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="final-grade-container">
            <h2>Добавяне на срочна оценка</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="subjectId">Номер на предмет:</label>
                    <input
                        type="number"
                        id="subjectId"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userId">Номер на ученик:</label>
                    <input
                        type="number"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="finalGrade">Срочна оценка:</label>
                    <input
                        type="number"
                        id="finalGrade"
                        value={finalGrade}
                        onChange={(e) => setFinalGrade(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Добави срочна оценка</button>
                <button type="button" className="back-button" onClick={onBack}>Назад</button>
            </form>
        </div>
    );
};

export default FinalGrade;
