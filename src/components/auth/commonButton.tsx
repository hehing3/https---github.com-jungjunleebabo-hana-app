import React, { useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { ArrowsClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { FloppyDiskBack as SaveIcon } from '@phosphor-icons/react/dist/ssr/FloppyDiskBack';
import {
  MagnifyingGlass as MagnifyingGlassIcon,
  MagnifyingGlass as SearchIcon,
} from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { useButtonStore } from '@/contexts/authbutton-context';

export function CommonBtn(): React.JSX.Element {
  const { menuId, menuList, saveClick, insertClick, updateClick, deleteClick, searchClick } = useButtonStore(
    (state) => state
  );
  const [delYN, setDelYN] = useState<string>();
  const [saveYN, setSaveYN] = useState<string>();
  const [searchYN, setSearchYN] = useState<string>();
  const [inputYN, setInputYN] = useState<string>();
  const [excelYN, setExcelYN] = useState<string>();
  const [printYN, setPrintYN] = useState<string>();

  const pathname = usePathname();
  const router = useRouter();

  const pageRefresh = () => {
    router.push(`${pathname}?type=refresh`);
    router.refresh();
  };

  if (!menuList) return <div>Loading...</div>;

  React.useEffect(() => {
    let cMenu = null;
    //debugger;
    if (menuId !== null && menuId !== undefined) {
      cMenu = menuList.find((menu) => menu.menuId === menuId);
    } else {
      cMenu = menuList.find((menu) => {
        const programId = menu.programUrl;
        let setObject;

        // "admin::codeAdmin.xfdl" -> code_admin으로 변환
        if (programId) {
          const str = programId.split('::')[1].split('.xfdl')[0];
          let arr = [];
          for (let i = 0; i < str.length; i++) {
            if (str[i] === str[i].toUpperCase()) {
              arr.push('_' + str[i].toLowerCase());
            } else {
              arr.push(str[i]);
            }
          }
          const newProgramId = arr.join('');

          return pathname.indexOf(newProgramId) > -1 ? true : false;
        }
      });
    }

    if (cMenu) {
      // console.log('rrrr' + JSON.stringify(cMenu));

      setDelYN(cMenu.deleteYn);
      setExcelYN(cMenu.excelYn);
      setInputYN(cMenu.inputYn);
      setPrintYN(cMenu.printYn);
      setSearchYN(cMenu.searchYn);
      setSaveYN(cMenu.saveYn);
    }
    // console.log(`menuId: ${menuId} -----------menuList: ${menuList}`);
  }, [menuId]);

  return (
    <>
      {saveYN && saveYN === 'Y' && (
        <Button startIcon={<SaveIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={saveClick}>
          Save
        </Button>
      )}
      {delYN && delYN === 'Y' && (
        <Button startIcon={<MinusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={deleteClick}>
          Del
        </Button>
      )}
      {inputYN && inputYN === 'Y' && (
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={insertClick}>
          Add
        </Button>
      )}
      {searchYN && searchYN === 'Y' && (
        <Button
          startIcon={<SearchIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          color="success"
          onClick={searchClick}
        >
          Search
        </Button>
      )}
      <Button
        startIcon={<RefreshIcon fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        color="warning"
        onClick={pageRefresh}
      >
        refresh
      </Button>
    </>
  );
}
