import React, { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Column, Patient } from '../../interfaces';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import SectionDivider from '../../components/SectionDivider';
import { AuxDataExpand, PersonalDataExpand, TextExpand } from './styles';
import { useNavigate } from 'react-router-dom';

type PatientsTableProps = {
  patients: Patient[];
  count: number;
  columns: Column[];
};

const PatientsTable = ({
  patients,
  columns,
  count,
}: PatientsTableProps): JSX.Element => {
  const [open, setOpen] = useState<string>('');
  const navigate = useNavigate();

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
          stickyHeader
        >
          <TableHead>
            <TableRow sx={{ height: 10 }}>
              <TableCell />
              {columns.map((column) => (
                <TableCell sx={{ height: 10 }} key={column.id}>
                  {column.label}
                  {column.tooltip}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ minHeight: '100%', flexGrow: 1 }}>
            {patients.slice(0 * 10, 0 * 10 + 10).map((row) => {
              return (
                <React.Fragment key={row.id}>
                  <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() =>
                          open === row.id ? setOpen('') : setOpen(row.id)
                        }
                      >
                        {open === row.id ? <BsChevronUp /> : <BsChevronDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      {!row.CPF && row.liable ? row.liable.CPF : row.CPF}
                    </TableCell>
                    <TableCell align="left">{row.birthDate}</TableCell>
                    <TableCell align="left">{row.contactNumber}</TableCell>
                    <TableCell align="left">
                      <IconButton
                        onClick={() =>
                          navigate(`/patients/form/${row.id}`, { state: row })
                        }
                      >
                        <MdModeEdit />
                      </IconButton>
                      <IconButton>
                        <MdDelete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={open === row.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <SectionDivider fontSize={14}>
                            Dados pessoais
                          </SectionDivider>
                          <PersonalDataExpand>
                            <TextExpand>
                              <span>Nome: </span>
                              {row.name}
                            </TextExpand>
                            <TextExpand>
                              <span>Email: </span>
                              {row.email}
                            </TextExpand>
                            <TextExpand>
                              <span>CPF: </span>
                              {row.CPF}
                            </TextExpand>
                            <TextExpand>
                              <span>Estado civil: </span>
                              {row.maritalStatus}
                            </TextExpand>
                            <TextExpand>
                              <span>Data de nascimento: </span>
                              {row.birthDate}
                            </TextExpand>
                            <TextExpand>
                              <span>Gênero: </span>
                              {row.gender}
                            </TextExpand>
                          </PersonalDataExpand>
                          {row.address && (
                            <>
                              <SectionDivider fontSize={14}>
                                Dados auxiliares
                              </SectionDivider>
                              <AuxDataExpand>
                                <TextExpand>
                                  <span>Cidade: </span>
                                  {row.address.city}
                                </TextExpand>
                                <TextExpand>
                                  <span>Bairro: </span>
                                  {row.address.district}
                                </TextExpand>
                                <TextExpand>
                                  <span>Estado: </span>
                                  {row.address.state}
                                </TextExpand>
                                <TextExpand>
                                  <span>Logradouro: </span>
                                  {row.address.publicArea}
                                </TextExpand>
                                <TextExpand>
                                  <span>CEP: </span>
                                  {row.address.zipCode}
                                </TextExpand>
                                <TextExpand>
                                  <span>Telefone: </span>
                                  {row.contactNumber}
                                </TextExpand>
                              </AuxDataExpand>
                            </>
                          )}

                          {row.liable && (
                            <>
                              <SectionDivider fontSize={14}>
                                Dados do responsável
                              </SectionDivider>
                              <PersonalDataExpand>
                                <TextExpand>
                                  <span>Nome: </span>
                                  {row.liable.name}
                                </TextExpand>
                                <TextExpand>
                                  <span>Email: </span>
                                  {row.liable.email}
                                </TextExpand>
                                <TextExpand>
                                  <span>CPF: </span>
                                  {row.liable.CPF}
                                </TextExpand>
                                <TextExpand>
                                  <span>Data de nascimento: </span>
                                  {row.liable.birthDate}
                                </TextExpand>
                              </PersonalDataExpand>
                            </>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ overflow: 'hidden', minHeight: 60 }}
        rowsPerPageOptions={[]}
        component="div"
        count={count}
        rowsPerPage={10}
        page={0}
        onPageChange={() => 1}
        onRowsPerPageChange={() => 0}
      />
    </Paper>
  );
};

export default PatientsTable;
