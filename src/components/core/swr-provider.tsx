'use client';

import { SWRConfig } from 'swr';

type Props = {
  children: React.ReactNode;
};

export const SWRProvider = ({ children }: Props) => {
  return <SWRConfig>{children}</SWRConfig>;
};
