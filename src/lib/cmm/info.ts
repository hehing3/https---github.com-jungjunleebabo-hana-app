'use client';

import axios from 'axios';

export interface ComCode {
  code_id: string;
  code_nm: string;
  code_value?: string;
  code_comment?: string;
  code_seq?: string;
  use_yn?: string;
  insert_date?: String;
  insert_emp_id?: string;
  update_date?: string; //Date | null;
  update_emp_id?: string;
  parent_id?: string;
}

class CommonClient {
  async getCommonCode(params: String): Promise<{ data?: ComCode[] | null; error?: string }> {
    try {
      //조회
      const resp = await (await axios.get(`/cmm/DetailSelectMap?CODE_ID_LIST=${params}`)).data;
      return { data: resp };
    } catch (errorMSg) {
      return { error: 'getCommonCodeError:' + errorMSg };
    }
  }
}
export const commonClient = new CommonClient();
