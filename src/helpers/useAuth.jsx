import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useGetAuthenticatedUser,
  useSetAuthenticatedUser,
} from "../hooks/api/useAuthenticatedUser";
import { useCustomerRenewToken } from "../hooks/api/useCustomer";
import { getToken, removeToken, saveToken } from "./authToken";

let AuthContext = createContext({
  authToken: "",
  setAuthToken: () => {},
});

export function Provider(props) {
  let [token, setToken] = useState("");
  let { data: userData } = useGetAuthenticatedUser();
  let expiresAt = new Date(userData?.authenticatedUser.expiresAt || "");
  let expiresLimit = new Date(userData?.authenticatedUser.expiresAt || "");
  let now = new Date();
  expiresAt.setDate(expiresAt.getDate() - 7);

  let { setUser } = useSetAuthenticatedUser();

  let { renewToken } = useCustomerRenewToken({
    variables: { customerAccessToken: token },
    onCompleted: ({ customerAccessTokenRenew }) => {
      if (
        customerAccessTokenRenew &&
        customerAccessTokenRenew.customerAccessToken
      ) {
        let { accessToken, expiresAt } =
          customerAccessTokenRenew.customerAccessToken;
        setToken(accessToken);
        if (userData && userData) {
          setUser({
            variables: {
              user: {
                ...userData?.authenticatedUser,
                expiresAt: expiresAt,
              },
            },
          });
        }
      }
    },
    onError: () => {},
  });

  useEffect(() => {
    getToken().then((token) => {
      if (now > expiresAt && now <= expiresLimit) {
        renewToken();
      } else {
        removeToken();
      }
      setToken(token || "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let context = useMemo(
    () => ({
      authToken: token,
      setAuthToken: (token) => {
        setToken(token);
        if (!token) {
          removeToken();
        } else {
          saveToken(token);
        }
      },
    }),
    [token, setToken]
  );
  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
