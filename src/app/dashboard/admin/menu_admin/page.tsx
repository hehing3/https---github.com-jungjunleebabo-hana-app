import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { MenuAdminLayout }  from '@/components/dashboard/admin/menu-admin';

export const metadata = { title: `기준정보 | 메뉴관리 | ${config.site.name}` } satisfies Metadata;


export default function Page(): React.JSX.Element {
  return <MenuAdminLayout />;
}
