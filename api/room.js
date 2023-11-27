import { sql } from "@vercel/postgres";
import { checkSession, unauthorizedResponse } from "../lib/session";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        if (request.method === "GET") {
            // Récupérer la liste des salons
            const { rowCount, rows } = await sql`SELECT room_id, name, TO_CHAR(created_on, 'DD/MM/YYYY HH24:MI') as created_on FROM rooms ORDER BY created_on DESC`;

            if (rowCount === 0) {
                return new Response("[]", {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
                });
            } else {
                return new Response(JSON.stringify(rows), {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
                });
            }
        } else if (request.method === "POST") {
            // Ajouter un nouveau salon
            const { name } = await request.json();

            if (!name) {
                const error = { code: "BAD_REQUEST", message: "Le nom du salon est requis" };
                return new Response(JSON.stringify(error), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            const createdOn = new Date().toISOString();
            const createdBy = connected.user_id;

            const { rowCount, rows } = await sql`INSERT INTO rooms (name, created_on, created_by) VALUES (${name}, ${createdOn}, ${createdBy}) RETURNING room_id`;

            if (rowCount === 1) {
                return new Response(JSON.stringify({ room_id: rows[0].room_id, name, created_on: createdOn }), {
                    status: 201,
                    headers: { 'content-type': 'application/json' },
                });
            } else {
                const error = { code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de la création du salon" };
                return new Response(JSON.stringify(error), {
                    status: 500,
                    headers: { 'content-type': 'application/json' },
                });
            }
        } else {
            return new Response("Méthode non autorisée", {
                status: 405,
                headers: { 'content-type': 'text/plain' },
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
