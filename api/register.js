import { db } from '@vercel/postgres';
import { kv } from "@vercel/kv";
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { username, email, password } = await request.json();

        // Contrôler que tous les champs sont bien renseignés
        if (!username || !email || !password) {
            const error = { code: "BAD_REQUEST", message: "Tous les champs doivent être renseignés" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Vérifier qu'il n'existe pas déjà un utilisateur avec le même username ou le même email
        const client = await db.connect();
        const checkUser = await client.sql`SELECT * FROM users WHERE username = ${username} OR email = ${email}`;
        if (checkUser.rowCount > 0) {
            const error = { code: "CONFLICT", message: "Un utilisateur avec le même username ou email existe déjà" };
            return new Response(JSON.stringify(error), {
                status: 409,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Hasher le mot de passe
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        // Générer un external_id
        const externalId = crypto.randomUUID().toString();

        // Enregistrer le tout en base
// ...

// Enregistrer le tout en base
        const { rowCount, rows } = await client.sql`INSERT INTO users (username, email, password, external_id, created_on) VALUES (${username}, ${email}, ${hashed64}, ${externalId}, NOW()) RETURNING user_id`;

// ...

        if (rowCount === 1) {
            const user = { id: rows[0].user_id, username, email, externalId };
            const token = crypto.randomUUID().toString();

            // Mettez en cache les informations de l'utilisateur
            await kv.set(token, user, { ex: 3600 });

            // Mettez à jour la table des utilisateurs dans le cache
            const userInfo = {};
            userInfo[user.id] = user;
            await kv.hset("users", userInfo);

            return new Response(JSON.stringify({ token, username, externalId, id: user.id }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            const error = { code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de l'enregistrement de l'utilisateur" };
            return new Response(JSON.stringify(error), {
                status: 500,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ code: "INTERNAL_SERVER_ERROR", message: "Erreur interne du serveur" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
