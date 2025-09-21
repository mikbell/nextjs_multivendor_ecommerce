export interface DashboardSidebarMenuInterface {
	label: string;
	icon: string;
	link: string;
}
import type { getAllSubCategories } from "@/queries/subCategory";

export type SubCategoryWithCategoryType = NonNullable<
	Awaited<ReturnType<typeof getAllSubCategories>>
>[number];
