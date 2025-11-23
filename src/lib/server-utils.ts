"use server";

import { Prisma } from "@prisma/client";
import { db } from "./db";

// Helper function to generate a unique slug (restricted to used models)
type SlugModels = "product" | "productVariant";

export const generateUniqueSlug = async (
    baseSlug: string,
    model: SlugModels,
    field: string = "slug",
    separator: string = "-"
): Promise<string> => {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
        const existingRecord =
            model === "product"
                ? await db.product.findFirst({
                      where: { [field]: slug } as Prisma.ProductWhereInput,
                  })
                : await db.productVariant.findFirst({
                      where: { [field]: slug } as Prisma.ProductVariantWhereInput,
                  });
        if (!existingRecord) {
            break;
        }
        slug = `${slug}${separator}${suffix}`;
        suffix += 1;
    }
    return slug;
};
