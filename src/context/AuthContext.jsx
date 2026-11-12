import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../config/firebase.js";

import { exchangeFirebaseToken, } from "../services/auth-api.service.js";

import {
  loginUser,
  logoutUser,
  createUser,
} from "../services/auth.service.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [IdToken, setidToken] = useState(null);
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem("access_token")
  );

  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setAccessToken(null);
      setidToken(null);
      sessionStorage.removeItem("access_token");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          try {
            // setUser(currentUser);
            // console.log("currentUser:",currentUser)
            setLoading(true);

            if (!currentUser) {
              setUser(null);
              setAccessToken(null);

              sessionStorage.removeItem("access_token");

              return;
            }

            const idToken = await currentUser.getIdToken();

            const response =
              await exchangeFirebaseToken(
                idToken
              );

            // setUser(response.user)

            // console.log("CurrentUser:", response.user);
            setUser(response.user);

            // console.log("user useEffect:", user)

            setAccessToken(response.access_token);

            sessionStorage.setItem("access_token", response.access_token);
          } catch (error) {
            console.error(
              "Authentication synchronization failed:",
              error
            );
            setUser(null);
            setAccessToken(null);

            sessionStorage.removeItem("access_token");
          } finally {
            setLoading(false);
          }
        }
      );

    return unsubscribe;
  }, []);


  useEffect(() => {
    if (user?.role !== "school_admin") return;

    const endDate = user?.subscription?.end_date;
    if (!endDate) return;

    const expiryTime = new Date(endDate).getTime();

    if (Number.isNaN(expiryTime)) {
      console.error("Invalid subscription end date:", endDate);
      return;
    }

    const checkExpiry = () => {
      const remainingTime = expiryTime - Date.now();
      // console.log("Remaining Time", remainingTime)
      
      if (remainingTime <= 0) {
        void logout();
        return;
      }

      // Recheck at most once per hour, avoiding excessively long timers.
      timeoutId = setTimeout(
        checkExpiry,
        Math.min(remainingTime, 60 * 60 * 1000)
      );
    };

    let timeoutId;

    checkExpiry();

    return () => clearTimeout(timeoutId);
  }, [user, logout]);




  const login = async (
    email, password
  ) => {
    setLoading(true);
    const {
      // firebaseUser,
      idToken
    } = await loginUser(email, password);

    const response = await exchangeFirebaseToken(idToken);
    // console.log("response login:", response);

    // console.log("login id token:", idToken);

    setUser(response.user);
    setAccessToken(response.access_token);
    sessionStorage.setItem("access_token", response.access_token);

    return {
      // firebaseUser,
      user: response.user,
      accessToken: response.access_token,
    };
  }

  const createFirebaseUser = async (
    email, password, obj
  ) => {
    setLoading(true);
    const {
      firebase_user,
      idToken
    } = await createUser(email, password, obj);
    // console.log("createFirebaseUser id token:", idToken);
    // console.log("createFirebaseUser firebaseUser:", firebase_user);
    setidToken(idToken);

    return {
      firebase_user,
    };
  }



  // console.log("user UseEffect098:", user);







  return (
    <AuthContext.Provider value={
      {
        user,
        setUser,
        setAccessToken,
        accessToken,
        loading,
        IdToken,
        setLoading,
        login,
        createFirebaseUser,
        logout
      }
    }>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be user inside Authprovivder"
    );
  }
  return context;
};