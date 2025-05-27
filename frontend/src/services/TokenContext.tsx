import React, { Dispatch, useContext, useState, useEffect } from "react";

type TokenContextData =
  | {
      state: "LOGGED_OUT";
    }
  | {
      state: "LOGGED_IN";
      accessToken: string;
      refreshToken: string | null;
    };

const TokenContext = React.createContext<[TokenContextData, Dispatch<TokenContextData>] | null>(null);

export const TokenProvider = ({ children }: React.PropsWithChildren) => {
  // Leer el token de localStorage al iniciar
  const [state, setState] = useState<TokenContextData>(() => {
    const saved = localStorage.getItem("token");
    return saved ? JSON.parse(saved) : { state: "LOGGED_OUT" };
  });

  // Guardar el token en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(state));
  }, [state]);

  return <TokenContext.Provider value={[state, setState]}>{children}</TokenContext.Provider>;
};
// eslint-disable-next-line react-refresh/only-export-components
export function useToken() {
  const context = useContext(TokenContext);
  if (context === null) {
    throw new Error("React tree should be wrapped in TokenProvider");
  }
  return context;
}
