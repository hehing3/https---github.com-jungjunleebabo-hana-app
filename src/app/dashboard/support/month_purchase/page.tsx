import * as React from 'react';
import type { Metadata } from 'next';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { SampleGrid }  from '@/components/dashboard/sample/sample_grid';


export const metadata = { title: `Admin | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <SampleGrid />;
}
