import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
	var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
	return new PrismaClient({
		datasourceUrl: process.env.DATABASE_URL!,
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
	}).$extends(withAccelerate());
};

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
