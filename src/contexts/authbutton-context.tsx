'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore, type StoreApi } from 'zustand';

import { createButtonStore, initButtonStore, type ButtonStore } from '@/contexts/button-store';

export const ButtonStoreContext = createContext<StoreApi<ButtonStore> | null>(null);

export interface ButtonStoreProviderProps {
  children: ReactNode;
}

export const ButtonStoreProvider = ({ children }: ButtonStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ButtonStore>>();
  if (!storeRef.current) {
    storeRef.current = createButtonStore(initButtonStore());
  }

  return <ButtonStoreContext.Provider value={storeRef.current}>{children}</ButtonStoreContext.Provider>;
};

export const useButtonStore = <T,>(selector: (store: ButtonStore) => T): T => {
  const buttonStoreContext = useContext(ButtonStoreContext);

  if (!buttonStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(buttonStoreContext, selector);
};
