// src/hooks/use-auth.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from './use-toast';

// Admin email from environment (used by server-side logic, not directly by this client hook for isAdmin determination)
const ADMIN_EMAIL_FROM_ENV = process.env.ADMIN_EMAIL || 'fowlstar1@gmail.com'; // Fallback for clarity, server uses its own .env

interface SessionUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: SessionUser | null;
  userId: string | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: SessionUser }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: SessionUser }>;
  signOut: () => Promise<void>;
  getAllUsers?: () => Promise<{ id: string; email: string, createdAt: string }[] | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start as true for initial session check
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const checkSession = useCallback(async () => {
    console.log('AuthProvider: Checking session...');
    // setLoading(true) is usually set before this call by initial state or previous action
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      console.log('AuthProvider: Session check response status:', response.status, 'Data:', data);

      if (response.ok && data.user) {
        console.log('AuthProvider: Session valid, user found:', data.user);
        setUser(data.user);
        setUserId(data.user.id);
      } else {
        console.log('AuthProvider: No active session or error during session check.');
        setUser(null);
        setUserId(null);
        // Only redirect if not already on a public page and not loading auth state
        // and not an API route
        if (!loading && !['/login', '/signup'].includes(pathname) && !pathname.startsWith('/api')) {
          console.log('AuthProvider: No session, not on public/API route, redirecting to /login');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error("AuthProvider: Error checking session:", error);
      setUser(null);
      setUserId(null);
       if (!loading && !['/login', '/signup'].includes(pathname) && !pathname.startsWith('/api')) {
          console.log('AuthProvider: Error during session check, not on public/API route, redirecting to /login');
          router.push('/login');
      }
    } finally {
      setLoading(false);
      console.log('AuthProvider: Session check complete, loading set to false.');
    }
  }, [pathname, router, loading]); // Added loading

  useEffect(() => {
    checkSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // checkSession is memoized and doesn't need to be in deps if its own deps are stable

  // isAdmin is determined by comparing the authenticated user's email with the ADMIN_EMAIL_FROM_ENV.
  // This ADMIN_EMAIL_FROM_ENV should ideally match what the server uses (process.env.ADMIN_EMAIL).
  const isAdmin = useMemo(() => !!user && user.email.toLowerCase() === ADMIN_EMAIL_FROM_ENV.toLowerCase(), [user]);

  const handleApiAuth = async (endpoint: string, body: any): Promise<{ success: boolean; message: string; user?: SessionUser }> => {
    console.log(`AuthProvider: Attempting API auth at ${endpoint} for email:`, body.email);
    setLoading(true);
    let responseText = ''; // Variable to store raw response text
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      // Try to get text first for better error logging if JSON parsing fails
      responseText = await response.text(); 
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`AuthProvider: Failed to parse JSON response from ${endpoint}. Status: ${response.status}. Response text: ${responseText}`, parseError);
        toast({ title: "Error", description: "Received an invalid response from the server.", variant: "destructive" });
        setLoading(false);
        return { success: false, message: "Invalid server response." };
      }
      
      console.log(`AuthProvider: API response from ${endpoint} - Status: ${response.status}, Data:`, data);

      if (response.ok && data.user) {
        console.log(`AuthProvider: API auth successful for ${endpoint}. User:`, data.user);
        setUser(data.user);
        setUserId(data.user.id);
        toast({ title: data.message || (endpoint.includes('signup') ? "Signup Successful" : "Login Successful") });
        // setLoading(false); // Set loading false *before* redirect - moved to finally
        router.push('/'); // Redirect to dashboard on successful auth
        return { success: true, message: data.message || "Success", user: data.user };
      } else {
        console.warn(`AuthProvider: API auth failed for ${endpoint}. Message:`, data.message);
        toast({ title: data.message || "Authentication Failed", variant: "destructive" });
        // setLoading(false); // - moved to finally
        return { success: false, message: data.message || "An error occurred" };
      }
    } catch (error) {
      console.error(`AuthProvider: Network or unexpected error during API auth at ${endpoint}:`, error);
      const errorMessage = error instanceof Error ? error.message : "Network error or server unavailable.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      // setLoading(false); // - moved to finally
      return { success: false, message: errorMessage };
    } finally {
        setLoading(false); // Ensure loading is always set to false
    }
  };

  const handleSignIn = useCallback(
    (email: string, password: string) => handleApiAuth('/api/auth/login', { email, password }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, toast] 
  );

  const handleSignUp = useCallback(
    (email: string, password: string) => handleApiAuth('/api/auth/signup', { email, password }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, toast] 
  );

  const handleSignOut = useCallback(async () => {
    console.log('AuthProvider: Attempting sign out...');
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setUserId(null);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/login');
      console.log('AuthProvider: Sign out successful, redirected to /login.');
    } catch (error) {
      console.error("AuthProvider: Sign out error:", error);
      toast({ title: "Sign Out Failed", variant: "destructive" });
    } finally {
      setLoading(false);
      console.log('AuthProvider: Sign out attempt finished, loading set to false.');
    }
  }, [router, toast]);

  const getAllUsersForAdmin = useCallback(async (): Promise<{ id: string; email: string, createdAt: string }[] | null> => {
    if (!isAdmin) { // Check against the derived isAdmin state
      console.warn("AuthProvider: Attempted to get all users when not admin.");
      return null;
    }
    console.log('AuthProvider: Admin attempting to fetch all users...');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      console.log('AuthProvider: Admin get users response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('AuthProvider: Admin get users error data:', errorData);
        throw new Error(errorData.message || `Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('AuthProvider: Admin get users success, user count:', data.users?.length);
      return data.users;
    } catch (error) {
      console.error("AuthProvider: Error fetching all users for admin:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not load user data.";
      toast({ title: "Admin Error", description: errorMessage, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
      console.log('AuthProvider: Admin get users attempt finished, loading set to false.');
    }
  }, [isAdmin, toast]);


  const value = useMemo(() => ({
    user,
    userId,
    loading,
    isAdmin,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    getAllUsers: isAdmin ? getAllUsersForAdmin : undefined, // Conditionally provide getAllUsers
  }), [user, userId, loading, isAdmin, handleSignIn, handleSignUp, handleSignOut, getAllUsersForAdmin]);

  // This loader is a full-screen loader for initial auth state resolution.
  // It should prevent content flicker.
   if (loading && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
     return (
       <div className="flex justify-center items-center h-screen w-screen bg-background">
         <Loader2 className="w-12 h-12 animate-spin text-primary" />
         <span className="ml-3 text-muted-foreground">Authenticating...</span>
       </div>
     );
   }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
