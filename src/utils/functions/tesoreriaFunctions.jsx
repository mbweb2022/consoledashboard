import { callBackend } from "../../services/BackendService";
import { UsersTable } from "../backendUtils.";

export async function getTransactionalDataFiles(){
    const parallelRequests= [
        callBackend({
            type: "scan",
            tableName: UsersTable,
        }),
        callBackend({
            type: "getInfo",
        }),
        callBackend({
            type: "getTXS",
        })
    ]
    const [{ data: Users }, { data: FilesList }, { data: ACHList }] = await Promise.all(parallelRequests);
    return {
        ACHList: ACHList.code,
        FilesList: FilesList.code.information,
        Users: Users.code.information,
    }
}
