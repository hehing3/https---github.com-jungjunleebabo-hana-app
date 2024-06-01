'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination, { TablePaginationProps } from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useSelection } from '@/hooks/use-selection';

export interface ProgramAdmin {
  pgm_id: string;
  program_name: string;
  program_url: string;
  prifix: string;
  use_yn: string;
  program_type: string;
  search_yn: String;
  input_yn: string;
  delete_yn: string; 
  excel_yn: string; 
  print_yn: string; 
  save_yn: string; 
  user_name: string; 
}

interface ProgramAdminTableProps {
  count?: number;
  rows?: ProgramAdmin[];
}

function applyPagination(rows: ProgramAdmin[], page: number, rowsPerPage: number): ProgramAdmin[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export function ProgramAdminTable({ count = 0, rows = [] }: ProgramAdminTableProps): React.JSX.Element {
  if (rows.length === 0) {
    return <></>;
  }
  const [filterRows, setFilterRows] = React.useState<ProgramAdmin[]>([]); // 예시 데이터
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowId, setRowId] = React.useState(rows[0].pgm_id);

  // 클릭 이벤트 핸들러
  const handleClick = (value: string) => {
    // 클릭된 값으로 상태를 업데이트합니다.
    setRowId(value);
  };

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.pgm_id);
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
                <TableCell>프로그램 ID</TableCell>
                <TableCell>프로그램 명</TableCell>
                <TableCell>프로그램 URL</TableCell>
                <TableCell>구분</TableCell>
                <TableCell>사용유무</TableCell>
                <TableCell>타입</TableCell>
                <TableCell>조회</TableCell>
                <TableCell>입력</TableCell>
                <TableCell>삭제</TableCell>
                <TableCell>엑셀</TableCell>
                <TableCell>출력</TableCell>
                <TableCell>저장</TableCell>
                <TableCell>등록자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterRows.map((row) => {
                const isSelected = selected?.has(row.pgm_id);

                return (
                  <TableRow
                    hover
                    key={row.pgm_id}
                    selected={isSelected}
                    sx={{ backgroundColor: row.pgm_id === rowId ? '#e0e0e0' : 'inherit' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.pgm_id);
                          } else {
                            deselectOne(row.pgm_id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: 'pointer', // 포인터 커서를 설정합니다.
                      }}
                      onClick={() => {
                        handleClick(row.pgm_id);
                      }}
                    >
                      {row.pgm_id}
                    </TableCell>
                    <TableCell>{row.program_name}</TableCell>
                    <TableCell>{row.program_url}</TableCell>
                    <TableCell>{row.prifix}</TableCell>
                    <TableCell>{row.use_yn}</TableCell>
                    <TableCell>{row.program_type}</TableCell>
                    <TableCell>{row.search_yn}</TableCell>
                    <TableCell>{row.input_yn}</TableCell>
                    <TableCell>{row.delete_yn}</TableCell>
                    <TableCell>{row.excel_yn}</TableCell>
                    <TableCell>{row.print_yn}</TableCell>
                    <TableCell>{row.save_yn}</TableCell>
                    <TableCell>{row.user_name}</TableCell>
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
    </>
  );
}
