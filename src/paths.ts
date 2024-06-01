export const paths: { [key: string]: any } = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    admin: '/dashboard/admin',
    code_admin: '/dashboard/admin/code_admin',
    program_admin: '/dashboard/admin/program_admin',
    menu_admin: '/dashboard/admin/menu_admin',
    user_admin: '/dashboard/admin/user_admin',
    group_admin: '/dashboard/admin/group_admin',

    sales: '/dashboard/sales',
    use_user: '/dashboard/use_user',
    partners_company: '/dashboard/partners_company',
    contract: '/dashboard/contract',

    schedule: '/dashboard/schedule',
    month_schedule: '/dashboard/schedule/month_schedule',
    year_schedule: '/dashboard/schedule/year_schedule',

    support: '/dashboard/support',
    corporate_card: '/dashboard/support/corporate_card',
    month_purchase: '/dashboard/support/month_purchase',
    sample_grid: '/dashboard/sample/sample_grid',

    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
