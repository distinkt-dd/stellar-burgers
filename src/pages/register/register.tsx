import { register } from '@actions';
import { TRegisterData } from '@api';
import { selectUserError, selectUserIsResponse } from '@slices';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const userResponseError = useSelector(selectUserError);
  const userIsResponse = useSelector(selectUserIsResponse);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userResponseError) {
      setError(userResponseError);
    }
  }, [userResponseError]);

  useEffect(() => {
    setError('');
  }, [email, password, userName]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: TRegisterData = {
      email,
      password,
      name: userName
    };

    dispatch(register(payload));
  };

  if (userIsResponse) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
