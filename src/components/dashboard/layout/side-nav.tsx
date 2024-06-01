'use client';

import React, { useEffect, useState } from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { MagnifyingGlass as SeacrhIcon } from '@phosphor-icons/react/dist/ssr';
import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import axios from 'axios';

import type { MenuProps, NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { useButtonStore } from '@/contexts/authbutton-context';
import { useUser } from '@/hooks/use-user';
import { Logo } from '@/components/core/logo';

//import { navItems } from './config';
import { navIcons } from './nav-icons';

function setSubNaviList(subMenuArr: MenuProps[], subNaviMenuListArr: NavItemConfig[], menuArr: MenuProps[]) {
  subMenuArr.forEach((subRow: MenuProps) => {
    const programId = subRow.programUrl;
    let setObject;

    if (programId !== undefined) {
      // "admin::codeAdmin.xfdl" -> code_admin으로 변환
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

      setObject = {
        id: subRow.menuId,
        //id: newProgramId,
        label: subRow.menuName,
        href: paths.dashboard[newProgramId],
        icon: '',
      };
    } else {
      //Menu_Level이 2이고 하위 메뉴가 있는 경우
      const subMenu = menuArr.filter((subNaviRow: MenuProps) => subNaviRow.upMenuId === subRow.menuId);
      const subNaviMenuList: NavItemConfig[] = [];
      setSubNaviList(subMenu, subNaviMenuList, menuArr);

      setObject = {
        id: subRow.menuId,
        label: subRow.menuName,
        href: '',
        icon: 'plugs-connected',
        children: subNaviMenuList,
      };
    }

    subNaviMenuListArr.push(setObject);
  });
}

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const { user } = useUser();
  const [navItems, setNavItems] = useState<NavItemConfig[]>();
  const { setMenuList } = useButtonStore((state) => state);
  /*
  const fetcher = ([url, system_cd, authgroup_id]: Array<string>): Promise<MenuProps[]> =>
    axios
      .post(url, null, {
        params: { SYSTEM_CD: system_cd, AUTHGROUP_ID: authgroup_id },
      })
      .then((res) => res.data);

  const { data, error } = useSWR<MenuProps[]>(
    ['/frame/MenuSelectMap', user?.system_cd ?? '', user?.authgroup_id ?? ''],
    ([url, system_cd, authgroup_id]) => fetcher([url, system_cd, authgroup_id])
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const mainNavitemList: NavItemConfig[] = [];

  mainNavitemList.push({ id: 'overview', label: 'Home', href: paths.dashboard.overview, icon: 'house' });

  const mainMenu = data.filter((row: MenuProps) => row.menuLevel === 1);

  mainMenu.forEach((row: MenuProps) => {
    const subMenu = data.filter((subRow: MenuProps) => subRow.upMenuId === row.menuId);
    const subNaviMenuList: NavItemConfig[] = [];

    setSubNaviList(subMenu, subNaviMenuList, data);

    mainNavitemList.push({
      id: row.menuId,
      label: row.menuName,
      href: '',
      icon: 'gear-six',
      children: subNaviMenuList,
    });
  });

  setNavItems(mainNavitemList);
*/

  useEffect(() => {
    const getMenuList = async () => {
      try {
        const resp = await axios.post('/frame/MenuSelectMap', null, {
          params: { SYSTEM_CD: user?.system_cd, AUTHGROUP_ID: user?.authgroup_id },
        });

        const data = resp.data;
        const mainNavitemList: NavItemConfig[] = [];

        mainNavitemList.push({ id: 'overview', label: 'Home', href: paths.dashboard.overview, icon: 'house' });

        const mainMenu = data.filter((row: MenuProps) => row.menuLevel === 1);

        mainMenu.forEach((row: MenuProps) => {
          const subMenu = data.filter((subRow: MenuProps) => subRow.upMenuId === row.menuId);
          const subNaviMenuList: NavItemConfig[] = [];

          setSubNaviList(subMenu, subNaviMenuList, data);

          mainNavitemList.push({
            id: row.menuId,
            label: row.menuName,
            href: '',
            icon: 'gear-six',
            children: subNaviMenuList,
          });
        });

        setNavItems(mainNavitemList);

        //전역변수 저장
        setMenuList(data);
      } catch (error) {
        console.error('Error fetching menu list:', error);
      }
    };

    // 화면 로드 시 getMenuList 호출
    getMenuList();
  }, []);

  const handleSearchClick = () => {
    // 'outlined-basic'에 입력된 값과 동일한 이름을 가진 버튼을 찾음
    // console.log('이건됨?');
    // const buttonToClick = document.querySelector(`button[name="${searchValue}"]`);
    // // 해당 버튼을 찾았으면 클릭 이벤트를 시뮬레이트하여 클릭함
    // if (buttonToClick) {
    //   buttonToClick.click();
    // }
  };

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="light" height={32} width={122} />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'var(--mui-palette-neutral-950)',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', height: '35px' }}>
            <TextField
              id="outlined-basic"
              label=""
              variant="outlined"
              InputProps={{ style: { color: 'white', marginRight: '5px' } }}
            />
            <SeacrhIcon size={32} onClick={handleSearchClick} />
          </Box>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box
        component="nav"
        sx={{
          flex: '1 1 auto',
          p: '12px',
          overflowY: 'auto', // 스크롤이 필요한 경우에만 스크롤 생성
          maxHeight: 'calc(100vh - 130px)', // 적절한 높이 설정 (예시로 130px로 설정)
          '&::-webkit-scrollbar': {
            // 웹킷 브라우저용 스크롤 스타일링
            width: 10,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: 5,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--mui-palette-neutral-950)',
          },
        }}
      >
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {items.map((item) => (
        <NavItemWithChildren key={item.id} pathname={pathname} {...item} />
      ))}
    </Stack>
  );
}

function NavItemWithChildren({ children, pathname, ...props }: NavItemProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const { setMenuId } = useButtonStore((state) => state);

  const handleClick = (id: string) => {
    setOpen(!open);
    setMenuId(id);
    if (children !== null && children !== undefined) {
      // 현재 선택한 메뉴 아이디 저장
      // setMenuId(id);
    }
  };

  return (
    <>
      <NavItem onClick={handleClick} hasChildren={!!children} {...props} pathname={pathname} />
      {children && open && (
        <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {children.map((child) => (
            <NavItemWithChildren key={child.id} {...child} pathname={pathname} />
          ))}
        </Stack>
      )}
    </>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  onClick?: (id: string) => void;
}

function NavItem({
  id,
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  label,
  onClick,
  hasChildren,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  /*
  // 클릭 이벤트 핸들러
  const handleClick = (value: string) => {
    // 클릭된 값으로 상태를 업데이트합니다.
    onClick(value);
  };
*/
  return (
    <li>
      <Box
        onClick={() => {
          if (id && onClick) onClick(id);
        }}
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.04)', // 호버시 배경색 변경
            color: 'var(--NavItem-color)', // 원래 색상으로 변경
          },
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          overflowY: 'auto', // 세로 스크롤 추가
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
          ...(hasChildren && {
            bgcolor: 'var(--NavItem-has-children-background)',
            color: 'var(--NavItem-has-children-color)',
          }), // 자식 요소가 있는 경우의 스타일
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
