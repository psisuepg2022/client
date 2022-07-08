import React from 'react';
import {
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
    <Paper
      sx={{
        width: '100%',
        flexGrow: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="patientsTable"
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
  );
};

export default PatientsTable;
