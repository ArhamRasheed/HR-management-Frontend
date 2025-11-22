import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSession } from "./store/slices/authSlice";
import AppLoader from "./components/AppLoader";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();
  const { initialized, isAuthenticated, user } = useSelector((state) => state.auth);

  console.log('🎬 APP.jsx - Component rendering');
  console.log('🎬 APP.jsx - Auth state:', { initialized, isAuthenticated, hasUser: !!user });

  useEffect(() => {
    console.log('🎬 APP.jsx - useEffect triggered, initialized:', initialized);
    if (!initialized) {
      console.log('🎬 APP.jsx - Dispatching checkSession...');
      dispatch(checkSession());
    }
  }, [dispatch, initialized]);

  if (!initialized) {
    console.log('🎬 APP.jsx - Rendering AppLoader (not initialized)');
    return <AppLoader message="verifying" />;
  }

  console.log('🎬 APP.jsx - Rendering AppRoutes');
  return <AppRoutes />;
}

export default App;
