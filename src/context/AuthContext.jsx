import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../config/firebase.js";

import { exchangeFirebaseToken, } from "../services/auth-api.service.js";

import {loginUser, 
        logoutUser,
        createUser,
      } from "../services/auth.service.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] =useState(null);
  const [IdToken,setidToken]=useState(null);
  const [accessToken, setAccessToken]=
    useState(()=>{
      sessionStorage.getItem("access_token")
    });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async(currentUser) => {
          try{
            // setUser(currentUser);
            // console.log("currentUser:",currentUser)
            setLoading(true);
            
            if(!currentUser){
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

            console.log("CurrentUser:",response.user);  
            setUser(response.user);

            console.log("user useEffect:",user)
            
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
          } finally{
            setLoading(false);
          }
        }
      );

    return unsubscribe;
  }, []);

  const login = async (
    email, password
  )=>{
    setLoading(true);
    const {
      firebaseUser,
      idToken
    } = await loginUser(email, password);

    const response = await exchangeFirebaseToken(idToken);
    console.log("response login:",response);
    
    console.log("login id token:",idToken);

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
    email, password,obj
  )=>{
    setLoading(true);
    const {
      firebase_user,
      idToken
    } = await createUser(email, password,obj);
    console.log("createFirebaseUser id token:",idToken);
    console.log("createFirebaseUser firebaseUser:",firebase_user);

    setidToken(idToken);

    // const response = await exchangeFirebaseToken(idToken);
    // console.log("response createFirebaseUser:",response);
    // setUser(response.user);
    // setAccessToken(response.access_token);
    // sessionStorage.setItem("access_token", response.access_token);

    return {
      firebase_user,
      // user: response.user,
      // idToken,
    };
  }  

  const logout=async()=>{
    setLoading(true);
    await logoutUser();

    setUser(null);
    setAccessToken(null);

    sessionStorage.removeItem("access_token");
  }
  console.log("user UseEffect098:",user);
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

  if(!context){
    throw new Error(
      "useAuth must be user inside Authprovivder"
    );
  }
  return context;
};