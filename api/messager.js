// api/messager.js
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

        // Extraire le nom du salon à partir des paramètres de la requête
        const nomdusalon = request.query.nomsalon;

        // Extraire les données du corps de la requête
        const { recipient, content } = request.body || {};

        // Vérifier si les champs nécessaires sont présents
        if (!nomdusalon || !recipient || !content) {
            const error = {
                code: "BAD_REQUEST",
                message: "Les champs nomdusalon, recipient et content sont requis",
            };
            return response.status(400).json(error);
        }

        // Utiliser le nom du salon comme clé pour la conversation
        const conversationKey = `salon:${nomdusalon}`;
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

        // Répondre avec un statut 200 et le message "OK"
        response.status(200).send("OK", {
            headers: headers,
        });
    } catch (error) {
        console.error('Error handling message request:', error);
        response.status(500).json(error);
    }
};
