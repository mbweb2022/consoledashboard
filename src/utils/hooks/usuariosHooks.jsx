import React, { useState, useEffect } from "react";
import { makeAllUsersInfoRequest } from "../functions/generalFunctions";
import moment from "moment";
export function useUsuarios(refreshState){
    const [resultado, setResultado] = useState(null);
    async function initialize(){
        
        const { UsersVerified, FinancialData, Users } = await makeAllUsersInfoRequest();
        const newUsersArray = Users.filter(user => (!user.role || user.role.S === "mbuser") && (!user.isDeleted || user.isDeleted.BOOL == false))
        newUsersArray.sort((a,b) => moment(b.createdAt.S).toDate() - moment(a.createdAt.S).toDate())
        setResultado({
            usersList: newUsersArray,
            usersVerified: UsersVerified,
            financialData: FinancialData,
        })
    }

    useEffect(() => {
        initialize();
    }, [refreshState]);
    return resultado;
}

export function useInitializationDataProcess(resultado, buscador, setInformationList){
    async function process(){
        if (resultado != null || resultado != undefined){
            let toSend = [];
            const usuarios = resultado.usersList;
            toSend.push(...usuarios)
            if(buscador.length >= 3){
                toSend = usuarios.filter(user => (user.nickname.S.toLowerCase().includes(buscador.toLowerCase())) ||  (user.fullName.S.toLowerCase().includes(buscador.toLowerCase())))
            }
            setInformationList(toSend);
        }

    }
    React.useEffect(()=> {
        process();
    }, [resultado, buscador])
}
