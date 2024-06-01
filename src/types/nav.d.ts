export interface NavItemConfig {
  id?: string;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  icon?: string;
  href?: string;
  hasChildren?: boolean;
  items?: NavItemConfig[]; // 자식 요소가 배열로 되어있음을 명시
  children?: NavItemConfig[]; // 자식 요소가 배열로 되어있음을 명시
  // Matcher cannot be a function in order
  // to be able to use it on the server.
  // If you need to match multiple paths,
  // can extend it to accept multiple matchers.
  matcher?: { type: 'startsWith' | 'equals'; href: string };
}

export interface MenuProps {
  menuId: string;
  menuLevel: number;
  menuName: string;
  sortSeq: number;
  systemCd: string;
  useYn: string;
  upMenuId: string;
  programUrl: string;
  deleteYn: string;
  excelYn: string;
  inputYn: string;
  printYn: string;
  saveYn: string;
  searchYn: string;
  prifix: string;
  pgmId: string;
  chk?: string;
  property: string;
  menuType: string;
  menuDesc: string;
}
