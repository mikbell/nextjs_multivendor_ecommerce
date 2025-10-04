/*
  Warnings:

  - You are about to drop the column `description` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtTime` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `productvariant` table. All the data in the column will be lost.
  - You are about to drop the column `isOnSale` on the `productvariant` table. All the data in the column will be lost.
  - You are about to drop the column `mainImage` on the `productvariant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `productvariant` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `productvariant` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `productvariantimage` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `review` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `review` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `defaultShippingFee` on the `store` table. All the data in the column will be lost.
  - You are about to drop the column `ratingCount` on the `store` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `subcategory` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `subcategory` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `productvariantcolor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productvariantsize` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[url]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFees` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderGroupId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantSlug` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantImage` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantName` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `ProductVariantImage` table without a default value. This is not possible if the table is not empty.
  - Made the column `alt` on table `productvariantimage` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `color` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Made the column `defaultShippingService` on table `store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultDeliveryTimeMin` on table `store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultDeliveryTimeMax` on table `store` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `url` to the `SubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `picture` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_productVariantId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_subCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `productvariant` DROP FOREIGN KEY `ProductVariant_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productvariantcolor` DROP FOREIGN KEY `ProductVariantColor_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `productvariantimage` DROP FOREIGN KEY `ProductVariantImage_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `productvariantsize` DROP FOREIGN KEY `ProductVariantSize_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_productId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_userId_fkey`;

-- DropForeignKey
ALTER TABLE `store` DROP FOREIGN KEY `Store_userId_fkey`;

-- DropForeignKey
ALTER TABLE `subcategory` DROP FOREIGN KEY `SubCategory_categoryId_fkey`;

-- DropIndex
DROP INDEX `Category_slug_key` ON `category`;

-- DropIndex
DROP INDEX `OrderItem_orderId_idx` ON `orderitem`;

-- DropIndex
DROP INDEX `OrderItem_productVariantId_idx` ON `orderitem`;

-- DropIndex
DROP INDEX `ProductVariant_sku_key` ON `productvariant`;

-- DropIndex
DROP INDEX `ProductVariantImage_variantId_idx` ON `productvariantimage`;

-- DropIndex
DROP INDEX `Review_storeId_idx` ON `review`;

-- DropIndex
DROP INDEX `Review_userId_productId_key` ON `review`;

-- DropIndex
DROP INDEX `SubCategory_slug_key` ON `subcategory`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `description`,
    DROP COLUMN `slug`,
    ADD COLUMN `url` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `status`,
    DROP COLUMN `totalAmount`,
    ADD COLUMN `orderStatus` ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'OutforDelivery', 'Delivered', 'Cancelled', 'Failed', 'Refunded', 'Returned', 'PartiallyShipped', 'OnHold') NOT NULL DEFAULT 'Pending',
    ADD COLUMN `paymentMethod` ENUM('Paypal', 'Stripe') NULL,
    ADD COLUMN `paymentStatus` ENUM('Pending', 'Paid', 'Failed', 'Declined', 'Cancelled', 'Refunded', 'PartiallyRefunded', 'Chargeback') NOT NULL DEFAULT 'Pending',
    ADD COLUMN `shippingAddressId` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingFees` DOUBLE NOT NULL,
    ADD COLUMN `subTotal` DOUBLE NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `orderId`,
    DROP COLUMN `priceAtTime`,
    DROP COLUMN `productVariantId`,
    ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `orderGroupId` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `productId` VARCHAR(191) NOT NULL,
    ADD COLUMN `productSlug` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingFee` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `size` VARCHAR(191) NOT NULL,
    ADD COLUMN `sizeId` VARCHAR(191) NOT NULL,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('Pending', 'Processing', 'ReadyForShipment', 'Shipped', 'Delivered', 'Canceled', 'Returned', 'Refunded', 'FailedDelivery', 'OnHold', 'Backordered', 'PartiallyShipped', 'ExchangeRequested', 'AwaitingPickup') NOT NULL DEFAULT 'Pending',
    ADD COLUMN `totalPrice` DOUBLE NOT NULL,
    ADD COLUMN `variantId` VARCHAR(191) NOT NULL,
    ADD COLUMN `variantSlug` VARCHAR(191) NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 1,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `freeShippingForAllCountries` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `numReviews` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `offerTagId` VARCHAR(191) NULL,
    ADD COLUMN `sales` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `shippingFeeMethod` ENUM('ITEM', 'WEIGHT', 'FIXED') NOT NULL DEFAULT 'ITEM',
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0,
    MODIFY `description` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `productvariant` DROP COLUMN `description`,
    DROP COLUMN `isOnSale`,
    DROP COLUMN `mainImage`,
    DROP COLUMN `name`,
    DROP COLUMN `price`,
    ADD COLUMN `isSale` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `saleEndDate` VARCHAR(191) NULL,
    ADD COLUMN `sales` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `variantDescription` LONGTEXT NULL,
    ADD COLUMN `variantImage` VARCHAR(191) NOT NULL,
    ADD COLUMN `variantName` VARCHAR(191) NOT NULL,
    ADD COLUMN `weight` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `productvariantimage` DROP COLUMN `variantId`,
    ADD COLUMN `order` INTEGER NULL,
    ADD COLUMN `productVariantId` VARCHAR(191) NOT NULL,
    MODIFY `alt` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `review` DROP COLUMN `comment`,
    DROP COLUMN `storeId`,
    DROP COLUMN `title`,
    ADD COLUMN `color` VARCHAR(191) NOT NULL,
    ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `quantity` VARCHAR(191) NOT NULL,
    ADD COLUMN `review` VARCHAR(191) NOT NULL,
    ADD COLUMN `size` VARCHAR(191) NOT NULL,
    ADD COLUMN `variant` VARCHAR(191) NOT NULL,
    MODIFY `rating` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `store` DROP COLUMN `defaultShippingFee`,
    DROP COLUMN `ratingCount`,
    ADD COLUMN `defaultShippingFeeFixed` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `defaultShippingFeeForAdditionalItem` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `defaultShippingFeePerItem` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `defaultShippingFeePerKg` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `numReviews` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `url` VARCHAR(191) NOT NULL,
    MODIFY `returnPolicy` VARCHAR(191) NOT NULL DEFAULT 'Return in 30 days.',
    MODIFY `defaultShippingService` VARCHAR(191) NOT NULL DEFAULT 'International Delivery',
    MODIFY `defaultDeliveryTimeMin` INTEGER NOT NULL DEFAULT 7,
    MODIFY `defaultDeliveryTimeMax` INTEGER NOT NULL DEFAULT 31;

-- AlterTable
ALTER TABLE `subcategory` DROP COLUMN `description`,
    DROP COLUMN `slug`,
    ADD COLUMN `url` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `firstName`,
    DROP COLUMN `isActive`,
    DROP COLUMN `lastName`,
    DROP COLUMN `phone`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `picture` TEXT NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- DropTable
DROP TABLE `productvariantcolor`;

-- DropTable
DROP TABLE `productvariantsize`;

-- CreateTable
CREATE TABLE `Size` (
    `id` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `productVariantId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Size_productVariantId_idx`(`productVariantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Color` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Color_productVariantId_idx`(`productVariantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfferTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OfferTag_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Spec` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `variantId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Spec_productId_idx`(`productId`),
    INDEX `Spec_variantId_idx`(`variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Question_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Country_name_key`(`name`),
    UNIQUE INDEX `Country_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingRate` (
    `id` VARCHAR(191) NOT NULL,
    `shippingService` VARCHAR(191) NOT NULL,
    `shippingFeePerItem` DOUBLE NOT NULL,
    `shippingFeeForAdditionalItem` DOUBLE NOT NULL,
    `shippingFeePerKg` DOUBLE NOT NULL,
    `shippingFeeFixed` DOUBLE NOT NULL,
    `deliveryTimeMin` INTEGER NOT NULL,
    `deliveryTimeMax` INTEGER NOT NULL,
    `returnPolicy` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ShippingRate_countryId_idx`(`countryId`),
    INDEX `ShippingRate_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FreeShipping` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FreeShipping_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FreeShippingCountry` (
    `id` VARCHAR(191) NOT NULL,
    `freeShippingId` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FreeShippingCountry_freeShippingId_idx`(`freeShippingId`),
    INDEX `FreeShippingCountry_countryId_idx`(`countryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewImage` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NOT NULL DEFAULT '',
    `reviewId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReviewImage_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `couponId` VARCHAR(191) NULL,
    `shippingFees` DOUBLE NOT NULL DEFAULT 0,
    `subTotal` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cart_userId_key`(`userId`),
    INDEX `Cart_couponId_idx`(`couponId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NOT NULL,
    `productSlug` VARCHAR(191) NOT NULL,
    `variantSlug` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `shippingFee` DOUBLE NOT NULL DEFAULT 0,
    `totalPrice` DOUBLE NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CartItem_cartId_idx`(`cartId`),
    INDEX `CartItem_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingAddress` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address1` VARCHAR(191) NOT NULL,
    `address2` VARCHAR(191) NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `zip_code` VARCHAR(191) NOT NULL,
    `default` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `countryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ShippingAddress_countryId_idx`(`countryId`),
    INDEX `ShippingAddress_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderGroup` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'OutforDelivery', 'Delivered', 'Cancelled', 'Failed', 'Refunded', 'Returned', 'PartiallyShipped', 'OnHold') NOT NULL DEFAULT 'Pending',
    `shippingService` VARCHAR(191) NOT NULL,
    `shippingDeliveryMin` INTEGER NOT NULL,
    `shippingDeliveryMax` INTEGER NOT NULL,
    `shippingFees` DOUBLE NOT NULL,
    `subTotal` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `couponId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OrderGroup_orderId_idx`(`orderId`),
    INDEX `OrderGroup_storeId_idx`(`storeId`),
    INDEX `OrderGroup_couponId_idx`(`couponId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wishlist` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Wishlist_userId_idx`(`userId`),
    INDEX `Wishlist_productId_idx`(`productId`),
    INDEX `Wishlist_variantId_idx`(`variantId`),
    INDEX `Wishlist_sizeId_idx`(`sizeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `startDate` VARCHAR(191) NOT NULL,
    `endDate` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Coupon_code_key`(`code`),
    INDEX `Coupon_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentDetails` (
    `id` VARCHAR(191) NOT NULL,
    `paymentInetntId` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PaymentDetails_orderId_key`(`orderId`),
    INDEX `PaymentDetails_orderId_idx`(`orderId`),
    INDEX `PaymentDetails_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserFollowingStore` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserFollowingStore_AB_unique`(`A`, `B`),
    INDEX `_UserFollowingStore_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouponToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CouponToUser_AB_unique`(`A`, `B`),
    INDEX `_CouponToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Category_url_key` ON `Category`(`url`);

-- CreateIndex
CREATE INDEX `Order_shippingAddressId_idx` ON `Order`(`shippingAddressId`);

-- CreateIndex
CREATE INDEX `OrderItem_orderGroupId_idx` ON `OrderItem`(`orderGroupId`);

-- CreateIndex
CREATE INDEX `Product_offerTagId_idx` ON `Product`(`offerTagId`);

-- CreateIndex
CREATE INDEX `ProductVariantImage_productVariantId_idx` ON `ProductVariantImage`(`productVariantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Store_url_key` ON `Store`(`url`);

-- CreateIndex
CREATE UNIQUE INDEX `SubCategory_url_key` ON `SubCategory`(`url`);
