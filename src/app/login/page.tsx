'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth'; // Ensure this uses MongoDB version
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const APP_ROUTES = [
  '/dashboard',
  '/materials',
  '/goals',
  '/tasks',
  '/habits',
  '/timer',
  '/flashcards',
  '/notes',
  '/assistant',
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in (checked by useAuth from MongoDB), redirect to dashboard
    if (user && !authLoading) {
      console.log('LoginPage: User detected, redirecting to /');
      router.replace('/'); // Use replace to prevent login page from being in history
    }
  }, [user, authLoading, router]);

  // Prefetch routes when component mounts and user is not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      APP_ROUTES.forEach(route => {
        router.prefetch(route);
      });
      console.log('LoginPage: Prefetching application routes.');
    }
  }, [user, authLoading, router]);


  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
        return;
    }
    // signIn function from useAuth handles API call, loading state, toasts.
    // Redirection is handled by useEffect above reacting to user state change, or by AuthProvider's logic.
    await signIn(email, password);
  };

  // Show loading spinner if auth is in progress (e.g., during initial session check or sign-in attempt)
  // AND the user is not yet determined. This is primarily handled by AuthProvider for initial load.
  // This loader is more for the sign-in process itself.
  if (authLoading && !user) { // Only show this specific loader if actively trying to sign in/up or initial load
     return (
       <div className="flex justify-center items-center h-screen w-screen bg-background">
         <Loader2 className="w-12 h-12 animate-spin text-primary" />
         <span className="ml-3 text-muted-foreground">Checking credentials...</span>
       </div>
     );
   }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-background">
      <Card className="w-full max-w-md glassmorphism">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Welcome Back!</CardTitle>
          <CardDescription>Log in to your LifeOS account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
            <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={authLoading}
              />
            </div>
            <Button type="submit" className="w-full hover-glow" disabled={authLoading}>
              {authLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              {authLoading ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
