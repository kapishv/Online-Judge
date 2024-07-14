import { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import Loading from "./Loading";
import Layout from "./Layout";

const PersistLogin = () => {
  const { auth, refresh } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isMounted.current) return;
      isMounted.current = true;
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (!auth?.accessToken) {
      verifyAuth();
    }
  }, [auth, refresh]);

  return loading ? <Loading /> : <Layout />;
};

export default PersistLogin;
