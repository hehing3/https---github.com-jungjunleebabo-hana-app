'use client';

import * as React from 'react';
import { revalidatePath } from 'next/cache';
import { usePathname, useRouter } from 'next/navigation';
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
import Stack from '@mui/material/Stack';
import { FloppyDiskBack as SaveIcon } from '@phosphor-icons/react/dist/ssr/FloppyDiskBack';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import axios from 'axios';

import { UserAdmin } from '@/types/user-admin';
import { ComCode, commonClient } from '@/lib/cmm/info';
import { useButtonStore } from '@/contexts/authbutton-context';
import { usePopover } from '@/hooks/use-popover';
import { useUser } from '@/hooks/use-user';
import { reLoadPage } from '@/components/util';

import { AuthPopover } from './auth-popover';

const selPhone = [
  { code_id: '02', code_nm: '서울[02]' },
  { code_id: '031', code_nm: '경기[031]' },
  { code_id: '032', code_nm: '인천[032]' },
  { code_id: '033', code_nm: '강원[033]' },
  { code_id: '041', code_nm: '충남[041]' },
  { code_id: '042', code_nm: '대전[042]' },
  { code_id: '043', code_nm: '충북[043]' },
  { code_id: '044', code_nm: '세종[044]' },
  { code_id: '051', code_nm: '부산[051]' },
  { code_id: '052', code_nm: '울산[052]' },
  { code_id: '053', code_nm: '대구[053]' },
  { code_id: '054', code_nm: '경북[054]' },
  { code_id: '055', code_nm: '경남[055]' },
  { code_id: '061', code_nm: '전남[061]' },
  { code_id: '062', code_nm: '광주[062]' },
  { code_id: '063', code_nm: '전북[063]' },
  { code_id: '064', code_nm: '제주[064]' },
];

const selCellPhone = [{ code_id: '010', code_nm: '010' }];

export function UserAdminDetailForm({
  selectRow,
  setRowValueChange,
}: {
  selectRow: UserAdmin;
  setRowValueChange: (row: UserAdmin) => void;
}) {
  const { state, initClick } = useButtonStore((state) => state);
  const router = useRouter();
  const userId = useUser().user?.user_id;
  const [selOrg, setSelOrg] = React.useState<ComCode[]>();
  const [selJob, setSelJob] = React.useState<ComCode[]>();

  const [newValues, setNewValues] = React.useState<UserAdmin>(selectRow);

  const pathname = usePathname();
  const userPopover = usePopover<HTMLDivElement>();

  //공통코드정보 조회
  const setSelectInfo = async () => {
    const { data, error } = await commonClient.getCommonCode('G_00000010,G_00000009');

    if (error != null) {
      console.log('error', error);
    }

    if (data != null) {
      /*
      // default값을 넣을 경우
      const defaultValue: ComCode = { code_id: '', code_nm: '선택해주세요.' };
      const orgFilter = data.filter((row: ComCode) => row.parent_id === 'G_00000009');
      const jobFilter = data.filter((row: ComCode) => row.parent_id === 'G_00000010');

      setSelectOrg([defaultValue, ...orgFilter]);
      setSelectJob([defaultValue, ...jobFilter]);
      */

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
    // const cellPhone = [selectRow.user_cellphone_first, selectRow.user_cellphone_middle, selectRow.user_cellphone_last];
    // const phone = [selectRow.user_phone_first, selectRow.user_phone_middle, selectRow.user_phone_last];
    //setNewValues(selectRow);

    setNewValues({
      user_id: selectRow.user_id,
      user_name: selectRow.user_name,
      user_org_cd: selectRow.user_org_cd ?? '',
      user_job_cd: selectRow.user_job_cd ?? '',
      //cell_phone: cellPhone[0] && cellPhone[1] && cellPhone[2] ? cellPhone.join('-') : cellPhone.join(''),
      //phone: phone[0] && phone[1] && phone[2] ? phone.join('-') : phone.join(''),
      user_cellphone_first: selectRow.user_cellphone_first ?? '',
      user_cellphone_middle: selectRow.user_cellphone_middle ?? '',
      user_cellphone_last: selectRow.user_cellphone_last ?? '',
      user_phone_first: selectRow.user_phone_first ?? '',
      user_phone_middle: selectRow.user_phone_middle ?? '',
      user_phone_last: selectRow.user_phone_last ?? '',
      description: selectRow.description ?? '',
      user_served_yn: selectRow.user_served_yn ?? '',
      user_email: selectRow.user_email ?? '',
      authgroup_id: selectRow.authgroup_id ?? '',
      authgroup_nm: selectRow.authgroup_nm ?? '',
      system_cd: selectRow.system_cd ?? '001',
      row_flag: selectRow.row_flag,
    });
  };

  const deleteRow = async () => {
    //신규 데이터는 화면에서 객체만 제거
    if (newValues.row_flag === 'N') {
      setNewValues((newValues) => ({ ...newValues, ['row_flag']: 'D' }));
    } else {
      saveUserAdmin(newValues, 'D');
    }
  };

  const changeUserPassWord = async () => {
    if (newValues.user_id === 'NEW') {
      alert('ID를 입력하세요.');
      return;
    }

    await axios
      .post('/admin/ChangeUserAdminPassWord', null, {
        params: {
          data: JSON.stringify(newValues),
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          alert('변경완료');
          //replace(`${pathname}?type=refresh`);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveUserAdmin = async (updateRow: UserAdmin, type: string) => {
    if (updateRow.user_id === 'NEW') {
      alert('ID를 입력하세요.');
      return;
    }

    const codeAdminRow = { ...updateRow, row_type: type, login_user: userId };

    await axios
      .post('/admin/SaveUserAdmin', null, {
        params: {
          data: JSON.stringify(codeAdminRow),
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          alert('저장완료');
          router.push(`${pathname}?type=refresh`);
          router.refresh();
          //replace(`${pathname}?type=refresh`);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (!selOrg && !selJob) {
      setSelectInfo();
    }
    setSelectRowInfo();
  }, [selectRow]);

  React.useEffect(() => {
    setRowValueChange(newValues);
  }, [newValues]);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // console.log(JSON.stringify(newValues, null, 2));

          saveUserAdmin(newValues, 'U');
        }}
      >
        <Card>
          <CardHeader subheader="user info" title="사용자정보" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl fullWidth required size="small">
                  <InputLabel>사용자 ID</InputLabel>
                  <OutlinedInput
                    value={newValues.user_id}
                    label="사용자 ID"
                    name="user_id"
                    disabled={newValues.row_flag === 'N' ? false : true}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required size="small">
                  <InputLabel>사용자 명</InputLabel>
                  <OutlinedInput
                    value={newValues.user_name}
                    label="사용자 명"
                    name="user_name"
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button variant="contained" size="small" onClick={changeUserPassWord}>
                  비밀번호 초기화
                </Button>
                {/* 
              <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
                <InputLabel>비밀번호</InputLabel>
                <Button variant="contained" size="small">
                  초기화
                </Button>
              </Stack>
              */}
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>부서</InputLabel>
                  <Select
                    value={newValues.user_org_cd}
                    label="Org"
                    name="user_org_cd"
                    variant="outlined"
                    onChange={handleSelectChange}
                  >
                    {selOrg &&
                      selOrg.map((option) => (
                        <MenuItem key={option.code_id} value={option.code_id}>
                          {option.code_nm}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>직급</InputLabel>
                  <Select
                    value={newValues.user_job_cd}
                    label="Job"
                    name="user_job_cd"
                    variant="outlined"
                    onChange={handleSelectChange}
                  >
                    {selJob &&
                      selJob.map((option) => (
                        <MenuItem key={option.code_id} value={option.code_id}>
                          {option.code_nm}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <Stack direction="row" spacing={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel>핸드폰</InputLabel>
                    <Select
                      value={newValues.user_cellphone_first}
                      label="Phone"
                      name="user_cellphone_first"
                      variant="outlined"
                      onChange={handleSelectChange}
                    >
                      {selCellPhone &&
                        selCellPhone.map((option) => (
                          <MenuItem key={option.code_id} value={option.code_id}>
                            {option.code_nm}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      name="user_cellphone_middle"
                      type="tel"
                      value={newValues.user_cellphone_middle}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      name="user_cellphone_last"
                      type="tel"
                      value={newValues.user_cellphone_last}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item md={6} xs={12}>
                <Stack direction="row" spacing={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel>전화번호</InputLabel>
                    <Select
                      value={newValues.user_phone_first}
                      label="Phone"
                      name="user_phone_first"
                      variant="outlined"
                      onChange={handleSelectChange}
                    >
                      {selPhone &&
                        selPhone.map((option) => (
                          <MenuItem key={option.code_id} value={option.code_id}>
                            {option.code_nm}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      name="user_phone_middle"
                      type="tel"
                      value={newValues.user_phone_middle}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      name="user_phone_last"
                      type="tel"
                      value={newValues.user_phone_last}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={8}>
                <FormControl size="small" fullWidth>
                  <InputLabel>E-Mail</InputLabel>
                  <OutlinedInput
                    value={newValues.user_email}
                    label="E-Mail"
                    name="user_email"
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>비고</InputLabel>
                  <OutlinedInput
                    value={newValues.description}
                    multiline
                    minRows="3"
                    label="비고"
                    name="description"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="user_served_yn"
                      checked={newValues.user_served_yn === '1' ? true : false}
                      onChange={handleCheckBoxChange}
                    />
                  }
                  label="재직여부"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ ml: 3, justifyContent: 'flex-start' }} ref={userPopover.anchorRef}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <Stack spacing={3} direction="row" sx={{ alignItems: 'center' }}>
                  <InputLabel>권한</InputLabel>

                  <OutlinedInput label="Roll" name="authgroup_nm" value={newValues.authgroup_nm} disabled />
                  <Button variant="contained" size="small" onClick={userPopover.handleOpen}>
                    설 정
                  </Button>
                </Stack>
              </FormControl>
            </Grid>
          </CardActions>
          <Divider />
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button
              color="success"
              variant="contained"
              type="submit"
              startIcon={<SaveIcon fontSize="var(--icon-fontSize-md)" />}
            >
              Save
            </Button>
            <Button
              color="secondary"
              variant="contained"
              type="button"
              onClick={deleteRow}
              startIcon={<TrashIcon fontSize="var(--icon-fontSize-md)" />}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </form>
      <AuthPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
        setTextChange={handleSetChange}
      />
    </>
  );
}
