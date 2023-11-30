import React, { createContext, useState, useContext } from 'react';
const CustomContext = createContext();


export const CustomProvider = ({ children }) => {

    const [informationList, setInformationList] = useState([])

    return (
        <CustomContext.Provider value={{
            setInformationList,
            informationList
        }}>
            {children}
        </CustomContext.Provider>
    );
};



export default function useCustomContext() {
    const context = useContext(CustomContext);
    if (!context) {
        throw new Error('useCustomContext debe usarse dentro de un proveedor CustomProvider');
    }
    return context;
}
