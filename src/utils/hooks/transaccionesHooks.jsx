import { makeGeneralRequests } from "../functions/generalFunctions";
import moment from "moment";
import { useState, useEffect } from "react";
export function useTransacciones(refreshState){
    const [resultado, setResultado] = useState(null);
    async function initialize() {
        const { Txs, TxsCodes, Users } = await makeGeneralRequests(100);
        let validTransactions = Txs.filter((transaction) => {
            if (transaction.codeID) {
                const code = TxsCodes.find((codigo) => codigo.id.S === transaction.codeID.S);
                return code && code.isUsed.BOOL && code.isUserUsed.BOOL;
            } else {
                return (
                    transaction.txType.S === "THIRD_ACCOUNTS" ||
                    transaction.txType.S === "OWN_ACCOUNTS"
                );
            }
        });
        validTransactions = validTransactions.sort((a,b)=> moment(b.updatedAt.S).toDate() - moment(a.updatedAt.S).toDate())
        setResultado({
            transaccionesRecientes: validTransactions,
            usersList: Users,
        })
    }
    
    useEffect(() => {
        initialize();
    }, [refreshState]);

    return resultado;
}
