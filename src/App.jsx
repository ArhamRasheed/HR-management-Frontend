import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSession } from "./store/slices/authSlice";
import AppLoader from "./components/AppLoader";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(checkSession());
    }
  }, [dispatch, initialized]);

  if (!initialized) {
    return <AppLoader message="verifying" />;
  }

  return <AppRoutes />;
}

export default App;
