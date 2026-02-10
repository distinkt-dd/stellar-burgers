import { login } from '@actions';
import { TLoginData } from '@api';
import { useDispatch } from '@store';
import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const payload: TLoginData = {
      email,
      password
    };
    dispatch(login(payload));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
