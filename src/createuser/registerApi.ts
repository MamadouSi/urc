import { Session, SessionCallback, ErrorCallback} from "../model/common";
import { CustomError } from "../model/CustomError";

export function registerUser(user: {
    password: string;
    email: string;
    username: string
}, onResult: SessionCallback, onError: ErrorCallback) {
    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then(async (response) => {
            if (response.ok) {
                const session = await response.json() as Session;
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('externalId', session.externalId);
                sessionStorage.setItem('username', session.username || "");
                onResult(session);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        })
        .catch((error) => {
            console.error("Error during registration:", error);
        });
}
