import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
    sx={{
      display: 'flex', // 수평 가운데 정렬을 위해 flex로 변경
      justifyContent: 'center', // 수평 가운데 정렬
      alignItems: 'center', // 수직 가운데 정렬
      minHeight: '100vh', // 뷰포트의 높이만큼 최소 높이 지정
    }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        {/* 로고부분 주석처리
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
          </Box>
        </Box>
        */}
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>

    </Box>
  );
}
