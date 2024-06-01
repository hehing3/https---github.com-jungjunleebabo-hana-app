import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import CodeAdmin from '@/components/dashboard/admin/code-admin';

export const metadata = { title: `기준정보 | 공통코드 | ${config.site.name}` } satisfies Metadata;
/*
async function getCodeAdminList(code_nm: string) {
  return await (
    await fetch(`http://localhost:8080/cmm/MasterSelectMap?CODE_NM=${code_nm}`, { cache: 'no-store' })
  ).json();
}
async function getCodeAdminDetailList(code_id: string) {
  return await (
    await fetch(`http://localhost:8080/cmm/DetailSelectMap?CODE_ID=${code_id}`, { cache: 'no-store' })
  ).json();
}
*/
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  //const codeAdminMaster = await getCodeAdminList(query);
  return <CodeAdmin query={query} />;
}
