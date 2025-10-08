import { User, Prisma, user_role } from '@prisma/client';
import { BaseRepository, PaginationOptions, PaginatedResult, paginate } from '@/lib/database/base-repository';
import { logger } from '@/lib/logger';

export interface UserWithStats extends User {
  _count?: {
    orders?: number;
    reviews?: number;
    wishlist?: number;
    stores?: number;
  };
}

export interface UserFilter {
  role?: user_role;
  email?: string;
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export class UserRepository extends BaseRepository<User> {
  async findById(id: string): Promise<UserWithStats | null> {
    try {
      return await this.db.user.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlist: true,
              stores: true,
            }
          }
        }
      });
    } catch (error) {
      logger.error(`Error finding user by id ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserWithStats | null> {
    try {
      return await this.db.user.findUnique({
        where: { email },
        include: {
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlist: true,
              stores: true,
            }
          }
        }
      });
    } catch (error) {
      logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  async findAll(options?: PaginationOptions & UserFilter): Promise<PaginatedResult<UserWithStats>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        role,
        email,
        search,
        createdAfter,
        createdBefore
      } = options || {};

      const where: Prisma.UserWhereInput = {};

      if (role) where.role = role;
      if (email) where.email = { contains: email, mode: 'insensitive' };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }
      if (createdAfter || createdBefore) {
        where.createdAt = {};
        if (createdAfter) where.createdAt.gte = createdAfter;
        if (createdBefore) where.createdAt.lte = createdBefore;
      }

      const skip = (page - 1) * limit;
      const orderBy = { [sortBy]: sortOrder };

      const [users, total] = await Promise.all([
        this.db.user.findMany({
          where,
          include: {
            _count: {
              select: {
                orders: true,
                reviews: true,
                wishlist: true,
                stores: true,
              }
            }
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.count({ where })
      ]);

      return paginate(users, total, page, limit);
    } catch (error) {
      logger.error('Error finding users:', error);
      throw error;
    }
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.db.user.create({
        data
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.db.user.update({
        where: { id },
        data
      });
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.user.delete({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  async count(options?: { where?: Prisma.UserWhereInput }): Promise<number> {
    try {
      return await this.db.user.count(options);
    } catch (error) {
      logger.error('Error counting users:', error);
      throw error;
    }
  }

  async updateRole(id: string, role: user_role): Promise<User> {
    try {
      return await this.db.user.update({
        where: { id },
        data: { role }
      });
    } catch (error) {
      logger.error(`Error updating role for user ${id}:`, error);
      throw error;
    }
  }

  async findAdmins(): Promise<User[]> {
    try {
      return await this.db.user.findMany({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      logger.error('Error finding admin users:', error);
      throw error;
    }
  }

  async findSellers(): Promise<User[]> {
    try {
      return await this.db.user.findMany({
        where: { role: 'SELLER' },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      logger.error('Error finding seller users:', error);
      throw error;
    }
  }

  async upsertByEmail(email: string, data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.db.user.upsert({
        where: { email },
        update: {
          name: data.name,
          picture: data.picture,
          updatedAt: new Date()
        },
        create: data
      });
    } catch (error) {
      logger.error(`Error upserting user with email ${email}:`, error);
      throw error;
    }
  }
}