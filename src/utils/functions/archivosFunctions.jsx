import { callBackend } from "../../services/BackendService";
export async function getDataFiles(){
    const parallelRequests= [
        callBackend({
            type: "getInfo2",
        }),
    ]
    const [{ data: FilesList }] = await Promise.all(parallelRequests);
    return {
        FilesList: FilesList.code.information,
    }
}
