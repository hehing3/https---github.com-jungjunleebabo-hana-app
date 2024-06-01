import * as React from 'react';
import type { Metadata } from 'next';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { Button, Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { UserAdminLayout } from '@/components/dashboard/admin/user-admin';

export const metadata = { title: `사용자관리 | ${config.site.name}` } satisfies Metadata;

async function getUserAdminDetailList() {
  /*
  const jsonData = await (await fetch(`http://localhost:3000/dashboard/admin/user_admin/api`)).json();
  return jsonData.data;
 */

  return await (await fetch(`${config.site.serverUrl}/admin/UserListMap`, { next: { tags: ['user_admin'] } })).json();
}

export default async function Page({ searchParams }: { searchParams: { type: string } }): Promise<React.JSX.Element> {
  if (searchParams.type && searchParams.type === 'refresh') {
    // revalidateTag('user_admin'); //저장할때만 호출하는방법으로 변경해야함
    revalidatePath('/dashboard/admin/user_admin');
    redirect('/dashboard/admin/user_admin');
  }

  const paginatedCustomers = await getUserAdminDetailList();

  return <UserAdminLayout rows={paginatedCustomers} />;
}
