'use client';

import axios from 'axios';

import type { User } from '@/types/user';
import { logger } from '@/lib/default-logger';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  avatar: '/assets/avatar.png',
  user_job_cd: '',
  user_cellphone_first: '',
  user_id: '',
  user_email: '',
  user_name: '',
  user_org_cd: '',
  authgroup_id: '',
  user_cellphone_last: '',
  system_cd: '',
  user_cellphone_middle: '',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  id: string;
  password: string;
}

export interface GetMenuListParams {
  system_cd: string;
  authgroup_id: string;
}

export interface ResetPasswordParams {
  id: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request
    logger.debug('[client.ts]:@@@@signUp@@@@');
    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { id, password } = params;
    //조회
    const resp = await (
      await axios.post('/login/SelectMap', null, { params: { USER_ID: id, USER_PASSWORD: password } })
    ).data;

    if (resp.resultCode === 'OK') {
      if (resp.data.length > 0) {
        const { user_id, user_name, user_email, authgroup_id, system_cd } = resp.data[0];

        user.user_id = user_id;
        user.user_email = user_email;
        user.user_name = user_name;

        user.authgroup_id = authgroup_id;
        user.system_cd = system_cd;

        logger.debug('응답결과:' + resp.data[0].user_name);
      } else {
        return { error: 'Invalid credentials' };
      }
    }

    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    logger.debug('[client.ts]:@@@@getUser@@@@');
    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
