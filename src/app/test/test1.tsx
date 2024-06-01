'use client';

import * as React from 'react';
import error from 'next/error';
import useSWR from 'swr';

import { UserAdmin } from '@/types/user-admin';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Page() {
  const { data, error } = useSWR<UserAdmin[], error>(`/admin/UserListMap`, fetcher);

  // ... 로딩 및 에러 상태를 처리
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>loading</div>;

  return data.map((item: UserAdmin, index) => <div key={item.authgroup_id + '' + index}>{item.authgroup_nm}</div>);
}

export default function TestCom(): React.JSX.Element {
  return (
    <>
      <div>SWR</div>
      <Page />
    </>
  );
}
