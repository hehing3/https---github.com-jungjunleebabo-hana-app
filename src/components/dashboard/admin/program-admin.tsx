'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowsClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { FloppyDiskBack as SaveIcon } from '@phosphor-icons/react/dist/ssr/FloppyDiskBack';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import axios from 'axios';

import { ProgramAdmin } from '@/types/program-admin';
import { useButtonStore } from '@/contexts/authbutton-context';
import { ProgramAdminFilters } from '@/components/dashboard/admin/program-admin-filters';
import { ProgramAdminGrid } from '@/components/dashboard/admin/program-admin-grid';

export default function ProgramAdminTag({ query }: { query: string }): React.JSX.Element {
  const { saveClick } = useButtonStore((state) => state);
  const [cnt, setCnt] = React.useState<number>(0);
  const [programAdminMaster, setProgramAdminMaster] = React.useState<ProgramAdmin[]>([]); // 예시 데이터
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const reLoadPage = () => {
    const params = new URLSearchParams(searchParams);
    if (params.get('query') != null) {
      params.delete('query');
      replace(`${pathname}?${params.toString()}`);
    } else {
      getProgramAdminList('');
    }
  };

  const reLoad = () => {
    getProgramAdminList(query);
  };

  async function getProgramAdminList(query: string | undefined): Promise<{ error?: string }> {
    const result = await (await axios.get(`/admin/ProgramSelectMap?PGM_ID=${query}`)).data;

    if (result.resultCode === 'OK') {
      setProgramAdminMaster(result.data);
      setCnt((n) => n + 1);
    } else {
      return { error: 'Invalid credentials' };
    }
    return {};
  }
  React.useEffect(() => {
    getProgramAdminList(query);
  }, [query]);

  return (
    <Stack spacing={3} sx={{ position: 'relative', top: '0px' }}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">프로그램 관리</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button startIcon={<SaveIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={saveClick}>
            Save
          </Button>
          <Button
            startIcon={<RefreshIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={reLoadPage}
          >
            refresh
          </Button>
        </Stack>
      </Stack>
      <React.Suspense key={query + '' + cnt} fallback="">
        <ProgramAdminFilters placeholder="Program" />
        <ProgramAdminGrid initialRows={programAdminMaster} reLoad={reLoad} />
      </React.Suspense>
    </Stack>
  );
}
