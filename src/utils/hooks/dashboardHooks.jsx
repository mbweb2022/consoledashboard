import { useEffect, useState } from 'react';
import { getDifference } from '../functions/generalFunctions';
import moment from 'moment/moment';
import { makeGeneralRequests } from '../functions/generalFunctions';

export function useDashboard() {
    const [resultado, setResultado] = useState();
    const today = new Date();
    async function initialize() {
        const { Txs, TxsCodes, Users } = await makeGeneralRequests(31);
        const usuariosRegistrados = Users.filter(user => getDifference(moment(user.createdAt.S).toDate(), today) <= 31).length;
        const validTransactions = Txs.filter((transaction) => {
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
        validTransactions.sort((a,b) => moment(b.updatedAt.S).toDate() - moment(a.updatedAt.S).toDate())
        let moneyUSAtoECU = 0;
        let moneyECUtoUSA = 0;
        validTransactions.forEach(transaction => {
            const shipping = Users.find((user) => user.id.S === transaction.shippingID.S);
            if (!shipping || !shipping.alpha3Code) return;
            const isFromUSA = shipping.alpha3Code.S === "USA" ? true : false;
            const dataTransaction = JSON.parse(transaction.txValues.S);
            if (!transaction.codeID && (transaction.txType.S === "THIRD_ACCOUNTS" || transaction.txType.S === "OWN_ACCOUNTS")) {
                const receipt = dataTransaction.bankAccountToSend;
                if (receipt && receipt.country === (isFromUSA ? "ECU" : "USA")) {
                    let amount = parseFloat(transaction.txType.S === "THIRD_ACCOUNTS" ? transaction.amount.N : transaction.amountDeposit.N);

                    if (isFromUSA) {
                        moneyUSAtoECU += amount;
                    } else {
                        moneyECUtoUSA += amount;
                    }
                }
            } else if (transaction.codeID) {
                const receipt = Users.find((user) => user.id.S === transaction.receiptID.S);
                if (receipt && receipt.alpha3Code) {
                    const isToUSA = receipt.alpha3Code.S === "USA" ? true : false;
                    if (isFromUSA !== isToUSA) {
                        let amount = parseFloat(transaction.txType.S === "THIRD_ACCOUNTS" ? transaction.amount.N : transaction.amountDeposit.N);

                        if (isFromUSA) {
                            moneyUSAtoECU += amount;
                        } else {
                            moneyECUtoUSA += amount;
                        }
                    }
                }
            }
        })
        setResultado({
            usuariosRegistrados,
            moneyUSAtoECU: parseFloat(moneyUSAtoECU).toFixed(2),
            moneyECUtoUSA: parseFloat(moneyECUtoUSA).toFixed(2),
            usersList: Users,
            transaccionesRecientes: validTransactions,
        })
    }

    useEffect(() => {
        initialize();
    }, []);

    return resultado;
}
