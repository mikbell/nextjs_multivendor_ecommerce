import { UserRepository, UserWithStats, UserFilter } from '@/lib/repositories/user-repository';
import { PaginationOptions, PaginatedResult } from '@/lib/database/base-repository';
import { db } from '@/lib/database/connection';
import { logger } from '@/lib/logger';
import { User, user_role, Prisma } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

export interface CreateUserData {
  email: string;
  name: string;
  picture: string;
  role?: user_role;
}

export interface UpdateUserData {
  name?: string;
  picture?: string;
  role?: user_role;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(db);
  }

  async getCurrentUser(): Promise<UserWithStats | null> {
    try {
      const clerkUser = await currentUser();
      
      if (!clerkUser || !clerkUser.emailAddresses[0]) {
        return null;
      }

      const email = clerkUser.emailAddresses[0].emailAddress;
      let user = await this.userRepository.findByEmail(email);

      // If user doesn't exist, create them
      if (!user) {
        const userData: Prisma.UserCreateInput = {
          id: clerkUser.id,
          email,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          picture: clerkUser.imageUrl || '',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        user = await this.userRepository.create(userData);
      }

      return user;
    } catch (error) {
      logger.error('Error getting current user:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<UserWithStats | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      logger.error(`Error getting user by id ${id}:`, error);
      throw new Error('Failed to retrieve user');
    }
  }

  async getUserByEmail(email: string): Promise<UserWithStats | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      logger.error(`Error getting user by email ${email}:`, error);
      throw new Error('Failed to retrieve user');
    }
  }

  async getUsers(options: PaginationOptions & UserFilter): Promise<PaginatedResult<UserWithStats>> {
    try {
      return await this.userRepository.findAll(options);
    } catch (error) {
      logger.error('Error getting users:', error);
      throw new Error('Failed to retrieve users');
    }
  }

  async createUser(data: CreateUserData): Promise<User> {
    try {
      const userData: Prisma.UserCreateInput = {
        ...data,
        role: data.role || 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.userRepository.create(userData);
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const updateData: Prisma.UserUpdateInput = {
        ...data,
        updatedAt: new Date()
      };

      return await this.userRepository.update(id, updateData);
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      // Check if user has any active orders or stores
      const [orderCount, storeCount] = await Promise.all([
        db.order.count({ where: { userId: id } }),
        db.store.count({ where: { userId: id } })
      ]);

      if (orderCount > 0) {
        throw new Error('Cannot delete user with existing orders');
      }

      if (storeCount > 0) {
        throw new Error('Cannot delete user with existing stores');
      }

      await this.userRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete user');
    }
  }

  async updateUserRole(id: string, role: user_role, adminUserId: string): Promise<User> {
    try {
      // Check if the admin has permission
      const admin = await this.userRepository.findById(adminUserId);
      if (!admin || admin.role !== 'ADMIN') {
        throw new Error('Insufficient permissions to update user role');
      }

      return await this.userRepository.updateRole(id, role);
    } catch (error) {
      logger.error(`Error updating role for user ${id}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update user role');
    }
  }

  async getAdmins(): Promise<User[]> {
    try {
      return await this.userRepository.findAdmins();
    } catch (error) {
      logger.error('Error getting admin users:', error);
      throw new Error('Failed to retrieve admin users');
    }
  }

  async getSellers(): Promise<User[]> {
    try {
      return await this.userRepository.findSellers();
    } catch (error) {
      logger.error('Error getting seller users:', error);
      throw new Error('Failed to retrieve seller users');
    }
  }

  async syncUserFromClerk(clerkUserId: string): Promise<User | null> {
    try {
      const clerkUser = await currentUser();
      
      if (!clerkUser || clerkUser.id !== clerkUserId) {
        return null;
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        return null;
      }

      const userData: Prisma.UserCreateInput = {
        id: clerkUser.id,
        email,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        picture: clerkUser.imageUrl || '',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.userRepository.upsertByEmail(email, userData);
    } catch (error) {
      logger.error(`Error syncing user from Clerk ${clerkUserId}:`, error);
      throw new Error('Failed to sync user from Clerk');
    }
  }

  async hasPermission(userId: string, requiredRole: user_role): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) return false;

      const roleHierarchy = {
        USER: 0,
        SELLER: 1,
        ADMIN: 2
      };

      return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    } catch (error) {
      logger.error(`Error checking permission for user ${userId}:`, error);
      return false;
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'ADMIN');
  }

  async isSeller(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'SELLER');
  }

  async getUserStats(userId: string): Promise<{
    totalOrders: number;
    totalReviews: number;
    totalWishlistItems: number;
    totalStores: number;
  }> {
    try {
      const [totalOrders, totalReviews, totalWishlistItems, totalStores] = await Promise.all([
        db.order.count({ where: { userId } }),
        db.review.count({ where: { userId } }),
        db.wishlist.count({ where: { userId } }),
        db.store.count({ where: { userId } })
      ]);

      return {
        totalOrders,
        totalReviews,
        totalWishlistItems,
        totalStores
      };
    } catch (error) {
      logger.error(`Error getting user stats for ${userId}:`, error);
      throw new Error('Failed to retrieve user statistics');
    }
  }
}