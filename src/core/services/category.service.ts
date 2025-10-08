import { db } from "@/lib/db";
import { 
  Category, 
  SubCategory, 
  CategoryWithSubCategories 
} from "@/core/types";
import { 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  PaginatedResponse 
} from "@/core/types";
import { Prisma } from "@prisma/client";
import { randomBytes } from 'crypto';

// Simple ID generation function
const generateId = () => {
  return randomBytes(12).toString('base64url');
};

export class CategoryService {
  /**
   * Get all categories with optional pagination and filtering
   */
  static async getCategories(params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Category>> {
    const { page = 1, limit = 10, featured, search } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.categoryWhereInput = {
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      })
    };

    const [categories, totalCount] = await Promise.all([
      db.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.category.count({ where })
    ]);

    return {
      data: categories,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1
    };
  }

  /**
   * Get category by ID or slug
   */
  static async getCategoryByIdOrSlug(
    idOrSlug: string
  ): Promise<Category | null> {
    return db.category.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      }
    });
  }

  /**
   * Get category with subcategories
   */
  static async getCategoryWithSubCategories(
    idOrSlug: string
  ): Promise<CategoryWithSubCategories | null> {
    const category = await db.category.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      }
    });

    if (!category) {
      return null;
    }

    const subCategories = await db.subcategory.findMany({
      where: {
        categoryId: category.id
      },
      orderBy: {
        name: 'asc'
      }
    });

    return {
      ...category,
      subCategories
    } as CategoryWithSubCategories;
  }

  /**
   * Create new category
   */
  static async createCategory(data: CreateCategoryRequest): Promise<Category> {
    // Check if slug is unique
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          { url: data.url }
        ]
      }
    });

    if (existingCategory) {
      throw new Error('Categoria con questo slug o URL già esistente');
    }

    return db.category.create({
      data: {
        name: data.name,
        image: data.image?.[0]?.url || '', // Take first image
        url: data.url,
        slug: data.slug,
        description: data.description,
        featured: data.featured
      }
    });
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string,
    data: Partial<UpdateCategoryRequest>
  ): Promise<Category> {
    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      throw new Error('Categoria non trovata');
    }

    // Check slug uniqueness if updating
    if (data.slug && data.slug !== existingCategory.slug) {
      const slugExists = await db.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { OR: [{ slug: data.slug }, { url: data.url }] }
          ]
        }
      });

      if (slugExists) {
        throw new Error('Categoria con questo slug o URL già esistente');
      }
    }

    return db.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.image?.[0]?.url && { image: data.image[0].url }),
        ...(data.url && { url: data.url }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description && { description: data.description }),
        ...(data.featured !== undefined && { featured: data.featured }),
        updatedAt: new Date()
      }
    });
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<void> {
    // Check if category has subcategories
    const subCategoriesCount = await db.subcategory.count({
      where: { categoryId: id }
    });

    if (subCategoriesCount > 0) {
      throw new Error('Impossibile eliminare categoria con sottocategorie associate');
    }

    // Check if category has products
    const productsCount = await db.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      throw new Error('Impossibile eliminare categoria con prodotti associati');
    }

    await db.category.delete({
      where: { id }
    });
  }

  /**
   * Get subcategories by category
   */
  static async getSubCategoriesByCategory(
    categoryId: string,
    params?: {
      page?: number;
      limit?: number;
      featured?: boolean;
    }
  ): Promise<PaginatedResponse<SubCategory>> {
    const { page = 1, limit = 10, featured } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.subcategoryWhereInput = {
      categoryId,
      ...(featured !== undefined && { featured })
    };

    const [subCategories, totalCount] = await Promise.all([
      db.subcategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      db.subcategory.count({ where })
    ]);

    return {
      data: subCategories,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1
    };
  }

  /**
   * Create subcategory
   */
  static async createSubCategory(
    data: CreateSubCategoryRequest
  ): Promise<SubCategory> {
    // Check if parent category exists
    const categoryExists = await db.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!categoryExists) {
      throw new Error('Categoria padre non trovata');
    }

    // Check slug uniqueness
    const existingSubCategory = await db.subcategory.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          { url: data.url }
        ]
      }
    });

    if (existingSubCategory) {
      throw new Error('Sottocategoria con questo slug o URL già esistente');
    }

    return db.subcategory.create({
      data: {
        id: generateId(),
        name: data.name,
        image: data.image?.[0]?.url || '',
        url: data.url,
        slug: data.slug,
        description: data.description,
        featured: data.featured,
        categoryId: data.categoryId,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Get featured categories
   */
  static async getFeaturedCategories(limit = 8): Promise<Category[]> {
    return db.category.findMany({
      where: { featured: true },
      take: limit,
      orderBy: { name: 'asc' }
    });
  }
}