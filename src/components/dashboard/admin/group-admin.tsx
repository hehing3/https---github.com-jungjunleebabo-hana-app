'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { StyledEngineProvider } from '@mui/material/styles';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ArrowsClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { FloppyDiskBack as SaveIcon } from '@phosphor-icons/react/dist/ssr/FloppyDiskBack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import axios from 'axios';

import { MenuProps } from '@/types/nav';
import { AuthGroup, AuthGroupMenu } from '@/types/user-admin';
import { useButtonStore } from '@/contexts/authbutton-context';
import { CommonBtn } from '@/components/auth/commonButton';

import { FrameInputRichTree, FrameRichTree, FrameTree } from './admin-tree';
import { GroupAdminGrid } from './group-admin-grid';

const selSystem = [
  { code_id: '001', code_nm: 'SYSTEM 01' },
  { code_id: '002', code_nm: 'SYSTEM 02' },
] as const;

interface defaultSearchProps {
  selSystem: string;
  txtGroup: string;
}

interface treeMapProps {
  id: string;
  name: string;
}

export function GroupAdminLayout(): React.JSX.Element {
  const { state, initClick } = useButtonStore((state) => state);
  const [searchDs, setSearchDs] = React.useState<defaultSearchProps>({ selSystem: '001', txtGroup: '' });
  const [authGroupList, setAuthGroupList] = React.useState<AuthGroup[]>([]);
  const [frameMenuList, setFrameMenuList] = React.useState<MenuProps[]>([]);
  const [frameGroupMenuList, setFrameGroupMenuList] = React.useState<MenuProps[]>([]);
  const [treeItems, setTreeItems] = React.useState<treeMapProps[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDs((newValues) => ({ ...newValues, [event.target.name]: event.target.value }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSearchDs((newValues) => ({ ...newValues, [event.target.name]: event.target.value }));
  };

  /*
  const setChangeTree = (id: string, value: string) => {
    // const filterItem = treeItems.filter((item) => item.id === id);

    const itemToUpdate = treeItems.find((item) => item.id === id);
    if (itemToUpdate) {
      console.log('itemToUpdate');
      const updatedItems = treeItems.map((item) => (item.id === id ? { ...item, name: value } : item));
      treeItems = updatedItems;
    } else {
      treeItems.push({ id: id, name: value });
    }

    console.log('setChangeTree', JSON.stringify(treeItems) + 'aaa' + treeItems.length);
  };
*/

  const setChangeTree = (id: string, value: string) => {
    //기존 값이 있으면 update 없으면 insert
    setTreeItems((items) => {
      const itemToUpdate = items.find((item) => item.id === id);
      if (itemToUpdate) {
        const updatedItems = items.map((item) => (item.id === id ? { ...item, name: value } : item));
        return updatedItems;
      } else {
        return [...items, { id: id, name: value }];
      }
    });

    /*
    const itemToUpdate = treeItems.find((item) => item.id === id);
    if (itemToUpdate) {
      console.log('itemToUpdate');
      const updatedItems = treeItems.map((item) => (item.id === id ? { ...item, name: value } : item));
      setTreeItems(updatedItems);
    } else {
      setTreeItems((item) => [...item, { id: id, name: value }]);
    }
    */
  };

  // 조회
  const fn_Search = () => {
    if (searchDs.selSystem === '') {
      alert('System을 선택하세요.');
    }
    //grid 데이터 조회
    getGroupAdminList();
    // treeview 데이터 조회
    getFrameMenuList();
  };

  // grid그룹정보 조회
  const getGroupAdminList = async () => {
    const result = await (
      await axios.get(`/admin/GroupListMap?SYSTEM_CD=${searchDs.selSystem}&AUTHGROUP=${searchDs.txtGroup}`)
    ).data;
    setAuthGroupList(result);
  };

  // frameMenu정보 조회
  const getFrameMenuList = async () => {
    const result = await (
      await axios.post('/frame/MenuSelectMap', null, {
        params: { SYSTEM_CD: searchDs.selSystem },
      })
    ).data;
    setFrameMenuList(result);
  };

  // 그룹권한정보 조회
  const getGroupMenuList = async (systemCd: string | undefined, authGroup: string | undefined) => {
    const groupList: AuthGroupMenu[] = await (
      await axios.get(`/admin/GroupMenuListMap?SYSTEM_CD=${systemCd}&AUTHGROUP=${authGroup}`)
    ).data;

    // 메뉴에서 그룹권한정보를 확인하여 chk컬럼 Y,N 설정
    const resultMenuList = frameMenuList.map((item) => {
      const chkYn = groupList.findIndex((group) => group.menu_id === item.menuId) > 0 ? 'Y' : 'N';
      return { ...item, chk: chkYn };
    });
    setFrameGroupMenuList(resultMenuList);
  };

  const setRowClick = (authgroup_id: string) => {
    getGroupMenuList(searchDs.selSystem, authgroup_id);
  };

  const fn_Save = () => {
    //그룹 테이블이랑 treeview저장하기
    console.log(JSON.stringify(treeItems));
  };

  React.useEffect(() => {
    // console.log(state);
    if (state === 'insert') {
    } else if (state === 'save') {
      fn_Save();
    } else if (state === 'search') {
      fn_Search();
    }
    initClick();
  }, [state]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">권한관리</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <CommonBtn />
          {/*
          <Button startIcon={<SaveIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={fn_Save}>
            Save
          </Button>
          <Button
            startIcon={<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            color="success"
            onClick={fn_Search}
          >
            Search
          </Button>
          <Button startIcon={<RefreshIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            refresh
          </Button>
           */}
        </Stack>
      </Stack>
      <Card sx={{ p: 2 }}>
        <Stack direction="row" spacing={3}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="groupadmin-system-label">System</InputLabel>
            <Select
              labelId="groupadmin-system-label"
              label="System"
              name="selSystem"
              variant="outlined"
              onChange={handleSelectChange}
              value={searchDs.selSystem}
            >
              {selSystem &&
                selSystem.map((option) => (
                  <MenuItem key={option.code_id} value={option.code_id}>
                    {option.code_nm}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Group</InputLabel>
            <OutlinedInput
              size="small"
              label="Group"
              name="txtGroup"
              value={searchDs.txtGroup}
              onChange={handleChange}
              /*
              endAdornment={
                <InputAdornment position="end">
                  <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                </InputAdornment>
              }
              */
              sx={{ maxWidth: '300px' }}
            />
          </FormControl>
        </Stack>
      </Card>
      <Stack direction="row" spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <GroupAdminGrid rows={authGroupList} setRows={setAuthGroupList} setRowClick={setRowClick} />
        </Grid>
        <Grid md={6} xs={12}>
          <Card sx={{ p: 2, minWidth: '300px', overflowY: 'auto', height: 400 }}>
            <FrameInputRichTree data={frameGroupMenuList} setChangeData={setChangeTree} />
          </Card>
        </Grid>
      </Stack>
    </Stack>
  );
}
