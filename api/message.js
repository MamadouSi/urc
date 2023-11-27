// api/message.ts
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

        // Extraire les données du corps de la requête
        const { recipient, content } = request.body || {};

        // Vérifier si les champs nécessaires sont présents
        if (!recipient || !content) {
            const error = {
                code: "BAD_REQUEST",
                message: "Les champs sender, recipient et content sont requis",
            };
            return response.status(400).json(error);
        }

        // Comparer les IDs des utilisateurs et trier
        const userIds = [senderUser.id, recipient].sort();
        const conversationKey = `conversation:${userIds[0]}:${userIds[1]}`;
        console.log("conversationKey : " + conversationKey);

        // Construire le nouveau message avec un horodatage
        const newMessage = {
            senderUser,
            recipient,
            content,
            timestamp: new Date().toISOString(),
        };

        // Utiliser LPUSH pour ajouter le nouveau message au début de la liste
        await kv.lpush(conversationKey, JSON.stringify(newMessage));

        // Définir une durée de vie pour la conversation (24 heures)
        await kv.expire(conversationKey, 86400);

        // Afficher des logs détaillés de la requête et du nouveau message
        console.log('New message added:', newMessage);

        // Ajouter le token d'autorisation dans l'en-tête de la réponse
        response.send("OK", {
            headers: headers,
        });
    } catch (error) {
        console.error('Error handling message request:', error);
        response.status(500).json(error);
    }
};
