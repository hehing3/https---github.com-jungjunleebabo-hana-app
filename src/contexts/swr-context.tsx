'use client';

import { SWRConfig } from 'swr';

type Props = {
  children: React.ReactNode;
};

export default function SWRConfigContext({ children }: Props) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json),
        onErrorRetry(err, key, config, revalidate, revalidateOpts) {
          // 404에서 재시도 안함
          if (err.status === 404) return;

          // 특정 키에 대해 재시도 안함
          // if (key === '/api/user') return

          // 10번까지만 재시도함
          if (revalidateOpts.retryCount >= 10) return;

          // 5초 후에 재시도
          setTimeout(() => revalidate({ retryCount: revalidateOpts.retryCount }), 5000);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
