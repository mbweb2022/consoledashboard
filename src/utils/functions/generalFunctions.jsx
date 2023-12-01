import { useEffect } from "react";
import { callBackend } from "../../services/BackendService";
import { FinancialDataTable, TransactionsCodesTable, TransactionsTable, UsersTable, UsersVerifiedTable } from "../backendUtils.";

export function getDifference(date1, date2) {
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
}

export function useAuthenticationInit(loggedUser, navigate, handleAutomaticLogin) {
    async function initPage() {
        if (!loggedUser) {
            const token = localStorage.getItem('ssTk-mb');
            if (!await handleAutomaticLogin(token)) {
                navigate('/login')
            }
        }
    }
    useEffect(() => {
        initPage();
    }, []);
}

export async function makeAllUsersInfoRequest() {
    const parallelRequests = [
         callBackend({
            type: "scan",
            tableName: UsersTable,
        }),
         callBackend({
            type: "scan",
            tableName: FinancialDataTable,
        }),
         callBackend({
            type: "scan",
            tableName: UsersVerifiedTable,
        }),
    ]
    const [{ data: Users }, { data: FinancialData }, { data: UsersVerified }] = await Promise.all(parallelRequests);
    return {
        UsersVerified: UsersVerified.code.information,
        FinancialData: FinancialData.code.information,
        Users: Users.code.information,
    }


}

export async function makeGeneralRequests(daysAgo) {
    const DaysAgo = new Date();
    DaysAgo.setDate(DaysAgo.getDate() - daysAgo)
    const parallelRequests = [
        callBackend({
            type: "scan",
            tableName: TransactionsTable,
            filterExpression: "updatedAt >= :val",
            expressionAttributeValues: {
                ":val": { S: DaysAgo.toISOString() }
            }
        }),
        callBackend({
            type: "scan",
            tableName: TransactionsCodesTable,
            filterExpression: "createdAt >= :val",
            expressionAttributeValues: {
                ":val": { S: DaysAgo.toISOString() }
            }
        }),
        callBackend({
            type: "scan",
            tableName: UsersTable,
            filterExpression: 'attribute_exists(identificationNumber) AND attribute_exists(country)',
        })
    ]
    const [{ data: Txs }, { data: TxsCodes }, { data: Users }] = await Promise.all(parallelRequests);
    return {
        Txs: Txs.code.information,
        TxsCodes: TxsCodes.code.information,
        Users: Users.code.information,
    }
}
