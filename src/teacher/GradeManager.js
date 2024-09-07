import React, { useState } from 'react';
import StudentList from './StudentList';
import EditGrade from './EditGrade';
import TeacherMenu from './TeacherMenu'; // Импортиране на TeacherMenu

const GradeManager = ({ students }) => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [view, setView] = useState('studentList'); // Промяна на началното виждане на менюто

    const handleEditGrade = (grade) => {
        setSelectedGrade(grade);
        setView('editGrade');
    };

    const handleBackToMenu = () => {
        setView('menu');
    };

    const handleBackToStudentList = () => {
        setView('studentList');
    };

    return (
        <div>
            {view === 'menu' && (
                <TeacherMenu
                    onProfile={() => {}}
                    onStudents={() => setView('studentList')}
                    onAddGrade={() => {}}
                    onLogout={() => {}}
                />
            )}
            {view === 'studentList' && (
                <StudentList
                    students={students}
                    onEditGrade={handleEditGrade}
                    onBack={handleBackToMenu} // Връща към менюто
                />
            )}
            {view === 'editGrade' && (
                <EditGrade
                    selectedGrade={selectedGrade}
                    onBack={handleBackToStudentList} // Връща към списъка с ученици
                />
            )}
        </div>
    );
};

export default GradeManager;
