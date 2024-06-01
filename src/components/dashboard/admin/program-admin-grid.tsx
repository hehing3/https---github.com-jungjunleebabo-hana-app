'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp,
  GridSlots,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid';
import {
  Plus as AddIcon,
  X as CancelIcon,
  Copy as CopyIcon,
  Pencil as EditIcon,
  FloppyDiskBack as SaveIcon,
  Trash as TrashIcon,
} from '@phosphor-icons/react/dist/ssr';
import axios from 'axios';

import { ProgramAdmin } from '@/types/program-admin';
import { useButtonStore } from '@/contexts/authbutton-context';
import { useUser } from '@/hooks/use-user';

interface ProgramAdminTableProps {
  initialRows?: ProgramAdmin[];
  reLoad: () => void;
}

interface EditToolbarProps {
  rows: ProgramAdmin[];
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { rows, setRows, setRowModesModel } = props;

  const handleClick = () => {
    // 신규일 경우 key
    const id = 'NEW_' + rows.length;

    setRows((oldRows) => [
      ...oldRows,
      {
        pgm_id: id,
        program_name: '',
        program_url: '',
        prifix: '',
        use_yn: '',
        program_type: '',
        search_yn: '',
        input_yn: '',
        delete_yn: '',
        excel_yn: '',
        print_yn: '',
        save_yn: '',
        user_name: '',
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'program_name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      <GridToolbarExport csvOptions={{ fileName: '프로그램관리', utf8WithBom: true }} />
    </GridToolbarContainer>
  );
}

export function ProgramAdminGrid({ initialRows = [], reLoad }: ProgramAdminTableProps): React.JSX.Element {
  if (initialRows.length === 0) {
    return <></>;
  }

  console.log(initialRows);

  const apiRef = useGridApiRef();
  const { state, initClick } = useButtonStore((state) => state);
  const [rows, setRows] = React.useState<GridRowsProp>(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [rowId, setRowId] = React.useState(rows[0].pgm_id);
  const [deleteData, setDeleteData] = React.useState<string[]>([]);
  const userId = useUser().user?.user_id;

  // 초기 상태 설정
  const [useYnState, setUseYnState] = React.useState<{ [id: string]: string }>({});

  // 체크박스 상태를 업데이트하는 함수
  const handleUseYnChange = (id: string, newValue: string): void => {
    setUseYnState((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };
  const saveProgramAdmin = async (updateRows: Array<Object>) => {
    await axios
      .post('/admin/SaveProgramAdmin', null, {
        params: {
          data: JSON.stringify(updateRows),
        },
        // params: updateRows,
      })
      .then(function (response) {
        if (response.status === 200) {
          //alert('저장완료');

          reLoad();
        }
        //console.log();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (state === 'save') {
      console.log('save-state' + state);
      console.log('save-rowModesModel' + JSON.stringify(rowModesModel));
      console.log('save-apiRef' + apiRef); //apiRef.current.store.value.editRows  확인필요
      console.log('rows' + rows);

      //저장 로직 시작
      const gridData = apiRef.current.store.value.editRows;
      const updateRows = [];

      for (const gridId in gridData) {
        const updateRow = gridData[gridId];
        updateRows.push({
          pgm_id: gridId,
          program_name: updateRow['program_name'].value,
          program_url: updateRow['program_url'].value,
          prifix: updateRow['prifix'].value,
          use_yn: updateRow['use_yn'].value,
          program_type: updateRow['program_type'].value,
          search_yn: updateRow['search_yn'].value,
          input_yn: updateRow['input_yn'].value,
          delete_yn: updateRow['delete_yn'].value,
          excel_yn: updateRow['excel_yn'].value,
          print_yn: updateRow['print_yn'].value,
          save_yn: updateRow['save_yn'].value,
          user_name: userId,
          row_type: gridId.startsWith('NEW') ? 'N' : 'U',
          parent_id: 'ADMIN',
        });
      }

      deleteData.forEach((element) =>
        updateRows.push({
          pgm_id: element,
          row_type: 'D',
        })
      );

      saveProgramAdmin(updateRows);
    }
    initClick();
  }, [state]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDeleteData((prevData) => [...prevData, id.toString()]);

    apiRef.current.updateRows([{ pgm_id: id, _action: 'delete' }]);
    // setRows(rows.filter((row) => row.pgm_id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.pgm_id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.pgm_id !== id));
    }
  };

  const processRowUpdate = (newRow: ProgramAdmin) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.pgm_id === newRow.pgm_id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    // console.log('handleRowModesModelChange');
    setRowModesModel(newRowModesModel);
  };

  const handleCheckboxChange = (id: string, field: string, newValue: string): void => {
    const updatedData = rows.map((row) => {
      if (row.pgm_id === id) {
        return {
          ...row,
          [field]: newValue,
        };
      }
      return row;
    });
    console.log('updatedData      ');
    console.log(JSON.stringify(updatedData));

    setRows(updatedData);
  };

  const columns: GridColDef[] = [
    { field: 'pgm_id', headerName: '프로그램ID', width: 150 },
    {
      field: 'program_name',
      headerName: '프로그램명',
      editable: true,
      align: 'left',
      headerAlign: 'left',
      width: 150,
    },
    {
      field: 'program_url',
      headerName: '프로그램URL',
      editable: true,
      width: 150,
    },
    {
      field: 'prifix',
      headerName: '구분',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['ADMIN', 'SALES', 'REPORT', 'SUPPORT', 'DEV', 'TECH'],
    },
    {
      field: 'use_yn',
      headerName: '사용유무',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },
    // {
    //   field: 'use_yn',
    //   headerName: '사용유무',
    //   align: 'center',
    //   headerAlign: 'center',
    //   width: 100,
    //   renderCell: (params) => {
    //     return (
    //       <Checkbox
    //         checked={params.row?.use_yn === 'Y'} // 수정
    //         disabled={false}
    //         onChange={(event) => {
    //           const newValue = event.target.checked ? 'Y' : 'N';
    //           handleCheckboxChange(params.row.pgm_id, 'use_yn', newValue); // 변경된 값을 상태에 반영
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      field: 'program_type',
      headerName: '타입',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['PAGE', 'TABPAGE', 'POPUP'],
    },
    {
      field: 'search_yn',
      headerName: '조회',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },
    {
      field: 'input_yn',
      headerName: '입력',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },
    {
      field: 'delete_yn',
      headerName: '삭제',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },
    {
      field: 'excel_yn',
      headerName: '엑셀',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },
    {
      field: 'print_yn',
      headerName: '출력',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },
    {
      field: 'save_yn',
      headerName: '저장',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },
    // {
    //   field: 'search_yn',
    //   headerName: '조회',
    //   align: 'center',
    //   headerAlign: 'center',
    //   width: 100,
    //   renderCell: (params) => (
    //     <Checkbox
    //     checked={params.row?.search_yn === 'Y' ? true : false}
    //       disabled={false}
    //       onChange={(event) => {
    //         const newValue = event.target.checked ? 'Y' : 'N';
    //         handleCheckboxChange(params.row.pgm_id, 'search_yn', newValue); // 변경된 값을 상태에 반영
    //       }}
    //     />
    //   ),
    // },
    // {
    //   field: 'input_yn',
    //   headerName: '입력',
    //   align: 'center',
    //   headerAlign: 'center',
    //   width: 100,
    //   renderCell: (params) => (
    //     <Checkbox
    //     checked={params.row?.input_yn === 'Y' ? true : false}
    //       disabled={false}
    //       onChange={(event) => {
    //         const newValue = event.target.checked ? 'Y' : 'N';
    //         handleCheckboxChange(params.row.pgm_id, 'input_yn', newValue); // 변경된 값을 상태에 반영
    //       }}
    //     />
    //   ),
    // },
    // {
    //   field: 'delete_yn',
    //   headerName: '삭제',
    //   align: 'center',
    //   headerAlign: 'center',
    //   width: 100,
    //   renderCell: (params) => (
    //     <Checkbox
    //     checked={params.row?.delete_yn === 'Y' ? true : false}
    //       disabled={false}
    //       onChange={(event) => {
    //         const newValue = event.target.checked ? 'Y' : 'N';
    //         handleCheckboxChange(params.row.pgm_id, 'delete_yn', newValue); // 변경된 값을 상태에 반영
    //       }}
    //     />
    //   ),
    // },
    // {
    //   field: 'excel_yn',
    //   headerName: '엑셀',
    //   align: 'center',
    //   headerAlign: 'center',
    //   width: 100,
    //   renderCell: (params) => (
    //     <Checkbox
    //     checked={params.row?.excel_yn === 'Y' ? true : false}
    //       disabled={false}
    //       onChange={(event) => {
    //         const newValue = event.target.checked ? 'Y' : 'N';
    //         handleCheckboxChange(params.row.pgm_id, 'excel_yn', newValue); // 변경된 값을 상태에 반영
    //       }}
    //     />
    //   ),
    // },
    // {
    //   field: 'print_yn',
    //   headerName: '출력',
    //   align: 'center',
    //   headerAlign: 'center',
    //   width: 100,
    //   renderCell: (params) => (
    //     <Checkbox
    //     checked={params.row?.print_yn === 'Y' ? true : false}
    //       disabled={false}
    //       onChange={(event) => {
    //         const newValue = event.target.checked ? 'Y' : 'N';
    //         handleCheckboxChange(params.row.pgm_id, 'print_yn', newValue); // 변경된 값을 상태에 반영
    //       }}
    //     />
    //   ),
    // },
    // {
    //   field: 'save_yn',
    //   headerName: '저장',
    //   align: 'center',
    //   headerAlign: 'center',
    //   width: 100,
    //   renderCell: (params) => (
    //     <Checkbox
    //     checked={params.row?.save_yn === 'Y' ? true : false}
    //     disabled={false}
    //     onChange={(event) => {
    //       const newValue = event.target.checked ? 'Y' : 'N';
    //       handleCheckboxChange(params.row.pgm_id, 'save_yn', newValue); // 변경된 값을 상태에 반영
    //     }}
    //   />
    // ),
    // },
    {
      field: 'user_name',
      headerName: '등록자',
      width: 100,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<CancelIcon size={22} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon size={22} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<TrashIcon size={22} />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Box sx={{ height: 550, width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel, rows },
          }}
          rows={rows}
          getRowId={(row) => row.pgm_id}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          isRowSelectable={(params: GridRowParams) => params.row.pgm_id !== ''}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange} //edit 수정했을때 저장아이콘 활성화
          onRowEditStop={handleRowEditStop} //이거 안하면 수정할때마다 processRowUpdate 계속 실행됨
          processRowUpdate={processRowUpdate}
        />
      </Box>
    </>
  );
}
