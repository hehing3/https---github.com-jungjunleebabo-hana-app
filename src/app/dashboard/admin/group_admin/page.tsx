import * as React from 'react';
import type { Metadata } from 'next';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { GroupAdminLayout } from '@/components/dashboard/admin/group-admin';

export const metadata = { title: `공통코드 | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <GroupAdminLayout />;
}
