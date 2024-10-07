import FormDataToJson from "$lib/utils/FormDataToJson.js";
import { redirect } from "@sveltejs/kit";
import db from "$lib/server/database";
import { propertiesTable } from "$lib/server/schema.js";
import { eq } from "drizzle-orm";
import { Routes } from "$lib/constants/routes";

export const load = async ({ parent, params }) => {
    await parent();

    const [property] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, +params.id));

    if (!property) {
        throw redirect(303, Routes.properties);
    }

    return { property };
};

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const { id, name, address, city, rent, condo_fees, taxes, postalCode } = FormDataToJson(data);

        try {
            await db.update(propertiesTable).set({
                name,
                address,
                city,
                rent: +rent,
                condo_fees: +condo_fees,
                taxes: +taxes,
                postalCode,
            }).where(eq(propertiesTable.id, +id));
        } catch (err) {
            return {
                message: 'eerr' + err,
                success: false,
                status: 400
            };
        }

        throw redirect(303, Routes.properties);
    }
};