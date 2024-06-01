'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import Typography from '@mui/material/Typography';

import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];


interface LoginForm {
  username: string;
  password: string;
  email: string;
}

export function SampleGrid(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onChange",
  });

  const onValid = (data: LoginForm) => {
    console.log("im valid @@@@");
  };

  const onInvalid = (errors: any) => {
    console.log(errors);
  };

  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });
  

  return (
    <><form onSubmit={handleSubmit(onValid, onInvalid)}> {/* Correct usage of onSubmit */}
      <input
        {...register("username", { required: true })}
        type="text"
        placeholder="Username" />
      {errors.username && <span>{errors.username.message}</span>} {/* Field-specific error handling */}

      <input
        {...register("email")}
        type="email"
        placeholder="Email" />

      <input
        {...register("password")}
        type="password"
        placeholder="Password" />

      <input type="submit" value="Create Account" />
    </form>

      <div>
        <Typography >Recent Deposits</Typography >
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
        {...data}
        initialState={{
          ...data.initialState,
          sorting: {
            ...data.initialState?.sorting,
            sortModel: [
              {
                field: 'rating',
                sort: 'desc',
              },
            ],
          },
        }}
      />
    </div>
      
      </div></>
  );
}
