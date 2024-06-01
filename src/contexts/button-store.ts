import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { MenuProps } from '@/types/nav';

export type ButtonState = {
  state: string;
  menuList: MenuProps[];
  menuId: string;
};

export type ButtonActions = {
  insertClick: () => void;
  updateClick: () => void;
  deleteClick: () => void;
  saveClick: () => void;
  searchClick: () => void;
  initClick: () => void;
  setAddMenu: (menu: MenuProps) => void;
  setMenuList: (mList: MenuProps[]) => void;
  setMenuId: (id: string | undefined) => void;
};

export type ButtonStore = ButtonState & ButtonActions;

export const initButtonStore = (): ButtonState => {
  return { state: '', menuList: [], menuId: '' };
};

export const defaultInitState: ButtonState = {
  state: '',
  menuList: [],
  menuId: '',
};

export const createButtonStore = (initState: ButtonState = defaultInitState) => {
  return createStore<ButtonStore>()((set) => ({
    ...initState,
    insertClick: () => set((prevMenu) => ({ ...prevMenu, state: 'insert' })),
    updateClick: () => set((prevMenu) => ({ ...prevMenu, state: 'update' })),
    deleteClick: () => set((prevMenu) => ({ ...prevMenu, state: 'delete' })),
    saveClick: () => set((prevMenu) => ({ ...prevMenu, state: 'save' })),
    searchClick: () => set((prevMenu) => ({ ...prevMenu, state: 'search' })),
    initClick: () => set((prevMenu) => ({ ...prevMenu, state: '' })),
    setAddMenu: (menu) => set((prevMenu) => ({ ...prevMenu, menuList: [...prevMenu.menuList, menu] })),
    setMenuList: (mList) => set((prevMenu) => ({ ...prevMenu, menuList: mList })),
    setMenuId: (id: string | undefined) => set((prevMenu) => ({ ...prevMenu, menuId: id })),
  }));
};
