import { db } from '@vercel/postgres';
import { kv } from "@vercel/kv";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { name, createdBy } = await request.json();

        // Contrôler que tous les champs sont bien renseignés
        if (!name || !createdBy) {
            const error = { code: "BAD_REQUEST", message: "Tous les champs doivent être renseignés" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Vérifier qu'il n'existe pas déjà un salon avec le même nom
        const client = await db.connect();
        const checkRoom = await client.sql`SELECT * FROM rooms WHERE name = ${name}`;
        if (checkRoom.rowCount > 0) {
            const error = { code: "CONFLICT", message: "Un salon avec le même nom existe déjà" };
            return new Response(JSON.stringify(error), {
                status: 409,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Enregistrer le salon en base
        const { rowCount, rows } = await client.sql`INSERT INTO rooms (name, created_on, created_by) VALUES (${name}, NOW(), ${createdBy}) RETURNING room_id`;

        if (rowCount === 1) {
            const room = { id: rows[0].room_id, name, createdOn: new Date(), createdBy };

            // Mettez en cache les informations du salon si nécessaire

            return new Response(JSON.stringify(room), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            const error = { code: "INTERNAL_SERVER_ERROR", message: "Erreur lors de l'enregistrement du salon" };
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
