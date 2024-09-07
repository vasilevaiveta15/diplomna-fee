import React from 'react';
import './TeacherMenu.css'; // Импортиране на CSS файла за стилизация

const TeacherMenu = ({ onProfile, onStudents, onAddGrade, onEditGrade, onLogout }) => {
    return (
        <div className="menu-container">
            <h2>Меню на учителя</h2>
            <button onClick={onProfile}>Моят профил</button>
            <button onClick={onStudents}>Ученици</button>
            <button onClick={onAddGrade}>Добавяне на оценка</button>
        </div>
    );
};

export default TeacherMenu;
