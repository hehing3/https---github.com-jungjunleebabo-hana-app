'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { ArrowsClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import axios from 'axios';

import { UserAdmin } from '@/types/user-admin';
import { useButtonStore } from '@/contexts/authbutton-context';
import { CommonBtn } from '@/components/auth/commonButton';

import { UserAdminDetailForm } from './user-admin-detail';
import { UserAdminTable } from './user-admin-table';

const newRow: UserAdmin = {
  user_id: 'NEW',
  user_name: '',
  user_org_cd: '',
  user_job_cd: '',
  user_email: '',
  user_cellphone_first: '',
  user_cellphone_middle: '',
  user_cellphone_last: '',
  user_phone_first: '',
  user_phone_middle: '',
  user_phone_last: '',
  description: '',
  user_served_yn: '',
  authgroup_id: '',
  authgroup_nm: '',
  system_cd: '001',
  row_flag: 'N',
};

export function UserAdminLayout({ rows }: { rows: UserAdmin[] }): React.JSX.Element {
  const { state, initClick } = useButtonStore((state) => state);

  const [adminList, setAdminList] = React.useState<UserAdmin[]>(rows);
  const [selectRow, setSelectRow] = React.useState<UserAdmin>(rows[0]);
  const [selectId, setSelectId] = React.useState<string>(rows[0].user_id);
  const pathname = usePathname();
  const router = useRouter();
  const setRowClick = (id: string) => {
    setSelectRow(adminList.filter((row: UserAdmin) => row.user_id === id)[0]);
    setSelectId(id);
    // initClick();
  };

  //사용자정보 변경할때마다 값 수정하기
  const setRowValueChange = (row: UserAdmin) => {
    if (selectId === 'NEW' && row.row_flag === 'D') {
      setAdminList(adminList.filter((user) => user.row_flag !== 'N'));
      setRowClick(adminList[0].user_id);
    } else {
      const newData = adminList.map((item) => {
        // 변경할 아이템의 ID와 일치하는 경우 새로운 이름으로 업데이트
        if (item.user_id === selectId || (selectId === 'NEW' && item.row_flag === 'N')) {
          return row;
        }
        // 변경할 아이템이 아닌 경우 기존 아이템 반환
        return item;
      });

      setAdminList(newData);
    }
  };

  React.useEffect(() => {
    if (state === 'insert') {
      if (adminList.filter((r) => r.row_flag === 'N').length === 0) {
        setAdminList((oldRows) => [...oldRows, newRow]);
        initClick();
      }
      setSelectRow(newRow);
      setSelectId(newRow.user_id);
    }
  }, [state]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">사용자관리</Typography>
          {/*
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
              </Button>
            </Stack>
         */}
        </Stack>
        <div>
          <Stack direction="row" spacing={1}>
            <CommonBtn />
          </Stack>
        </div>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <UserAdminTable rows={adminList} rowClick={setRowClick} selectId={selectId} setSelectId={setSelectId} />
        </Grid>
        <Grid md={6} xs={12}>
          <UserAdminDetailForm selectRow={selectRow} setRowValueChange={setRowValueChange} />
        </Grid>
      </Stack>
    </Stack>
  );
}
