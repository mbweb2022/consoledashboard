import React, { createContext, useState, useContext } from 'react';
import ErrorBox from '../../components/ErrorBox';
import LoadingScreen from '../../components/LoadingScreen';
import DrawerAppBarComponent from '../../components/DrawerAppBarComponent';
import { callBackend } from '../../services/BackendService';
import { useLocation } from 'react-router-dom';
const DashboardContext = createContext();


export const DashboardProvider = ({ children }) => {
  const location = useLocation();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedUser, setLoggedUser] = useState(null)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [refreshState, setRefreshState] = useState(0);

  function refresh(){
      setRefreshState(refreshState+1);
  }

  const handleAutomaticLogin = async (token) => {
    const { data: information } = await callBackend({
      type: "autologin",
      token: token,
    })
    if (!information.error) {
      setLoggedUser(JSON.parse(localStorage.getItem('ssTk-us')))
      return true;
    }
    return false;
  }
  
  return (
    <DashboardContext.Provider value={{
      isLoading,
      setLoading,
      error,
      setError,
      loggedUser,
      setLoggedUser,
      openDrawer,
      setOpenDrawer,
      handleAutomaticLogin,
      refreshState,
      refresh
    }}>
      <LoadingScreen />
      <ErrorBox />
      {
        location.pathname === "/login" || location.pathname === "" ? <> {children}</> : <DrawerAppBarComponent>
          <> {children}</>

        </DrawerAppBarComponent>
      }
    </DashboardContext.Provider>
  );
};



export default function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext debe usarse dentro de un proveedor DashboardProvider');
  }
  return context;
}
