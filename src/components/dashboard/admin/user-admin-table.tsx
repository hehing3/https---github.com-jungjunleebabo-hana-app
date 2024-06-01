'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination, { TablePaginationProps } from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { UserAdmin } from '@/types/user-admin';
import { useButtonStore } from '@/contexts/authbutton-context';
import { useSelection } from '@/hooks/use-selection';

export function UserAdminTable({
  rows,
  rowClick,
  selectId,
  setSelectId,
}: {
  rows: UserAdmin[];
  rowClick: (row: string) => void;
  selectId: string;
  setSelectId: (row: string) => void;
}): React.JSX.Element {
  /*
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.user_id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
*/

  // 클릭 이벤트 핸들러
  const handleClick = (value: string) => {
    // 클릭된 값으로 상태를 업데이트합니다.
    setSelectId(value);
    rowClick(value);
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '500px' }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">권한</TableCell>
              <TableCell align="center">사용자ID</TableCell>
              <TableCell align="center">사용자명</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selectId == row.user_id; //selected?.has(row.user_id);
              // console.log('isSelected', isSelected);
              return (
                <TableRow
                  hover
                  key={row.user_id}
                  selected={isSelected}
                  sx={{ cursor: 'pointer' /*, backgroundColor: row.user_id === rowId ? '#e0e0e0' : 'inherit' */ }}
                  onClick={() => {
                    handleClick(row.user_id);
                  }}
                >
                  <TableCell align="center">{row.authgroup_nm}</TableCell>
                  <TableCell align="center">{row.user_id}</TableCell>
                  <TableCell align="center">{row.user_name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
    </Card>
  );
}
