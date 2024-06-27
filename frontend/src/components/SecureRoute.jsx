import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const SecureRoute = ({ roleMap, DefaultComp }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
  const roles = decoded?.UserInfo?.roles || [];
  const userRole = roles.find((role) => roleMap.has(role));
  const Comp = userRole ? roleMap.get(userRole) : DefaultComp;

  return <Comp />;
};

export default SecureRoute;
