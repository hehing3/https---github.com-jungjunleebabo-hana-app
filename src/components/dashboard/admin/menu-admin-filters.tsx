'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import InputLabel from '@mui/material/InputLabel'; 
import Select from '@mui/material/Select'; 
import MenuItem from '@mui/material/MenuItem'; 
import { useDebouncedCallback } from 'use-debounce';

export function MenuAdminFilters({ placeholder }: { placeholder: string }): React.JSX.Element {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Card sx={{ p: 2 }}>
      <CardActions>
      <InputLabel id="system-label">시스템 구분</InputLabel>
      <Select
        fullWidth
        labelId="system-label"
        value={searchParams.get('query')?.toString() || ''}
        onChange={(e) => {
          handleSearch(e.target.value as string);
        }}
        sx={{ maxWidth: '300px' }}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value="system01">SYSTEM 01</MenuItem>
        <MenuItem value="system02">SYSTEM 02</MenuItem>
      </Select>
    </CardActions>
  </Card>
  );
}
