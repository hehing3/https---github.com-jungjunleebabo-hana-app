import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
export const navItems = [
  { id: 'overview', label: 'Home', href: paths.dashboard.overview, icon: 'house'},

  {
    id: 'admin',
    label: '기준정보',
    href: '',
    icon: 'gear-six',
    children: [
      { id: 'code_admin', label: '공통코드', href: paths.dashboard.code_admin, icon: '' },
      { id: 'program_admin', label: '프로그램관리', href: paths.dashboard.program_admin, icon: '' },
      { id: 'menu_admin', label: '메뉴관리', href: paths.dashboard.menu_admin, icon: '' },
      { id: 'user_admin', label: '권한관리', href: paths.dashboard.user_admin, icon: '' },
      { id: 'group_admin', label: '사용자관리', href: paths.dashboard.group_admin, icon: '' },
    ]
  },
  {
    id: 'sales',
    label: 'SALES',
    href: '',
    icon: 'sales',
    children: [
      { id: 'use_user', label: '인력관리', href: paths.dashboard.use_user, icon: '' },
      { id: 'partners_company', label: '협력사관리', href: paths.dashboard.partners_company, icon: '' },
      { id: 'contract', label: '계약관리', href: paths.dashboard.contract, icon: '' },

      { id: 'schedule',
        label: '일정관리',
        href: '',
        icon: 'plugs-connected',
        children: [
          { id: 'month_schedule', label: '월 일정표', href: paths.dashboard.month_schedule, icon: '' },
          { id: 'year_schedule', label: '년 일정표', href: paths.dashboard.year_schedule, icon: '' },
        ]
      },
    ]
  },
  {
    id: 'support',
    label: '사업지원',
    href: '',
    icon: 'users',
    children: [
      { id: 'corporate_card', label: '법인카드 사용 내역', href: paths.dashboard.corporate_card, icon: '' },
      { id: 'month_purchase', label: '월별 매입 관리', href: paths.dashboard.month_purchase, icon: '' },
    ]
  },
  {
    id: 'sample',
    label: 'Sample',
    href: '',
    icon: 'sample',
    children: [
      { id: 'customers', label: 'Customers', href: paths.dashboard.customers, icon: '' },
      { id: 'integrations', label: 'Integrations', href: paths.dashboard.integrations, icon: '' },
      { id: 'settings', label: 'Settings', href: paths.dashboard.settings, icon: '' },
      { id: 'account', label: 'Account', href: paths.dashboard.account, icon: '' },
      { id: 'error', label: 'Error', href: paths.errors.notFound, icon: '' },
  ]
},

] as NavItemConfig[]; // 타입 어노테이션 추가
