import React, {useState} from "react";
import { getTransactionalDataFiles } from "../functions/tesoreriaFunctions";
import { ACHCard, BankCard } from "../../features/Tesoreria/components";

export function useTesoreria(refreshState){
    const [resultado, setResultado] = useState(null);
    async function initialize(){
        const {ACHList, FilesList, Users} = await getTransactionalDataFiles();
        FilesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setResultado({
            ACHList,
            FilesList,
            Users
        })
    }

    React.useEffect(()=>{
        initialize();
    }, [refreshState])
    return resultado;
    
}

