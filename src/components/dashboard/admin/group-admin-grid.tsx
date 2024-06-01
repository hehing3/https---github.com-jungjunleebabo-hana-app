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
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ArrowsClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { FloppyDiskBack as SaveIcon } from '@phosphor-icons/react/dist/ssr/FloppyDiskBack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import axios from 'axios';

import { MenuProps } from '@/types/nav';
import { AuthGroup } from '@/types/user-admin';
import NoRows from '@/components/no-rows';

interface GroupAdminProps {
  rows: AuthGroup[];
  setRows: (newRows: (oldRows: AuthGroup[]) => AuthGroup[]) => void;
  setRowClick: (authgroup_id: string) => void;
}

export function GroupAdminGrid({ rows, setRows, setRowClick }: GroupAdminProps): React.JSX.Element {
  const columns: GridColDef[] = [
    { field: 'authgroup_id', headerName: '그룹ID', editable: true, width: 200, headerAlign: 'center' },
    {
      field: 'authgroup_nm',
      headerName: '그룹명',
      editable: true,
      align: 'left',
      headerAlign: 'center',
      width: 200,
    },
    {
      field: 'authgroup_desc',
      headerName: '설명',
      headerAlign: 'center',
      editable: true,
      width: 200,
    },
    {
      field: 'use_yn',
      headerName: '사용여부',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 150,
      valueOptions: ['Y', 'N'],
    },
  ];

  return (
    <Card>
      <Box sx={{ overflowX: 'auto', height: 400 }}>
        <DataGrid
          //  apiRef={apiRef}

          rows={rows}
          getRowId={(row) => row.authgroup_id}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          //isRowSelectable={(params: GridRowParams) => params.row.code_id !== ''}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          onRowClick={(
            params, // GridRowParams
            event, // MuiEvent<React.MouseEvent<HTMLElement>>
            details // GridCallbackDetails
          ) => {
            //  console.log(`Movie ${params.row.code_id} clicked`);
            //코드그룹을 선택했을때만 상세정보조회

            setRowClick(params.row.authgroup_id);

            //const target = event.target as HTMLButtonElement;
            //if (target.dataset['field'] === 'code_id') setRowId(params.row.code_id);
          }}
          // checkboxSelection
          editMode="row"
          /*
          getRowClassName={({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
              return 'row--removed';
            }
            // return 'row--edited';
            return '';
          }}
          */
          slots={{
            noRowsOverlay: NoRows,
          }}
        />
      </Box>
    </Card>
  );
}
