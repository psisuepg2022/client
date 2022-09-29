import React, { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Patient } from '@models/Patient';
import { Column } from './types';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdModeEdit, MdDelete, MdStickyNote2 } from 'react-icons/md';
import SectionDivider from '@components/SectionDivider';
import {
  AuxDataExpand,
  PersonalDataExpand,
  StyledTableCell,
  TextExpand,
} from './styles';
import { useNavigate } from 'react-router-dom';
import { PageSize } from '@global/constants';
import { useAuth } from '@contexts/Auth';

type PatientsTableProps = {
  patients: Patient[];
  count: number;
  columns: Column[];
  page: number;
  setPage: (page: number) => void;
  deleteItem: (patient: Patient) => void;
};

const PatientsTable = ({
  patients,
  columns,
  count,
  page,
  setPage,
  deleteItem,
}: PatientsTableProps): JSX.Element => {
  const {
    user: { permissions },
  } = useAuth();
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
              <StyledTableCell />
              {columns.map((column) => (
                <StyledTableCell sx={{ height: 10 }} key={column.id}>
                  {column.label}
                  {column.tooltip}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ minHeight: '100%', flexGrow: 1 }}>
            {patients.map((row) => {
              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    sx={{
                      '& > *': { borderBottom: 'unset' },
                    }}
                    hover
                  >
                    <StyledTableCell>
                      <Tooltip
                        title={open === row.id ? 'Recolher' : 'Expandir'}
                      >
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() =>
                            open === row.id ? setOpen('') : setOpen(row.id)
                          }
                        >
                          {open === row.id ? (
                            <BsChevronUp />
                          ) : (
                            <BsChevronDown />
                          )}
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {!row.CPF && row.liable ? row.liable.CPF : row.CPF}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.birthDate}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.contactNumber}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {permissions.includes('USER_TYPE_PROFESSIONAL') && (
                        <Tooltip title="Anotações">
                          <IconButton
                            onClick={() =>
                              navigate('/comment/list', {
                                state: row,
                              })
                            }
                          >
                            <MdStickyNote2 />
                          </IconButton>
                        </Tooltip>
                      )}
                      {permissions.includes('UPDATE_PATIENT') && (
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() =>
                              navigate(`/patients/form/${row.id}`, {
                                state: row,
                              })
                            }
                          >
                            <MdModeEdit />
                          </IconButton>
                        </Tooltip>
                      )}
                      {permissions.includes('DELETE_PATIENT') && (
                        <Tooltip title="Deletar">
                          <IconButton onClick={() => deleteItem(row)}>
                            <MdDelete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell
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
                          {!row.address && row.contactNumber && (
                            <>
                              <SectionDivider fontSize={14}>
                                Dados auxiliares
                              </SectionDivider>
                              <AuxDataExpand>
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
                    </StyledTableCell>
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
        rowsPerPage={PageSize}
        page={page}
        onPageChange={(e, page) => setPage(page)}
      />
    </Paper>
  );
};

export default PatientsTable;
