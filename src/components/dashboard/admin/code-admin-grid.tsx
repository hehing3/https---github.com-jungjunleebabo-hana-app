'use client';

import internal from 'stream';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Checkbox } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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

import { CodeAdmin } from '@/types/code-admin';
import { useButtonStore } from '@/contexts/authbutton-context';
import { useUser } from '@/hooks/use-user';

import { CodeAdminDetailTable } from './code-admin-detail-table';

interface CodeAdminTableProps {
  initialRows?: CodeAdmin[];
  reLoad: () => void;
}

interface EditToolbarProps {
  rows: CodeAdmin[];
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
        code_id: id,
        code_nm: '',
        use_yn: 'N',
        parent_id: '',
        code_comment: '',
        insert_emp_id: '',
        insert_date: '',
        update_emp_id: '',
        update_date: '',
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'code_nm' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      <GridToolbarExport csvOptions={{ fileName: '코드그룹', utf8WithBom: true }} />
    </GridToolbarContainer>
  );
}

export function CodeAdminGrid({ initialRows = [], reLoad }: CodeAdminTableProps): React.JSX.Element {
  if (initialRows.length === 0) {
    return <></>;
  }

  const apiRef = useGridApiRef();
  const { state, initClick } = useButtonStore((state) => state);
  const [rows, setRows] = React.useState<GridRowsProp>(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [rowId, setRowId] = React.useState(rows[0].code_id);
  const [deleteData, setDeleteData] = React.useState<string[]>([]);
  const userId = useUser().user?.user_id;

  const saveCodeAdmin = async (updateRows: Array<Object>) => {
    await axios
      .post('/cmm/SaveCodeAdmin', null, {
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
          code_id: gridId,
          code_nm: updateRow['code_nm'].value,
          use_yn: updateRow['use_yn'].value,
          code_comment: updateRow['code_comment'].value,
          row_type: gridId.startsWith('NEW') ? 'N' : 'U',
          parent_id: 'COMMON',
          login_user: userId,
        });
      }

      deleteData.forEach((element) =>
        updateRows.push({
          code_id: element,
          row_type: 'D',
        })
      );

      saveCodeAdmin(updateRows);
      /*
      // 신규데이터
      const newData = rows.filter((row) => row.code_id.startsWith('NEW'));

      // 수정데이터
      const rowKey = Object.keys(rowModesModel);
      const updateData =
        rowKey.length > 0 ? rows.filter((row) => !row.code_id.startsWith('NEW') && rowKey.includes(row.code_id)) : [];

      if (newData.length > 0 || updateData.length > 0 || deleteData.length > 0) {
        console.log('newData' + newData);
        console.log('updateData' + updateData);
        console.log('deleteData' + deleteData.join());
      }
      */
    }
  }, [state]);
  /*
  const deleteCodeAdmin = React.useCallback(
    (id: GridRowId) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.code_id !== id));
      });
    },
    []
  );
  const duplicateCodeAdmin = React.useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) => {
        const rowToDuplicate = prevRows.find((row) => row.code_id === id)!;
        return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      });
    },
    []
  );
*/

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

    apiRef.current.updateRows([{ code_id: id, _action: 'delete' }]);
    // setRows(rows.filter((row) => row.code_id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.code_id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.code_id !== id));
    }
  };

  const processRowUpdate = (newRow: CodeAdmin) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.code_id === newRow.code_id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    // console.log('handleRowModesModelChange');
    setRowModesModel(newRowModesModel);
  };

  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

  const columns: GridColDef[] = [
    { field: 'code_id', headerName: '코드그룹', width: 150 },
    {
      field: 'code_nm',
      headerName: '코드그룹명',
      editable: true,
      align: 'left',
      headerAlign: 'left',
      width: 150,
    },
    {
      field: 'code_comment',
      headerName: '설명',
      editable: true,
      width: 150,
    },
    /*
    {
      field: 'use_yn',
      headerName: '사용',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={params.value === 'Y' ? true : false}
            onChange={() => {
              const updatedData = rows.map((x) => {
                if (x.code_id === params.row.code_id) {
                  return {
                    ...x,
                    use_yn: params.value === 'Y' ? 'N' : 'Y',
                  };
                }
                return x;
              });
              setRows(updatedData);
            }}
          />
        );
      },
    },*/

    {
      field: 'use_yn',
      headerName: '사용',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      width: 100,
      valueOptions: ['Y', 'N'],
    },

    {
      field: 'insert_date',
      headerName: '등록일',
      // type: 'date',
      width: 110,
    },
    {
      field: 'insert_emp_id',
      headerName: '등록자',
      width: 100,
    },
    {
      field: 'update_date',
      headerName: '수정일',
      //  type: 'date',
      width: 110,
    },
    {
      field: 'update_emp_id',
      headerName: '수정자',
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
            /*
            <GridActionsCellItem
              icon={<SaveIcon size={22} />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,*/
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
        /*
        [
        <GridActionsCellItem icon={<TrashIcon size={22} />} label="Delete" onClick={deleteCodeAdmin(params.id)} />,
        <GridActionsCellItem icon={<CopyIcon size={22} />} label="CopyUser" onClick={duplicateCodeAdmin(params.id)} />,
        ]
        */
      },
    },
  ];

  return (
    <>
      <Typography sx={{ ml: '15px' }} variant="h6">
        Master 목록
      </Typography>
      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid
          /*
          slots={{ toolbar: CustomToolbar }}
          
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          */
          // autoPageSize={true}
          apiRef={apiRef}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel, rows },
          }}
          rows={rows}
          getRowId={(row) => row.code_id}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          isRowSelectable={(params: GridRowParams) => params.row.code_id !== ''}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          checkboxSelection
          // disableRowSelectionOnClick
          onRowClick={(
            params, // GridRowParams
            event, // MuiEvent<React.MouseEvent<HTMLElement>>
            details // GridCallbackDetails
          ) => {
            console.log(`Movie ${params.row.code_id} clicked`);
            //코드그룹을 선택했을때만 상세정보조회
            const target = event.target as HTMLButtonElement;
            if (target.dataset['field'] === 'code_id') setRowId(params.row.code_id);
          }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange} //edit 수정했을때 저장아이콘 활성화
          onRowEditStop={handleRowEditStop} //이거 안하면 수정할때마다 processRowUpdate 계속 실행됨
          processRowUpdate={processRowUpdate}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            console.log('newRowSelectionModel' + newRowSelectionModel);
            //setRowId(newRowSelectionMode.code_id);
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
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
        />
      </Box>
      <CodeAdminDetailTable code_id={rowId} />
    </>
  );
}
/*
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ fileName: '코드그룹', utf8WithBom: true }} />
    </GridToolbarContainer>
  );
}
*/
