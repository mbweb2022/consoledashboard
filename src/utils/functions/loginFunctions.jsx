import { passwordPolicy } from "../policies";
import { callBackend } from "../../services/BackendService";
import { UsersTable } from "../backendUtils.";
export async function handleLogin(user, password, setUser, navigate) {
    let response = {
        error: false,
        message: '',
        data: null
    }
    try {
        if (user.trim().length === 0 || password.trim().length === 0) {
            response.error = true;
            response.message = "Usuario o contraseña no pueden estar vacíos.";
            return response;
        }
        if (!passwordPolicy.test(password)) {
            response.error = true;
            response.message = "La contraseña introducida no cumple con la política de contraseñas."
            return response;
        }
        if (user.length < 6) {
            response.error = true;
            response.message = "El usuario introducido es incorrecto."
            return response;
        }
        const { data: loginResponse } = await callBackend(Object.freeze({
            type: "login",
            username: user,
            password: password,
        }));
        if (loginResponse.code.message === "User does not exist.") {
            response.error = true;
            response.message = "El usuario indicado no existe."
            return response;
        } else if (loginResponse.code.message === "Incorrect username or password.") {
            response.error = true;
            response.message = "Usuario o contraseña incorrectos."
            return response;
        } else if (loginResponse.code.message === "User not allowed to sign in.") {
            response.error = true;
            response.message = "No tienes permitido iniciar sesión"
            return response;

        } else if (loginResponse.code.token) {
            localStorage.setItem('ssTk-mb', loginResponse.code.token);
            const { data: userResponse } = await callBackend(Object.freeze({
                type: "scan",
                tableName: UsersTable,
                filterExpression: "nickname = :nickname",
                expressionAttributeValues: {
                    ':nickname': { S: user },
                }
            }));
            localStorage.setItem('ssTk-mb', loginResponse.code.token);
            localStorage.setItem('ssTk-us', JSON.stringify(userResponse.code.information[0]));
            navigate("/dashboard")
            return response;

        } else {
            response.error = true;
            response.message = "Hubo un error temporal, por favor, inténtalo más tarde."
            return response;
        }
    } catch (error) {
        response.error = true;
        response.message = "Hubo un error temporal, por favor, inténtalo más tarde."
        return response;
    }


}   
