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
            <TableRow sx={{ height: 10 }}>
              {columns.map((column) => (
                <TableCell sx={{ height: 10 }} key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ minHeight: '100%', flexGrow: 1 }}>
            {patients.slice(0 * 12, 0 * 12 + 12).map((row) => {
              return (
                <TableRow sx={{ height: 10 }} hover key={row.id}>
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
        rowsPerPage={12}
        page={0}
        onPageChange={() => 1}
        onRowsPerPageChange={() => 0}
      />
    </Paper>
  );
};

export default PatientsTable;
