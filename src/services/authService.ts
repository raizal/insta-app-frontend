import axios from '@/lib/axios';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export const register = async (params: RegisterParams) => {
  try {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('email', params.email);
    formData.append('password', params.password);
    formData.append('password_confirmation', params.password_confirmation);

    const response = await axios.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (params: LoginParams) => {
  try {
    const formData = new FormData();
    formData.append('email', params.email);
    formData.append('password', params.password);

    const response = await axios.post('/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}; 