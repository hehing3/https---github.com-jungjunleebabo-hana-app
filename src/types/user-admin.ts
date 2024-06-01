export interface UserAdmin {
  user_id: string;
  user_name: string;
  user_org_cd?: string;
  user_job_cd?: string;
  user_email?: string;
  system_cd?: string;
  authgroup_id?: string;
  authgroup_nm?: string;
  user_cellphone_first?: string;
  user_cellphone_middle?: string;
  user_cellphone_last?: string;
  user_phone_first?: string;
  user_phone_middle?: string;
  user_phone_last?: string;
  description?: string;
  user_served_yn?: string;
  row_flag?: string;
}

export interface AuthGroup {
  system_cd: string;
  authgroup_id: string;
  authgroup_nm: string;
  authgroup_desc: string;
  use_yn: string;
  sort_seq: string;
  insert_emp_id: string;
  insert_date: string;
  update_emp_id: string;
  update_date: string;
}

export interface AuthGroupMenu {
  system_cd: string;
  authgroup_id: string;
  menu_id: string;
  insert_emp_id: string;
  insert_date: string;
  update_emp_id: string;
  update_date: string;
}
