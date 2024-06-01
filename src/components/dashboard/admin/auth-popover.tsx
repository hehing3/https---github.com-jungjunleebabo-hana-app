import * as React from 'react';
import {
  Card,
  Grid,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stack,
  SvgIconProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { TreeItem, TreeItem2, TreeItem2Props } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { MagnifyingGlass as SeacrhIcon } from '@phosphor-icons/react/dist/ssr';
import axios from 'axios';

import type { MenuProps } from '@/types/nav';
import { AuthGroup, AuthGroupMenu } from '@/types/user-admin';
import { useUser } from '@/hooks/use-user';

import { FrameTree } from './admin-tree';

export interface AuthPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
  setTextChange: (key: string, val: string) => void;
}

export function AuthPopover({ anchorEl, onClose, open, setTextChange }: AuthPopoverProps): React.JSX.Element {
  const [authGroupList, setAuthGroupList] = React.useState<AuthGroup[]>([]);
  const [systemCd, setSystemCd] = React.useState<string>('');
  const [authGroup, setAuthGroup] = React.useState<string>('');
  const [rowId, setRowId] = React.useState<string>('');
  const [frameMenuList, setFrameMenuList] = React.useState<MenuProps[]>([]);
  const [frameGroupMenuList, setFrameGroupMenuList] = React.useState<MenuProps[]>([]);
  const { user } = useUser();

  const selSystem = [
    { code: '001', name: 'SYSTEM 01' },
    { code: '002', name: 'SYSTEM 02' },
  ];

  const selOnChange = (e: SelectChangeEvent<string>) => {
    setSystemCd(e.target.value);
  };

  const textOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthGroup(e.target.value);
  };

  const getAuthGroupList = async (systemCd: string | undefined, authGroup: string | undefined) => {
    const result = await (await axios.get(`/admin/GroupListMap?SYSTEM_CD=${systemCd}&AUTHGROUP=${authGroup}`)).data;
    setAuthGroupList(result);
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

  // frameMenu정보 조회
  const getFrameMenuList = async () => {
    const result = await (
      await axios.post('/frame/MenuSelectMap', null, {
        params: { SYSTEM_CD: user?.system_cd },
      })
    ).data;
    setFrameMenuList(result);
  };

  const searchGroupList = () => {
    getAuthGroupList(systemCd, authGroup);
  };

  const handleClick = async (systemCd: string, authGroup: string) => {
    // 클릭된 값으로 상태를 업데이트합니다.
    setRowId(authGroup);

    // 그룹권한정보 조회
    getGroupMenuList(systemCd, authGroup);
  };

  React.useEffect(() => {
    //frameMenu정보 조회
    if (frameMenuList.length === 0) getFrameMenuList();
    if (systemCd !== '') getAuthGroupList(systemCd, authGroup);
  }, [systemCd]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: -50, vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '450px', height: '400px' } } }}
    >
      <Box sx={{ p: '10px' }}>
        <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
          <Typography variant="subtitle2">System</Typography>
          <Select
            label=""
            id="sel-system"
            name="sel-system"
            size="small"
            sx={{
              width: 230,
            }}
            defaultValue=""
            value={systemCd}
            onChange={selOnChange}
          >
            {selSystem &&
              selSystem.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
          <Typography variant="subtitle2">권한그룹</Typography>
          <TextField
            id="txt-authgroup"
            label=""
            size="small"
            value={authGroup}
            onChange={textOnChange}
            InputProps={{
              endAdornment: (
                <Stack sx={{ cursor: 'pointer' }}>
                  <SeacrhIcon size={32} onClick={searchGroupList} />
                </Stack>
              ),
            }}
          />
        </Stack>
      </Box>
      <Divider />
      <Stack direction="row" spacing={3}>
        <Grid md={6} xs={12}>
          <Card>
            <Box>
              <Table sx={{ minWidth: '200px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>권한 그룹명</TableCell>
                    <TableCell>비고</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authGroupList.length != 0 &&
                    authGroupList.map((row) => {
                      return (
                        <TableRow
                          hover
                          key={row.authgroup_id}
                          sx={{
                            backgroundColor: row.authgroup_id === rowId ? '#e0e0e0' : 'inherit',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleClick(row.system_cd, row.authgroup_id)}
                          onDoubleClick={() => {
                            setTextChange('authgroup_id', row.authgroup_id);
                            setTextChange('authgroup_nm', row.authgroup_nm);
                            onClose();
                          }}
                        >
                          <TableCell>{row.authgroup_nm}</TableCell>
                          <TableCell>{row.authgroup_desc}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>
        <Grid md={6} xs={12}>
          <Card sx={{ p: 1, overflowY: 'auto', height: 320 }}>
            <FrameTree data={frameGroupMenuList} />
          </Card>
        </Grid>
      </Stack>
    </Popover>
  );
}
