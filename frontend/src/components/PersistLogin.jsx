import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Loading from "./Loading";
import Layout from "./Layout";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, refresh } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!auth?.accessToken) {
        try {
          await refresh();
        } catch (err) {
          console.error(err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    })();

    return () => (isMounted = false);
  }, []);

  return isLoading ? <Loading /> : <Layout />;
};

export default PersistLogin;
