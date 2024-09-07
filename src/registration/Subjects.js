import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Box } from '@mui/material';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    setLoading(true);
    setError(null);
     fetch('http://localhost:8080/api/be/e-journal/all-subjects', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, //trqva da go podavam na vseki red v koito
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => setSubjects(data))
    .catch((error) => setError(error.message))
    .finally(() => setLoading(false));
  }, [token]); // Добавете токена като зависимост

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Subjects List
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject Name</TableCell>
              <TableCell align="right">Term</TableCell>
              <TableCell align="right">Year</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell component="th" scope="row">
                  {subject.name}
                </TableCell>
                <TableCell align="right">{subject.term}</TableCell>
                <TableCell align="right">{subject.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Subjects;
