import React, { useState } from 'react';
import TeacherMenu from './TeacherMenu';
import TeacherProfile from './TeacherProfile';
import AddGrade from './AddGrade';
import EditGrade from './EditGrade';
import StudentList from './StudentList';

const Teacher = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Функции за обработка на навигацията
  const handleProfile = () => setCurrentView('profile');

  const handleStudents = () => setCurrentView('students');

  const handleAddGrade = () => setCurrentView('addGrade');

  const handleEditGrade = () => setCurrentView('editGrade');

  const handleBack = () => setCurrentView('menu');

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    setCurrentView('addGrade');
  };

  const handleEditGradeSelection = (grade) => {
    setSelectedGrade(grade);
    setCurrentView('editGrade');
  };

  return (
      <div>
        {currentView === 'menu' && (
            <TeacherMenu
                onProfile={handleProfile}
                onStudents={handleStudents}
                onAddGrade={handleAddGrade}
                onEditGrade={handleEditGrade}
                onLogout={onLogout}
            />
        )}
        {currentView === 'profile' && <TeacherProfile onBack={handleBack} />}
        {currentView === 'students' && (
            <StudentList
                onEditGrade={handleEditGradeSelection}
                onBack={handleBack}
            />
        )}
        {currentView === 'addGrade' && (
            <AddGrade
                studentId={selectedStudentId}
                onBack={handleBack}
            />
        )}
        {currentView === 'editGrade' && (
            <EditGrade
                selectedGrade={selectedGrade}
                onBack={handleBack}
            />
        )}
      </div>
  );
};

export default Teacher;
