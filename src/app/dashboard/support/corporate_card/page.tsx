import * as React from 'react';
import type { Metadata } from 'next';
import Typography from '@mui/material/Typography';

import { config } from '@/config';

export const metadata = { title: `Admin | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
      <div>
        <Typography variant="h4">corporate_card</Typography>
      </div>
 
  );
}
