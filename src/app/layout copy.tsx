'use client'; // Top-level layout now needs to be client due to hooks

import React, { useMemo, useCallback, useEffect } from 'react'; // Added useEffect
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter, // Import SidebarFooter
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CreditCard,
  Bot,
  FileText,
  Upload,
  ListChecks, // Added icons
  Activity,
  Clock,
  Target,
  LogOut, // Added Logout icon
} from 'lucide-react';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/ui/logo';
import { usePathname, useRouter } from 'next/navigation'; // Import usePathname and useRouter
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { AuthProvider, useAuth } from '@/hooks/use-auth'; // Import AuthProvider and useAuth
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; // Import Loader



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* AuthProvider should wrap everything that needs auth context */}
        <AuthProvider>
            {/* ThemeProvider needs to be inside AuthProvider if ThemeToggleButton uses auth state, otherwise order might not matter */}
            <ThemeProvider
                attribute="class"
                defaultTheme="system" // Or "dark" if enforcing dark mode initially
                enableSystem
                disableTransitionOnChange
            >
                {/* SidebarProvider wraps the layout structure */}
                <SidebarProvider defaultOpen={true}>
                     {/* Inner component to access both Auth and Sidebar context */}
                    <AppContent>{children}</AppContent>
                </SidebarProvider>
                <Toaster />
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// Client component to handle layout structure and context access
function AppContent({ children }: { children: React.ReactNode }) {
    const { isMobile, setOpenMobile, state: sidebarState } = useSidebar();
    const pathname = usePathname();
    const { user, signOut, loading: authLoading } = useAuth(); // Get auth state from useAuth
    const router = useRouter(); // Get router instance

    const handleLinkClick = useCallback(() => {
      if (isMobile) {
        setOpenMobile(false);
      }
    }, [isMobile, setOpenMobile]);

     // Define menu items based on desired navigation
     const menuItems = useMemo(() => [
        { href: "/", tooltip: "Dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
        { href: "/materials", tooltip: "Materials", icon: <Upload />, label: "Materials" },
        { href: "/goals", tooltip: "Goals", icon: <Target />, label: "Goals" },
        { href: "/tasks", tooltip: "Tasks", icon: <ListChecks />, label: "Tasks" },
        { href: "/habits", tooltip: "Habits", icon: <Activity />, label: "Habits" },
        { href: "/timer", tooltip: "Timer", icon: <Clock />, label: "Timer" },
        { href: "/flashcards", tooltip: "Flashcards", icon: <CreditCard />, label: "Flashcards" },
        { href: "/notes", tooltip: "Notes", icon: <FileText />, label: "Notes" },
        { href: "/assistant", tooltip: "AI Assistant", icon: <Bot />, label: "AI Assistant" },
      ], []);

    // Prefetch routes when the component mounts or menuItems change
    useEffect(() => {
        if (user && !authLoading) { // Only prefetch if user is logged in and auth is not loading
            menuItems.forEach(item => {
                if (item.href !== pathname) { // Don't prefetch the current page
                    router.prefetch(item.href);
                }
            });
             console.log('Layout: Prefetching navigation routes.');
        }
    }, [menuItems, router, user, authLoading, pathname]);


    // Determine if the sidebar should be shown
    // Show only if authenticated AND auth is not loading AND not on login/signup pages
    const showSidebar = user && !authLoading && pathname !== '/login' && pathname !== '/signup';

    // If auth is loading (handled by AuthProvider now), this component might still render briefly.
    // AuthProvider shows a full-screen loader, so this content won't be visible during that phase.

    return (
        <div className={cn('flex min-h-screen w-full', `antialiased font-sans`)}>
             {showSidebar && (
                  <Sidebar
                      variant="sidebar"
                      collapsible="icon"
                      className="border-r border-sidebar-border/50"
                      data-state={sidebarState} // Use state for potential conditional styling
                  >
                    <SidebarHeader>
                      <Logo />
                    </SidebarHeader>
                    <SidebarContent>
                      <SidebarMenu>
                        {menuItems.map((item) => (
                          <SidebarMenuItem key={item.href}>
                            <Link href={item.href} passHref legacyBehavior>
                              <SidebarMenuButton
                                tooltip={item.tooltip}
                                className="hover-glow"
                                onClick={handleLinkClick}
                                isActive={pathname === item.href || (pathname === '/' && item.href === '/')} // Highlight dashboard for root path too
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarContent>
                     <SidebarFooter className="flex items-center justify-between p-4 border-t border-sidebar-border/50">
                       {/* Logout Button */}
                       <Button variant="ghost" size="sm" onClick={signOut} className="hover-glow w-full justify-start" disabled={authLoading}>
                           {authLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <LogOut className="w-4 h-4 mr-2" />}
                           <span className={cn(sidebarState === 'collapsed' && 'md:hidden')}>Logout</span>
                        </Button>
                       {/* Theme Toggle */}
                       <ThemeToggleButton />
                    </SidebarFooter>
                  </Sidebar>
             )}
             {/* Adjust padding based on sidebar visibility and state */}
             <SidebarInset
                className={cn(
                    "flex-1 transition-[padding-left] duration-200 ease-linear",
                    // Apply padding only when sidebar is shown
                    showSidebar && (
                        sidebarState === 'collapsed'
                        ? 'md:pl-[calc(var(--sidebar-width-icon,4rem))]' // Padding when collapsed
                        : 'md:pl-[calc(var(--sidebar-width,16rem))]'    // Padding when expanded
                    ),
                    // Apply base padding regardless of sidebar state (for pages like login/signup)
                    "p-4 md:p-8 space-y-8" // Base padding
                 )}
             >
                {/* Render page content */}
                {children}
             </SidebarInset>
        </div>
    );
}


    