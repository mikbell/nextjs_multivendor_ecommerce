import { Product, ProductVariant, PrismaClient, Prisma } from '@prisma/client';
import { BaseRepository, PaginationOptions, PaginatedResult, paginate } from '@/lib/database/base-repository';
import { logger } from '@/lib/logger';

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

export interface ProductFilter {
  categoryId?: string;
  subCategoryId?: string;
  storeId?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  inStock?: boolean;
}

export class ProductRepository extends BaseRepository<Product> {
  async findById(id: string): Promise<ProductWithVariants | null> {
    try {
      return await this.db.product.findUnique({
        where: { id },
        include: {
          variants: {
            include: {
              images: true,
              sizes: true,
              colors: true,
            }
          },
          category: true,
          subCategory: true,
          store: true,
        }
      });
    } catch (error) {
      logger.error(`Error finding product by id ${id}:`, error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<ProductWithVariants | null> {
    try {
      return await this.db.product.findUnique({
        where: { slug },
        include: {
          variants: {
            include: {
              images: true,
              sizes: true,
              colors: true,
            }
          },
          category: true,
          subCategory: true,
          store: true,
        }
      });
    } catch (error) {
      logger.error(`Error finding product by slug ${slug}:`, error);
      throw error;
    }
  }

  async findAll(options?: PaginationOptions & ProductFilter): Promise<PaginatedResult<ProductWithVariants>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        categoryId,
        subCategoryId,
        storeId,
        featured,
        minPrice,
        maxPrice,
        search,
        tags,
        inStock
      } = options || {};

      const where: Prisma.ProductWhereInput = {};

      if (categoryId) where.categoryId = categoryId;
      if (subCategoryId) where.subCategoryId = subCategoryId;
      if (storeId) where.storeId = storeId;
      if (featured !== undefined) where.featured = featured;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (minPrice || maxPrice || inStock) {
        where.variants = {
          some: {
            ...(inStock && {
              sizes: {
                some: {
                  quantity: { gt: 0 }
                }
              }
            }),
            ...(minPrice || maxPrice) && {
              sizes: {
                some: {
                  price: {
                    ...(minPrice && { gte: minPrice }),
                    ...(maxPrice && { lte: maxPrice })
                  }
                }
              }
            }
          }
        };
      }

      const skip = (page - 1) * limit;
      const orderBy = { [sortBy]: sortOrder };

      const [products, total] = await Promise.all([
        this.db.product.findMany({
          where,
          include: {
            variants: {
              include: {
                images: true,
                sizes: true,
                colors: true,
              }
            },
            category: true,
            subCategory: true,
            store: true,
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.count({ where })
      ]);

      return paginate(products, total, page, limit);
    } catch (error) {
      logger.error('Error finding products:', error);
      throw error;
    }
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    try {
      return await this.db.product.create({
        data,
        include: {
          variants: true,
          category: true,
          subCategory: true,
          store: true,
        }
      });
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    try {
      return await this.db.product.update({
        where: { id },
        data,
        include: {
          variants: true,
          category: true,
          subCategory: true,
          store: true,
        }
      });
    } catch (error) {
      logger.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.product.delete({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  async count(options?: { where?: Prisma.ProductWhereInput }): Promise<number> {
    try {
      return await this.db.product.count(options);
    } catch (error) {
      logger.error('Error counting products:', error);
      throw error;
    }
  }

  async findFeatured(limit = 8): Promise<ProductWithVariants[]> {
    try {
      return await this.db.product.findMany({
        where: { featured: true },
        include: {
          variants: {
            include: {
              images: true,
              sizes: true,
              colors: true,
            }
          },
          category: true,
          subCategory: true,
          store: true,
        },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      logger.error('Error finding featured products:', error);
      throw error;
    }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      await this.db.product.update({
        where: { id },
        data: {
          views: {
            increment: 1
          }
        }
      });
    } catch (error) {
      logger.error(`Error incrementing views for product ${id}:`, error);
      throw error;
    }
  }

  async updateRating(id: string, rating: number, numReviews: number): Promise<void> {
    try {
      await this.db.product.update({
        where: { id },
        data: {
          rating,
          numReviews
        }
      });
    } catch (error) {
      logger.error(`Error updating rating for product ${id}:`, error);
      throw error;
    }
  }
}