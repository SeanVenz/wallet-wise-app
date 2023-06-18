import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const PrivateRoute = ({ children, ...rest }) => {
  const [user, loading] = useAuthState(auth);

  return (
    <Route {...rest}>
      {!loading && user ? children : <Navigate to='/login' />}
    </Route>
  );
};

export default PrivateRoute;
