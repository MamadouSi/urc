import { SessionCallback, ErrorCallback } from "../model/common";
import { CustomError } from "../model/CustomError";

export function createRoom(room: {
    createdBy: number | null;
    name: string
}, onResult: SessionCallback, onError: ErrorCallback) {
    fetch("/api/registerroom", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
    })
        .then(async (response) => {
            if (response.ok) {
                const roomData = await response.json();
                onResult(roomData);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        })
        .catch((error) => {
            console.error("Error during room creation:", error);
        });
}
