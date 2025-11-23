import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/become-seller?error=missing-token', request.url)
      );
    }

    // Find the seller request with this token
    const sellerRequest = await db.sellerRequest.findUnique({
      where: {
        verificationToken: token,
      },
      include: {
        user: true,
      },
    });

    if (!sellerRequest) {
      return NextResponse.redirect(
        new URL('/become-seller?error=invalid-token', request.url)
      );
    }

    // Check if token is expired
    if (sellerRequest.tokenExpiresAt && sellerRequest.tokenExpiresAt < new Date()) {
      return NextResponse.redirect(
        new URL('/become-seller?error=expired-token', request.url)
      );
    }

    // Check if already verified or approved
    if (sellerRequest.status === 'VERIFIED' || sellerRequest.status === 'APPROVED') {
      return NextResponse.redirect(
        new URL('/become-seller?success=already-verified', request.url)
      );
    }

    // Update request status to VERIFIED and upgrade user to SELLER
    await db.$transaction(async (tx) => {
      // Update seller request status
      await tx.sellerRequest.update({
        where: {
          id: sellerRequest.id,
        },
        data: {
          status: 'VERIFIED',
        },
      });

      // Update user role to SELLER
      await tx.user.update({
        where: {
          id: sellerRequest.userId,
        },
        data: {
          role: 'SELLER',
        },
      });

      // Update Clerk user metadata
      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(sellerRequest.userId, {
          publicMetadata: {
            role: 'SELLER',
          },
        });
      } catch (error) {
        console.error('Error updating Clerk metadata:', error);
        // Don't fail the transaction if Clerk update fails
      }
    });

    return NextResponse.redirect(
      new URL('/become-seller?success=verified', request.url)
    );
  } catch (error) {
    console.error('Error verifying seller request:', error);
    return NextResponse.redirect(
      new URL('/become-seller?error=verification-failed', request.url)
    );
  }
}
