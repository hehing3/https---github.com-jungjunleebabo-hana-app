import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'; // TreeItem을 함께 가져오도록 수정

import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';

import { MenuProps } from '@/types/nav';
import { useSelection } from '@/hooks/use-selection';
import { FrameRichTree, FrameTree } from './admin-tree';

export function MenuAdminTable({
  rows,
  rowClick,
  selectId,
}: {
  rows: MenuProps[];
  rowClick: (row: string) => void;
  selectId: string;
}): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.menuId);
  }, [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const [rowId, setRowId] = React.useState(selectId);

  const handleClick = (value: string) => {
    setRowId(value);
    rowClick(value);
  };
  React.useEffect(() => {
    deselectAll();
    selectOne(selectId);
  }, [selectId]);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
    
      </Box>
      <Divider />
    </Card>
  );
}
