import { login } from '@actions';
import { TLoginData } from '@api';
import { selectUserError, selectUserIsResponse } from '@slices';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const userResponseError = useSelector(selectUserError);
  const userIsResponse = useSelector(selectUserIsResponse);
  useEffect(() => {
    if (userResponseError) {
      setError(userResponseError);
    }
  }, [userResponseError]);

  useEffect(() => {
    setError('');
  }, [email, password]);

  const dispatch = useDispatch();
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: TLoginData = {
      email,
      password
    };

    dispatch(login(payload));
  };

  if (userIsResponse) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
