'use client';

import * as React from 'react';
import { revalidatePath } from 'next/cache';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowsClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { FloppyDiskBack as SaveIcon } from '@phosphor-icons/react/dist/ssr/FloppyDiskBack';
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import axios from 'axios';
import dayjs from 'dayjs';

import { CodeAdmin } from '@/types/code-admin';
import { config } from '@/config';
import { useButtonStore } from '@/contexts/authbutton-context';
import { CommonBtn } from '@/components/auth/commonButton';
import { CodeAdminFilters } from '@/components/dashboard/admin/code-admin-filters';
import { CodeAdminGrid } from '@/components/dashboard/admin/code-admin-grid';

export default function CodeAdminTag({ query }: { query: string }): React.JSX.Element {
  const { state, initClick } = useButtonStore((state) => state);
  const [cnt, setCnt] = React.useState<number>(0);
  const [codeAdminMaster, setCodeAdminMaster] = React.useState<CodeAdmin[]>([]); // 예시 데이터
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const reLoadPage = () => {
    const params = new URLSearchParams(searchParams);
    if (params.get('query') != null) {
      params.delete('query');
      replace(`${pathname}?${params.toString()}`);
    } else {
      getCodeAdminList('');
    }
  };

  const reLoad = () => {
    getCodeAdminList(query);
  };

  const getCodeAdminList = async (query: string | undefined) => {
    const result = await (await axios.get(`/cmm/MasterSelectMap?CODE_NM=${query}`)).data;
    setCodeAdminMaster(result);
    setCnt((n) => n + 1);
  };
  React.useEffect(() => {
    getCodeAdminList(query);
  }, [query]);

  React.useEffect(() => {
    if (state === 'search') {
      getCodeAdminList(query);
    }
    console.log('ssss' + state);
    initClick();
  }, [state]);
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">공통코드</Typography>
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
          <CommonBtn />

          {/*
          <Button
            startIcon={<RefreshIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={reLoadPage}
          >
            refresh
          </Button>
           */}
        </Stack>
      </Stack>
      <React.Suspense key={query + '' + cnt} fallback="">
        <CodeAdminFilters placeholder="Search [코드그룹 or 코드그룹명]" />
        <CodeAdminGrid initialRows={codeAdminMaster} reLoad={reLoad} />
        {/* <CodeAdminTable count={codeAdminMaster.length} rows={codeAdminMaster} />  */}
      </React.Suspense>
    </Stack>
  );
}
