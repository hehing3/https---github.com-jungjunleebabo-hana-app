'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { useDebouncedCallback } from 'use-debounce';
import { ProgramAdminDialog } from './program_admin_dialog'; // 새로운 파일에서 Dialog 컴포넌트 import

export function ProgramAdminFilters({ placeholder }: { placeholder: string }): React.JSX.Element {
  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


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

  const handleSubmit = (email: string) => {
    console.log(email);
    // 여기에서 이메일을 처리할 수 있습니다.
  };

  
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        endAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon
              fontSize="var(--icon-fontSize-md)"
              onClick={handleClickOpen}
              className="search-icon" // 클래스 추가필요
            />
          </InputAdornment>
        }
        sx={{ maxWidth: '200px' }}
      />

      {/* Dialog 컴포넌트 include */}
      <ProgramAdminDialog open={open} onClose={handleClose} onSubmit={handleSubmit} />



      <OutlinedInput
        fullWidth
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        sx={{ maxWidth: '300px', marginLeft: '10px', backgroundColor: 'rgba(128, 128, 128, 0.2)', }}
        readOnly 
      />
    </Card>
  );
}

