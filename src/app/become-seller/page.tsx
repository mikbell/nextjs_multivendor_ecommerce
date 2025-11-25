'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Store, Mail, Phone, Building2 } from 'lucide-react';
import Link from 'next/link';

const sellerRequestSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessEmail: z.string().email('Invalid email address'),
  businessPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

type SellerRequestFormData = z.infer<typeof sellerRequestSchema>;

export default function BecomeSellerPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingRequest, setExistingRequest] = useState<{status: string} | null>(null);

  const form = useForm<SellerRequestFormData>({
    resolver: zodResolver(sellerRequestSchema),
    defaultValues: {
      businessName: '',
      businessEmail: user?.emailAddresses[0]?.emailAddress || '',
      businessPhone: '',
      description: '',
    },
  });

  useEffect(() => {
    // Handle URL parameters for success/error messages
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'verified') {
      toast.success('Email verified successfully! You are now a seller.');
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/seller');
      }, 2000);
    } else if (success === 'already-verified') {
      toast.info('Your request is already verified.');
    } else if (error === 'invalid-token') {
      toast.error('Invalid verification token.');
    } else if (error === 'expired-token') {
      toast.error('Verification token has expired. Please request a new one.');
    } else if (error === 'verification-failed') {
      toast.error('Verification failed. Please try again.');
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Check if user already has a pending request
    const checkExistingRequest = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/seller-request');
        if (response.ok) {
          const requests = await response.json();
          const pending = requests.find(
            (req: {status: string}) => req.status === 'PENDING' || req.status === 'VERIFIED'
          );
          setExistingRequest(pending);
        }
      } catch (error) {
        console.error('Error checking existing request:', error);
      }
    };

    if (isLoaded && user) {
      checkExistingRequest();
    }
  }, [user, isLoaded]);

  const onSubmit = async (data: SellerRequestFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/seller-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit request');
      }

      setIsSuccess(true);
      toast.success('Request submitted! Please check your email to verify.');
    } catch (error) {
      console.error('Error submitting seller request:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit request'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to be signed in to become a seller.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              <CardTitle>Request Submitted Successfully!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We&apos;ve sent a verification email to your business email address.
              Please check your inbox and click the verification link to complete
              your seller registration.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                The verification link will expire in 24 hours. After verification,
                you&apos;ll be automatically upgraded to a seller account.
              </p>
            </div>
            <Button onClick={() => router.push('/')}>Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (existingRequest) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Pending Seller Request</CardTitle>
            <CardDescription>
              You already have a seller request in progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800">
                Status: {existingRequest.status}
              </h4>
              <p className="text-sm text-yellow-700 mt-2">
                Business Name: {existingRequest.businessName}
              </p>
              <p className="text-sm text-yellow-700">
                Submitted: {new Date(existingRequest.createdAt).toLocaleDateString()}
              </p>
            </div>
            {existingRequest.status === 'PENDING' && (
              <p className="text-sm text-muted-foreground">
                Please check your email ({existingRequest.businessEmail}) for the
                verification link. If you haven&apos;t received it, please check your
                spam folder.
              </p>
            )}
            <Button variant="outline" onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
        <p className="text-muted-foreground">
          Start selling your products on our platform. Fill out the form below to
          get started.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <Store className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">Create Your Store</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set up your own online store and start selling immediately after
              verification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Building2 className="w-8 h-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">Manage Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add unlimited products, manage inventory, and track your sales in
              real-time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CheckCircle2 className="w-8 h-8 text-purple-600 mb-2" />
            <CardTitle className="text-lg">Quick Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verify your email and start selling instantly. No waiting for manual
              approval.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seller Application</CardTitle>
          <CardDescription>
            Please provide your business information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Your Business Name"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The name of your business or store.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="business@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      We&apos;ll send the verification link to this email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your business contact number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your business, what products you plan to sell, and your experience..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 50 characters. Describe your business and what you
                      plan to sell.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
