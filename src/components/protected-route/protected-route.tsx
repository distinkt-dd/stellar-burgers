import { selectIsAuthChecked, selectUser } from '@slices';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type PropsProtectedRoute = {
  onlyUnAuth?: boolean;
  children: JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: PropsProtectedRoute) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return children;
};
