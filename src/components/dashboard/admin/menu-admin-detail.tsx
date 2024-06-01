'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import axios from 'axios';

import { MenuProps } from '@/types/nav';
import { ComCode, commonClient } from '@/lib/cmm/info';
import { useButtonStore } from '@/contexts/authbutton-context';
import { useUser } from '@/hooks/use-user';

const states = [
  { value: 'PAGE', label: 'PAGE' },
  { value: 'FOLDER', label: 'FOLDER' },
] as const;

const groups = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'SALES', label: 'SALES' },
  { value: 'REPORT', label: 'REPORT' },
  { value: 'SUPPORT', label: 'SUPPORT' },
  { value: 'DEV', label: 'DEV' },
  { value: 'TECH', label: 'TECH' },
];

export function MenuAdminDetailForm({ selectRow }: { selectRow: MenuProps }) {
  console.log('selectRow     ' + selectRow);
  console.log(JSON.stringify(selectRow));

  const { state, initClick } = useButtonStore((state) => state);
  const router = useRouter();
  const userId = useUser().user?.user_id;
  const [selOrg, setSelOrg] = React.useState<ComCode[]>();
  const [selJob, setSelJob] = React.useState<ComCode[]>();

  const [newValues, setNewValues] = React.useState<MenuProps>(selectRow);

  //공통코드정보 조회
  const setSelectInfo = async () => {
    const { data, error } = await commonClient.getCommonCode('G_00000010,G_00000009');

    if (error != null) {
      console.log('error', error);
    }

    if (data != null) {
      setSelOrg(data.filter((row: ComCode) => row.parent_id === 'G_00000009'));
      setSelJob(data.filter((row: ComCode) => row.parent_id === 'G_00000010'));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValues((newValues) => ({ ...newValues, [event.target.name]: event.target.value }));
  };

  const handleSetChange = (key: string, value: string) => {
    setNewValues((newValues) => ({ ...newValues, [key]: value }));
  };

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValues((newValues) => ({ ...newValues, [event.target.name]: event.target.checked ? '1' : '0' }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setNewValues((newValues) => ({ ...newValues, [event.target.name]: event.target.value }));
  };

  // 초기값 설정
  const setSelectRowInfo = () => {
    setNewValues({
      menuId: selectRow.menuId,
      menuType: selectRow.menuType,
      menuDesc: selectRow.menuDesc ?? '',
      menuLevel: selectRow.menuLevel ?? '',
      property: selectRow.property ?? '',
      printYn: selectRow.printYn ?? '',
      prifix: selectRow.prifix ?? '',
      excelYn: selectRow.excelYn ?? '',
      chk: selectRow.chk ?? '',
      upMenuId: selectRow.upMenuId ?? '',
      useYn: selectRow.useYn ?? '',
      systemCd: selectRow.systemCd ?? '',
      pgmId: selectRow.pgmId ?? '',
      programUrl: selectRow.programUrl ?? '',
      sortSeq: selectRow.sortSeq ?? '',
      searchYn: selectRow.searchYn ?? '',
      saveYn: selectRow.saveYn ?? '',
      menuName: selectRow.menuName ?? '',
      inputYn: selectRow.inputYn ?? '',
      deleteYn: selectRow.deleteYn ?? '',
    });
  };

  const saveUserAdmin = async (updateRow: MenuProps) => {
    const codeAdminRow = { ...updateRow, row_type: 'U', login_user: userId };

    await axios
      .post('/admin/SaveUserAdmin', null, {
        params: {
          data: JSON.stringify(codeAdminRow),
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          alert('저장완료');
          router.push('/dashboard/admin/user_admin');
          router.refresh();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (state === 'insert') {
      initClick();
    }
  }, [state]);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // console.log(JSON.stringify(newValues, null, 2));
          saveUserAdmin(newValues);
        }}
      >
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={12} xs={12} sx={{ height: '60px' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>메뉴아이디</InputLabel>
                  <OutlinedInput value={newValues.menuId} label="메뉴아이디" name="menuId" onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid md={12} xs={12} sx={{ height: '60px' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>메뉴명</InputLabel>
                  <OutlinedInput value={newValues.menuName} label="메뉴명" name="menuName" onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid md={12} xs={12} sx={{ height: '60px' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>메뉴설명</InputLabel>
                  <OutlinedInput value={''} label="메뉴설명" name="menuIdid" onChange={handleChange} />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ my: 0, mx: 0 }} />

          <Grid md={12} xs={12} sx={{ height: '60px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>화면구분</InputLabel>
              <Select defaultValue="PAGE" label="PAGE" name="PAGE" variant="outlined">
                {states.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sx={{ height: '60px', display: 'flex', alignItems: 'center' }}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth size="small" sx={{ width: '180px' }}>
                <InputLabel>프로그램ID</InputLabel>
                <Select defaultValue="PAGE" label="PAGE" name="PAGE" sx={{ width: '180px' }}>
                  {groups.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ width: '20px', border: '0px solid' }}>
                <IconButton aria-label="search">
                  <SearchIcon />
                </IconButton>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ width: '220px' }}>
                <InputLabel>프로그램명</InputLabel>
                <OutlinedInput value={newValues.pgmId} label="프로그램명" name="pgmId" onChange={handleChange} />
              </FormControl>
            </Stack>
          </Grid>

          <Grid md={12} xs={12} sx={{ height: '60px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>프로그램경로</InputLabel>
              <OutlinedInput
                value={newValues.programUrl}
                label="프로그램경로"
                name="programUrl"
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Divider sx={{ my: 0, mx: 0 }} />

          <Grid md={12} xs={12} sx={{ height: '60px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>상위메뉴</InputLabel>
              <Select defaultValue="PAGE" label="PAGE" name="PAGE" variant="outlined">
                {states.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sx={{ height: '60px', display: 'flex', alignItems: 'center' }}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth size="small" sx={{ width: '210px' }}>
                <InputLabel>메뉴레벨</InputLabel>
                <OutlinedInput value={newValues.menuLevel} label="메뉴레벨" name="menuLevel" onChange={handleChange} />
              </FormControl>

              <FormControl fullWidth size="small" sx={{ width: '210px' }}>
                <InputLabel>정렬순서</InputLabel>
                <OutlinedInput value={newValues.sortSeq} label="정렬순서" name="sortSeq" onChange={handleChange} />
              </FormControl>
            </Stack>
          </Grid>

          <Divider sx={{ my: 0, mx: 0 }} />

          <Grid container md={12} xs={12} sx={{ height: '60px' }} alignItems="center">
            <Grid item sx={{ marginRight: '8px', paddingLeft: '10px' }}>
              <InputLabel>사용여부</InputLabel>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="useYn"
                    //  checked={newValues.user_served_yn === '1' ? true : false}
                    //  onChange={handleCheckBoxChange}
                  />
                }
                label=""
              />
            </Grid>
          </Grid>

          <Grid md={12} xs={12} sx={{ height: '60px' }}>
            <FormControl fullWidth size="small">
              <InputLabel>아이콘</InputLabel>
              <Select defaultValue="PAGE" label="PAGE" name="PAGE" variant="outlined">
                {states.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Card>
      </form>
    </>
  );
}
