'use client';

import * as React from 'react';
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
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

import { CodeAdminDetailTable } from './code-admin-detail-table';

export interface CodeAdmin {
  code_id: string;
  code_nm: string;
  use_yn: string;
  parent_id: string;
  code_comment: string;
  insert_emp_id: string;
  insert_date: String;
  update_emp_id: string;
  update_date: string; //Date | null;
}

interface CodeAdminTableProps {
  count?: number;
  rows?: CodeAdmin[];
}

function applyPagination(rows: CodeAdmin[], page: number, rowsPerPage: number): CodeAdmin[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export function CodeAdminTable({ count = 0, rows = [] }: CodeAdminTableProps): React.JSX.Element {
  if (rows.length === 0) {
    return <></>;
  }
  const [filterRows, setFilterRows] = React.useState<CodeAdmin[]>([]); // 예시 데이터
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowId, setRowId] = React.useState(rows[0].code_id);

  // 클릭 이벤트 핸들러
  const handleClick = (value: string) => {
    // 클릭된 값으로 상태를 업데이트합니다.
    setRowId(value);
  };

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.code_id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  // 페이지 변경 핸들러
  const handleChangePage: TablePaginationProps['onPageChange'] = (event, newPage) => {
    setPage(newPage);
  };

  // 페이지 당 행 수 변경 핸들러
  const handleChangeRowsPerPage: TablePaginationProps['onRowsPerPageChange'] = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    setFilterRows(applyPagination(rows, page, rowsPerPage));
  }, [page, rowsPerPage]);

  return (
    <>
      <Typography sx={{ ml: '15px' }} variant="h6">
        Master 목록
      </Typography>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        selectAll();
                      } else {
                        deselectAll();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>코드그룹</TableCell>
                <TableCell>코드그룹명</TableCell>
                <TableCell>설명</TableCell>
                <TableCell>사용</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell>등록자</TableCell>
                <TableCell>수정일</TableCell>
                <TableCell>수정자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterRows.map((row) => {
                const isSelected = selected?.has(row.code_id);

                return (
                  <TableRow
                    hover
                    key={row.code_id}
                    selected={isSelected}
                    sx={{ backgroundColor: row.code_id === rowId ? '#e0e0e0' : 'inherit' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.code_id);
                          } else {
                            deselectOne(row.code_id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: 'pointer', // 포인터 커서를 설정합니다.
                      }}
                      onClick={() => {
                        handleClick(row.code_id);
                      }}
                    >
                      {row.code_id}
                    </TableCell>
                    <TableCell>{row.code_nm}</TableCell>
                    <TableCell>{row.code_comment}</TableCell>
                    <TableCell>{row.use_yn}</TableCell>
                    <TableCell>{row.insert_date}</TableCell>
                    <TableCell>{row.insert_emp_id}</TableCell>
                    <TableCell>{row.update_date /*dayjs(row.update_date).format('MMM D, YYYY')*/}</TableCell>
                    <TableCell>{row.update_emp_id}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <CodeAdminDetailTable code_id={rowId} />
    </>
  );
}
