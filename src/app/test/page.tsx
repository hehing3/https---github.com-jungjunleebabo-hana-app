import * as React from 'react';
import type { GetStaticProps, InferGetStaticPropsType, Metadata } from 'next';
import Typography from '@mui/material/Typography';
import useSWR, { SWRConfig } from 'swr';

import { config } from '@/config';

import TestCom from './test1';

export const metadata = { title: `test | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <TestCom />;
}
