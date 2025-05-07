'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth'; // Uses MongoDB version
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

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, loading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in (checked by useAuth from MongoDB), redirect to dashboard
    if (user && !authLoading) {
      console.log('SignUpPage: User detected, redirecting to /');
      router.replace('/'); // Use replace to prevent signup page from being in history
    }
  }, [user, authLoading, router]);

  // Prefetch routes when component mounts and user is not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      APP_ROUTES.forEach(route => {
        router.prefetch(route);
      });
      console.log('SignUpPage: Prefetching application routes.');
    }
  }, [user, authLoading, router]);


  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
        toast({ title: "Missing Fields", description: "Please fill in all fields.", variant: "destructive" });
        return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords Don't Match", description: "Please ensure passwords match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password Too Short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    // signUp function from useAuth handles API call, loading state, toasts.
    // Redirection is handled by useEffect above reacting to user state change, or by AuthProvider's logic.
    await signUp(email, password);
  };

  if (authLoading && !user) { // Show loader only if not yet authenticated and auth is in progress
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
         <span className="ml-3 text-muted-foreground">Setting up your account...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-background">
      <Card className="w-full max-w-md glassmorphism">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
          <CardDescription>Join LifeOS with a MongoDB backed account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
                minLength={6}
                aria-describedby="password-description"
                disabled={authLoading}
              />
               <p id="password-description" className="text-xs text-muted-foreground">Use at least 6 characters.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={authLoading}
              />
            </div>
            <Button type="submit" className="w-full hover-glow" disabled={authLoading}>
              {authLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              {authLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
