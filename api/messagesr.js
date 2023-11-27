// api/messages.ts
import { getConnectedUser, triggerNotConnected } from "../lib/session";
import { kv } from "@vercel/kv";
import { BEARER } from "../src/model/common";

export default async (request, response) => {
    try {
        // Vérifier si l'utilisateur est connecté
        const headers = new Headers(request.headers);
        headers.set('Authorization', BEARER.token);

        const senderUser = await getConnectedUser(request);
        if (!senderUser) {
            console.log("Not connected");
            triggerNotConnected(response);
            return; // Arrêter l'exécution si l'utilisateur n'est pas connecté
        }

        const { nomsalon } = request.query || {}; // Utiliser nomsalon à la place de recipient

        // Construire la clé de conversation du salon
        const conversationKey = `salon:${nomsalon}`;
        console.log("conversationKey : " + conversationKey);

        // Récupérer la liste des messages du salon
        const messages = await kv.lrange(conversationKey, 0, -1);

        console.log('Messages parsed:', messages);

        // Renvoyer la liste des messages en réponse
        response.status(200).json(messages);
    } catch (error) {
        console.error('Error handling message request:', error);
        response.status(500).json(error);
    }
};
