import React, {useState} from "react";
import { getDataFiles } from "../functions/archivosFunctions";

export function useArchivos(refreshState){
    const [resultado, setResultado] = useState(null);
    async function initialize(){
        const {FilesList} = await getDataFiles();
        FilesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setResultado({
            FilesList,
        })
    }

    React.useEffect(()=>{
        initialize();
    }, [refreshState])
    return resultado;
    
}

