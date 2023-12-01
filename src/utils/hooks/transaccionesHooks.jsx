import { makeGeneralRequests } from "../functions/generalFunctions";
import moment from "moment";
import React, { useState, useEffect } from "react";

export function useInitializationDataProcess(resultado, buscador, from, setInformationList){
    async function process(){
        if (resultado != null || resultado != undefined) {
            const original = resultado.transaccionesRecientes;
            let toSend = [];
            const usuarios = resultado.usersList;
            original.forEach(element => {
                const data = JSON.parse(element.txValues.S)
                let receipt = data.bankAccountToSend
                let gettedReceipt
                if (element.receiptID) {
                    gettedReceipt = usuarios.find(user => element.receiptID.S === user.id.S);
                }

                toSend.push({
                    ...element,
                    shipping: usuarios.find(user => element.shippingID.S === user.id.S),
                    receipt: element.receiptID ? gettedReceipt ? gettedReceipt : { nickname: { S: "Desconocido" }, alpha3Code: { S: "????" } } : receipt,
                })
            })


            if (buscador.length >= 3) {
                toSend = toSend.filter(tx => (tx.shipping && (tx.shipping.nickname.S.toLowerCase().includes(buscador.toLowerCase()) || tx.shipping.fullName.S.toLowerCase().includes(buscador.toLowerCase())) || (tx.receipt && ((tx.receipt.nickname && (tx.receipt.nickname.S.toLowerCase().includes(buscador.toLowerCase()) || tx.receipt.fullName.S.toLowerCase().includes(buscador.toLowerCase()))) || tx.receipt.name && tx.receipt.name.toLowerCase().includes(buscador.toLowerCase())))))
            }
            if (from.trim().length != 0) {
                toSend = toSend.filter(tx => (tx.shipping && tx.shipping.alpha3Code.S === from.trim()))
            }
            setInformationList(toSend);
        }

    }

    React.useEffect(()=> {
        process();
    }, [resultado, buscador, from])
    
}

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
