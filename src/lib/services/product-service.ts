import { ProductRepository, ProductWithVariants, ProductFilter } from '@/lib/repositories/product-repository';
import { PaginationOptions, PaginatedResult } from '@/lib/database/base-repository';
import { db } from '@/lib/database/connection';
import { logger } from '@/lib/logger';
import { Product, Prisma } from '@prisma/client';
import slugify from 'slugify';

export interface CreateProductData {
  name: string;
  description: string;
  brand: string;
  categoryId: string;
  subCategoryId: string;
  storeId: string;
  offerTagId?: string;
  shippingFeeMethod?: 'ITEM' | 'WEIGHT' | 'FIXED';
  freeShippingForAllCountries?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  brand?: string;
  categoryId?: string;
  subCategoryId?: string;
  offerTagId?: string;
  shippingFeeMethod?: 'ITEM' | 'WEIGHT' | 'FIXED';
  freeShippingForAllCountries?: boolean;
}

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository(db);
  }

  async getProductById(id: string): Promise<ProductWithVariants | null> {
    try {
      const product = await this.productRepository.findById(id);
      
      if (product) {
        // Increment views count
        await this.productRepository.incrementViews(id);
      }
      
      return product;
    } catch (error) {
      logger.error(`Error getting product by id ${id}:`, error);
      throw new Error('Failed to retrieve product');
    }
  }

  async getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
    try {
      const product = await this.productRepository.findBySlug(slug);
      
      if (product) {
        // Increment views count
        await this.productRepository.incrementViews(product.id);
      }
      
      return product;
    } catch (error) {
      logger.error(`Error getting product by slug ${slug}:`, error);
      throw new Error('Failed to retrieve product');
    }
  }

  async getProducts(options: PaginationOptions & ProductFilter): Promise<PaginatedResult<ProductWithVariants>> {
    try {
      return await this.productRepository.findAll(options);
    } catch (error) {
      logger.error('Error getting products:', error);
      throw new Error('Failed to retrieve products');
    }
  }

  async getFeaturedProducts(limit = 8): Promise<ProductWithVariants[]> {
    try {
      return await this.productRepository.findFeatured(limit);
    } catch (error) {
      logger.error('Error getting featured products:', error);
      throw new Error('Failed to retrieve featured products');
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      // Generate unique slug
      const baseSlug = slugify(data.name, { lower: true, strict: true });
      const slug = await this.generateUniqueSlug(baseSlug);

      const productData: Prisma.ProductCreateInput = {
        ...data,
        slug,
        rating: 0,
        numReviews: 0,
        views: 0,
        sales: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.productRepository.create(productData);
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    try {
      const updateData: Prisma.ProductUpdateInput = {
        ...data,
        updatedAt: new Date(),
      };

      // If name is being updated, regenerate slug
      if (data.name) {
        const baseSlug = slugify(data.name, { lower: true, strict: true });
        updateData.slug = await this.generateUniqueSlug(baseSlug, id);
      }

      return await this.productRepository.update(id, updateData);
    } catch (error) {
      logger.error(`Error updating product ${id}:`, error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      // Check if product has any orders (business rule)
      const orderCount = await db.orderitem.count({
        where: { productId: id }
      });

      if (orderCount > 0) {
        throw new Error('Cannot delete product with existing orders');
      }

      await this.productRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting product ${id}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete product');
    }
  }

  async searchProducts(query: string, filters?: ProductFilter): Promise<ProductWithVariants[]> {
    try {
      const searchOptions: ProductFilter = {
        ...filters,
        search: query
      };

      const result = await this.productRepository.findAll({
        ...searchOptions,
        limit: 20 // Limit search results
      });

      return result.data;
    } catch (error) {
      logger.error(`Error searching products with query "${query}":`, error);
      throw new Error('Failed to search products');
    }
  }

  async updateProductRating(productId: string): Promise<void> {
    try {
      // Calculate average rating from reviews
      const reviews = await db.review.findMany({
        where: { productId },
        select: { rating: true }
      });

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await this.productRepository.updateRating(productId, averageRating, reviews.length);
      }
    } catch (error) {
      logger.error(`Error updating rating for product ${productId}:`, error);
      throw new Error('Failed to update product rating');
    }
  }

  async getProductsByStore(storeId: string, options?: PaginationOptions): Promise<PaginatedResult<ProductWithVariants>> {
    try {
      return await this.productRepository.findAll({
        ...options,
        storeId
      });
    } catch (error) {
      logger.error(`Error getting products for store ${storeId}:`, error);
      throw new Error('Failed to retrieve store products');
    }
  }

  async getProductsByCategory(categoryId: string, options?: PaginationOptions): Promise<PaginatedResult<ProductWithVariants>> {
    try {
      return await this.productRepository.findAll({
        ...options,
        categoryId
      });
    } catch (error) {
      logger.error(`Error getting products for category ${categoryId}:`, error);
      throw new Error('Failed to retrieve category products');
    }
  }

  private async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingProduct = await db.product.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } })
        }
      });

      if (!existingProduct) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}