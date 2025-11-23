import { db } from "@/lib/db";

export async function getAllCountries() {
	try {
		const countries = await db.country.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return countries;
	} catch (error) {
		console.error("Error fetching countries:", error);
		return [];
	}
}
