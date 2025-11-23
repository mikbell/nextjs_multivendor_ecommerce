import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';

const sellerRequestSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessEmail: z.string().email('Invalid email address'),
  businessPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.emailAddresses[0]) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const email = user.emailAddresses[0].emailAddress;

    // Get or create user in database
    let dbUser = await db.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          id: user.id,
          email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          picture: user.imageUrl || '',
          role: 'USER',
        },
      });
    }

    // Check if user is already a seller
    if (dbUser.role === 'SELLER' || dbUser.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'You are already a seller or admin' },
        { status: 400 }
      );
    }

    // Check if there's already a pending request
    const existingRequest = await db.sellerRequest.findFirst({
      where: {
        userId: dbUser.id,
        status: {
          in: ['PENDING', 'VERIFIED'],
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending seller request' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = sellerRequestSchema.parse(body);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create seller request
    const sellerRequest = await db.sellerRequest.create({
      data: {
        userId: dbUser.id,
        businessName: validatedData.businessName,
        businessEmail: validatedData.businessEmail,
        businessPhone: validatedData.businessPhone,
        description: validatedData.description,
        verificationToken,
        tokenExpiresAt,
        status: 'PENDING',
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/seller-request/verify?token=${verificationToken}`;

    const { EmailService } = await import('@/lib/email/email-service');
    const emailService = new EmailService();
    await emailService.sendSellerVerificationEmail(
      validatedData.businessEmail,
      validatedData.businessName,
      verificationUrl
    );

    return NextResponse.json({
      message: 'Seller request created successfully. Please check your email to verify.',
      requestId: sellerRequest.id,
    });
  } catch (error) {
    console.error('Error creating seller request:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create seller request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.emailAddresses[0]) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const email = user.emailAddresses[0].emailAddress;

    const dbUser = await db.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's seller requests
    const sellerRequests = await db.sellerRequest.findMany({
      where: {
        userId: dbUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(sellerRequests);
  } catch (error) {
    console.error('Error fetching seller requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller requests' },
      { status: 500 }
    );
  }
}
