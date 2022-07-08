import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Column, Patient } from '../../types';

type PatientsTableProps = {
  patients: Patient[];
  columns: Column[];
};

const PatientsTable = ({
  patients,
  columns,
}: PatientsTableProps): JSX.Element => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={{ height: '100%' }}>
          <Table
            sx={{ minWidth: 750, height: '100%' }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{ minHeight: '100%', flexGrow: 1 }}>
              {patients
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.birthdate}</TableCell>
                      <TableCell>{row.CPF}</TableCell>
                      <TableCell>{row.maritalStatus}</TableCell>
                      <TableCell>{row.sex}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={patients.length}
          rowsPerPage={25}
          page={0}
          onPageChange={() => 1}
          onRowsPerPageChange={() => 0}
        />
      </Paper>
    </Box>
  );
};

export default PatientsTable;
