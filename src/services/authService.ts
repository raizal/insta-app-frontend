import axios from '@/lib/axios';
import { User, WithCsrfToken } from '@/types/common';

interface RegisterParams extends WithCsrfToken {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  image?: File;
}

interface LoginParams extends WithCsrfToken {
  email: string;
  password: string;
}

export const me = async () => {
    const response = await axios.get<{ user: User }>('/web/user', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return response.data.user;
};

export const register = async (params: RegisterParams) => {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('username', params.username);
    formData.append('email', params.email);
    formData.append('password', params.password);
    formData.append('password_confirmation', params.password_confirmation);
    if (params.image) {
      formData.append('profile_picture', params.image);
    }

    const response = await axios.post('/web/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data.user;
};

export const login = async (params: LoginParams) => {
    const response = await axios.post('/web/login', { ...params, login: params.email }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return response.data.user;
}; 