import axios from "axios";

export async function callBackend(props) {
    return await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', props);
}
