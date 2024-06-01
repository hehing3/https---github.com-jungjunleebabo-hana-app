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
import { ArrowsClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { FloppyDiskBack as SaveIcon } from '@phosphor-icons/react/dist/ssr/FloppyDiskBack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';


import axios from 'axios';

import { MenuProps } from '@/types/nav';
import { setRichTreeView2 } from './admin-tree';
import { MenuAdminDetailForm } from './menu-admin-detail';

const selSystem = [
  { code_id: '001', code_nm: 'SYSTEM 01' },
  { code_id: '002', code_nm: 'SYSTEM 02' },
];

interface defaultSearchProps {
  selSystem: string;
  txtGroup: string;
}

export function MenuAdminLayout(): React.JSX.Element {
  const [searchDs, setSearchDs] = React.useState<defaultSearchProps>({ selSystem: '001', txtGroup: '' });
  const [frameMenuList, setFrameMenuList] = React.useState<MenuProps[]>([]);
  const [selectRow, setSelectRow] = React.useState<MenuProps>();
  const [lastSelectedItem, setLastSelectedItem] = React.useState<string | null>( null,);

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      setSelectRow(frameMenuList.filter((row)=> row.menuId === itemId)[0]);
    }
  };
  

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSearchDs((newValues) => ({ ...newValues, [event.target.name]: event.target.value }));
  };

  const fn_Search = () => {
    if (searchDs.selSystem === '') {
      alert('System을 선택하세요.');
    }

    // treeview 데이터 조회
    getFrameMenuList();
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

  const setTreeView = (data: MenuProps[]) => {
    const filterList = data.filter((row) => row.menuLevel === 1);
    const items: TreeViewBaseItem[] = [];
  
    filterList.map((rootNode) => {
      items.push({ id: rootNode.menuId, label: rootNode.menuName, children: setRichTreeView2(data, rootNode.menuId) });
    });
  
    return items;
  };
  return (
    <Stack spacing={3} sx={{ position: 'relative', top: '0px' }}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">메뉴관리</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button startIcon={<SaveIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
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
        </Stack>
      </Stack>
      <Card sx={{ p: 2 }}>
        <Stack direction="row" spacing={3}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="groupadmin-system-label">시스템구분</InputLabel>
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
        </Stack>
      </Card> 
      <Stack direction="row" sx={{ alignItems: 'top', width: '100%' }}>
        <Stack direction="column" spacing={3} sx={{ marginRight: '20px', width: '50%' }}>
          <Typography variant="h6">메뉴목록</Typography>
      
        <RichTreeView 
              items={setTreeView(frameMenuList)}
              onItemSelectionToggle={handleItemSelectionToggle}
        />
        
        </Stack>
        <Stack direction="column" spacing={3} sx={{ width: '50%' }}>
          <Typography variant="h6">메뉴상세</Typography>
         
         {selectRow && <MenuAdminDetailForm selectRow={selectRow} />}
      

        </Stack>
      </Stack>
  </Stack>
  
  );
}
