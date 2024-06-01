export interface CodeAdmin {
  id: string;
  code_id: string;
  code_nm: string;
  use_yn: string;
  parent_id: string;
  code_comment: string;
  insert_emp_id: string;
  insert_date: String;
  update_emp_id: string;
  update_date: string; //Date | null;
  isNew: boolean;
}
