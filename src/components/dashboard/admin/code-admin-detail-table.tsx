'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import dayjs from 'dayjs';

import { ComCode } from '@/lib/cmm/info';
import { useSelection } from '@/hooks/use-selection';

interface CodeAdminDetailTableProps {
  code_id: string;
  // rows?: CodeAdminDetail[];
}

export function CodeAdminDetailTable({ code_id = '' }: CodeAdminDetailTableProps): React.JSX.Element {
  const [rows, setRows] = React.useState<ComCode[]>([]); // 예시 데이터

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.code_id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  React.useEffect(() => {
    // ID 변경 시 데이터를 다시 가져와서 설정
    const fetchExampleData = async () => {
      try {
        const resp = await (await axios.get(`/cmm/DetailSelectMap?CODE_ID=${code_id}`)).data;
        setRows(resp);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchExampleData();
  }, [code_id]);

  return (
    <>
      <Typography sx={{ ml: '15px' }} variant="h6">
        Detail 목록 [{code_id}]
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
                <TableCell>코드</TableCell>
                <TableCell>명칭</TableCell>
                <TableCell>값</TableCell>
                <TableCell>설명</TableCell>
                <TableCell>순서</TableCell>
                <TableCell>사용</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell>등록자</TableCell>
                <TableCell>수정일</TableCell>
                <TableCell>수정자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isSelected = selected?.has(row.code_id);

                return (
                  <TableRow hover key={row.code_id} selected={isSelected}>
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
                    <TableCell>{row.code_id}</TableCell>
                    <TableCell>{row.code_nm}</TableCell>
                    <TableCell>{row.code_value}</TableCell>
                    <TableCell>{row.code_comment}</TableCell>
                    <TableCell>{row.code_seq}</TableCell>
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
      </Card>
    </>
  );
}
