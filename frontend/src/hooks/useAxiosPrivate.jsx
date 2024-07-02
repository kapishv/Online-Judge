import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const navigate = useNavigate();
    const location = useLocation();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  const fetchWithHandling = (method, url, data = null, config = {}) => {
    let isMounted = true;
    const controller = new AbortController();
    config.signal = controller.signal;

    if ((method === 'get' || method === 'delete') && data) {
      const queryParams = new URLSearchParams(data).toString();
      if (queryParams) {
        url = `${url}?${queryParams}`;
      }
    }

    const makeRequest = async () => {
      try {
        const response = await axiosPrivate[method](url, data, config);
        if (isMounted) {
          return response.data;
        }
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    const cleanup = () => {
      isMounted = false;
      controller.abort();
    };

    return { makeRequest, cleanup };
  };

  const get = (url, data, config = {}) => fetchWithHandling('get', url, data, config);
  const post = (url, data, config = {}) => fetchWithHandling('post', url, data, config);
  const put = (url, data, config = {}) => fetchWithHandling('put', url, data, config);
  const del = (url, data, config = {}) => fetchWithHandling('delete', url, data, config);

  return { get, post, put, del };
};

export default useAxiosPrivate;
