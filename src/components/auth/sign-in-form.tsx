'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  id: zod.string().min(1, { message: 'id is required' }),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { id: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const users = [
    { id: 'select', password: '', name: '계정을 선택하세요.' },
    { id: 'W10030103', password: '0504', name: '박덕진' },
    { id: 'W11061501', password: '7001', name: '유희남' },
    { id: 'D23050301', password: '1234', name: '현종일' },
  ] as const;

  const router = useRouter();

  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    setValue,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [selectedUserId, setSelectedUserId] = React.useState<string>('');

  const handleLoginChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const selectedUserId = event.target.value as string;
    setSelectedUserId(selectedUserId);

    const selectedUser = users.find((user) => user.id === selectedUserId);
    if (selectedUser) {
      setValue('id', selectedUser.id);
      setValue('password', selectedUser.password);
    }
  };

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      const { error } = await authClient.signInWithPassword(values);
      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Bridge Works.</Typography>
        <Typography variant="subtitle1">Bridge Works 시스템에 오신걸 환영합니다.</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <FormControl error={Boolean(errors.id)}>
                <InputLabel>Id</InputLabel>
                <OutlinedInput
                  {...field}
                  //value={id}
                  //onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
                  label="ID name"
                />
                {errors.id ? <FormHelperText>{errors.id.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {/*
          <Grid md={6} xs={12}>
            <FormControl fullWidth required>
              <InputLabel>ID</InputLabel>
              <OutlinedInput
                label="ID name"
                value={id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
              />
            </FormControl>
          </Grid>
          */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  //value={password}
                  //onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Grid md={6} xs={12}>
            <FormControl fullWidth>
              <InputLabel>Users</InputLabel>
              <Select defaultValue="select" label="Users" name="Users" variant="outlined" onChange={handleLoginChange}>
                {users.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>

          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
      <Alert color="warning">
        Use{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          kodero@naver.com
        </Typography>{' '}
        with password{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          i dont know
        </Typography>
      </Alert>
    </Stack>
  );
}
