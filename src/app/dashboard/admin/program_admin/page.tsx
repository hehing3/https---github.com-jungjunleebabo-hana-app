import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import ProgramAdmin from '@/components/dashboard/admin/program-admin';
export const metadata = { title: `기준정보 | 프로그램 관리 | ${config.site.name}` } satisfies Metadata;

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  return <ProgramAdmin query={query} />;
}


