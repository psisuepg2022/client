import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { ItemList } from '@interfaces/ItemList';
import { FormEmployee, Employee, UpdateEmployee } from '@models/Employee';

type ListProps = {
  page?: number;
  size?: number;
  composed?: string;
};

type EmployeesContextData = {
  list: (listProps: ListProps) => Promise<Response<ItemList<Employee>>>;
  create: (employee: FormEmployee) => Promise<Response<Employee>>;
  remove: (employeeId: string) => Promise<Response<boolean>>;
  getProfile: () => Promise<Response<Employee>>;
  updateProfile: (employee: UpdateEmployee) => Promise<Response<Employee>>;
  employees: Employee[];
  count: number;
};

type EmployeesProviderProps = {
  children: React.ReactElement;
};

const EmployeesContext = createContext<EmployeesContextData>(
  {} as EmployeesContextData
);

export const EmployeesProvider: React.FC<EmployeesProviderProps> = ({
  children,
}: EmployeesProviderProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [count, setCount] = useState<number>(0);

  const list = async ({
    size,
    page,
    composed,
  }: ListProps): Promise<Response<ItemList<Employee>>> => {
    const { data }: { data: Response<ItemList<Employee>> } = await api.post(
      (page as number) >= 0 && size
        ? `employee/search?page=${page}&size=${size}`
        : 'employee/search',
      {
        composed,
      }
    );

    setEmployees(data.content?.items as Employee[]);
    setCount(data.content?.totalItems || 0);

    return data;
  };

  const create = async (
    employee: FormEmployee
  ): Promise<Response<Employee>> => {
    const { data }: { data: Response<Employee> } = await api.post('employee', {
      ...employee,
    });

    return data;
  };

  const remove = async (employeeId: string): Promise<Response<boolean>> => {
    const { data }: { data: Response<boolean> } = await api.delete(
      `employee/${employeeId}`
    );

    return data;
  };

  const getProfile = async (): Promise<Response<Employee>> => {
    const { data }: { data: Response<Employee> } = await api.get(
      'employee/profile'
    );

    return data;
  };

  const updateProfile = async (
    employee: UpdateEmployee
  ): Promise<Response<Employee>> => {
    const { data }: { data: Response<Employee> } = await api.put('employee', {
      ...employee,
    });

    return data;
  };

  return (
    <EmployeesContext.Provider
      value={{
        list,
        create,
        remove,
        getProfile,
        updateProfile,
        employees,
        count,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = (): EmployeesContextData => {
  const context = useContext(EmployeesContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
