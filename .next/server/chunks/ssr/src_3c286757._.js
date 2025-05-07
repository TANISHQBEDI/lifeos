module.exports = {

"[project]/src/hooks/use-mobile.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "useIsMobile": (()=>useIsMobile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = ()=>{
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return ()=>mql.removeEventListener("change", onChange);
    }, []);
    return !!isMobile;
}
}}),
"[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000 // Reduced delay for quicker removal
;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Stable dispatch reference
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
// Make reducer pure function
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // Side effect moved outside of reducer
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
// Stable dispatch function reference
const dispatch = (action)=>{
    // Handle side effects separately for DISMISS_TOAST
    if (action.type === "DISMISS_TOAST") {
        const { toastId } = action;
        if (toastId) {
            addToRemoveQueue(toastId);
        } else {
            memoryState.toasts.forEach((toast)=>{
                addToRemoveQueue(toast.id);
            });
        }
    }
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
};
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]) // Dependency should technically be empty, but keeping `state` might be safer depending on exact React behavior nuances
    ;
    // Memoize dismiss function
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((toastId)=>{
        dispatch({
            type: "DISMISS_TOAST",
            toastId
        });
    }, []);
    return {
        ...state,
        toast,
        dismiss
    };
}
;
}}),
"[project]/src/hooks/use-auth.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/hooks/use-auth.tsx
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
// Admin email from environment (used by server-side logic, not directly by this client hook for isAdmin determination)
const ADMIN_EMAIL_FROM_ENV = process.env.ADMIN_EMAIL || 'fowlstar1@gmail.com'; // Fallback for clarity, server uses its own .env
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const AuthProvider = ({ children })=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true); // Start as true for initial session check
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const checkSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
                if (!loading && ![
                    '/login',
                    '/signup'
                ].includes(pathname) && !pathname.startsWith('/api')) {
                    console.log('AuthProvider: No session, not on public/API route, redirecting to /login');
                    router.push('/login');
                }
            }
        } catch (error) {
            console.error("AuthProvider: Error checking session:", error);
            setUser(null);
            setUserId(null);
            if (!loading && ![
                '/login',
                '/signup'
            ].includes(pathname) && !pathname.startsWith('/api')) {
                console.log('AuthProvider: Error during session check, not on public/API route, redirecting to /login');
                router.push('/login');
            }
        } finally{
            setLoading(false);
            console.log('AuthProvider: Session check complete, loading set to false.');
        }
    }, [
        pathname,
        router,
        loading
    ]); // Added loading
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // checkSession is memoized and doesn't need to be in deps if its own deps are stable
    // isAdmin is determined by comparing the authenticated user's email with the ADMIN_EMAIL_FROM_ENV.
    // This ADMIN_EMAIL_FROM_ENV should ideally match what the server uses (process.env.ADMIN_EMAIL).
    const isAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>!!user && user.email.toLowerCase() === ADMIN_EMAIL_FROM_ENV.toLowerCase(), [
        user
    ]);
    const handleApiAuth = async (endpoint, body)=>{
        console.log(`AuthProvider: Attempting API auth at ${endpoint} for email:`, body.email);
        setLoading(true);
        let responseText = ''; // Variable to store raw response text
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            // Try to get text first for better error logging if JSON parsing fails
            responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error(`AuthProvider: Failed to parse JSON response from ${endpoint}. Status: ${response.status}. Response text: ${responseText}`, parseError);
                toast({
                    title: "Error",
                    description: "Received an invalid response from the server.",
                    variant: "destructive"
                });
                setLoading(false);
                return {
                    success: false,
                    message: "Invalid server response."
                };
            }
            console.log(`AuthProvider: API response from ${endpoint} - Status: ${response.status}, Data:`, data);
            if (response.ok && data.user) {
                console.log(`AuthProvider: API auth successful for ${endpoint}. User:`, data.user);
                setUser(data.user);
                setUserId(data.user.id);
                toast({
                    title: data.message || (endpoint.includes('signup') ? "Signup Successful" : "Login Successful")
                });
                // setLoading(false); // Set loading false *before* redirect - moved to finally
                router.push('/'); // Redirect to dashboard on successful auth
                return {
                    success: true,
                    message: data.message || "Success",
                    user: data.user
                };
            } else {
                console.warn(`AuthProvider: API auth failed for ${endpoint}. Message:`, data.message);
                toast({
                    title: data.message || "Authentication Failed",
                    variant: "destructive"
                });
                // setLoading(false); // - moved to finally
                return {
                    success: false,
                    message: data.message || "An error occurred"
                };
            }
        } catch (error) {
            console.error(`AuthProvider: Network or unexpected error during API auth at ${endpoint}:`, error);
            const errorMessage = error instanceof Error ? error.message : "Network error or server unavailable.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
            // setLoading(false); // - moved to finally
            return {
                success: false,
                message: errorMessage
            };
        } finally{
            setLoading(false); // Ensure loading is always set to false
        }
    };
    const handleSignIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((email, password)=>handleApiAuth('/api/auth/login', {
            email,
            password
        }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        router,
        toast
    ]);
    const handleSignUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((email, password)=>handleApiAuth('/api/auth/signup', {
            email,
            password
        }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        router,
        toast
    ]);
    const handleSignOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        console.log('AuthProvider: Attempting sign out...');
        setLoading(true);
        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
            setUser(null);
            setUserId(null);
            toast({
                title: "Signed Out",
                description: "You have been successfully signed out."
            });
            router.push('/login');
            console.log('AuthProvider: Sign out successful, redirected to /login.');
        } catch (error) {
            console.error("AuthProvider: Sign out error:", error);
            toast({
                title: "Sign Out Failed",
                variant: "destructive"
            });
        } finally{
            setLoading(false);
            console.log('AuthProvider: Sign out attempt finished, loading set to false.');
        }
    }, [
        router,
        toast
    ]);
    const getAllUsersForAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!isAdmin) {
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
            toast({
                title: "Admin Error",
                description: errorMessage,
                variant: "destructive"
            });
            return null;
        } finally{
            setLoading(false);
            console.log('AuthProvider: Admin get users attempt finished, loading set to false.');
        }
    }, [
        isAdmin,
        toast
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            user,
            userId,
            loading,
            isAdmin,
            signIn: handleSignIn,
            signUp: handleSignUp,
            signOut: handleSignOut,
            getAllUsers: isAdmin ? getAllUsersForAdmin : undefined
        }), [
        user,
        userId,
        loading,
        isAdmin,
        handleSignIn,
        handleSignUp,
        handleSignOut,
        getAllUsersForAdmin
    ]);
    // This loader is a full-screen loader for initial auth state resolution.
    // It should prevent content flicker.
    if (loading && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-screen w-screen bg-background",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-12 h-12 animate-spin text-primary"
                }, void 0, false, {
                    fileName: "[project]/src/hooks/use-auth.tsx",
                    lineNumber: 212,
                    columnNumber: 10
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-3 text-muted-foreground",
                    children: "Authenticating..."
                }, void 0, false, {
                    fileName: "[project]/src/hooks/use-auth.tsx",
                    lineNumber: 213,
                    columnNumber: 10
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/hooks/use-auth.tsx",
            lineNumber: 211,
            columnNumber: 8
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/hooks/use-auth.tsx",
        lineNumber: 218,
        columnNumber: 10
    }, this);
};
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
}}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}}),
"[project]/src/lib/local-storage.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/local-storage.ts
// --- Prefix and Key Definitions ---
__turbopack_context__.s({
    "deleteUserData": (()=>deleteUserData),
    "loadGenericData": (()=>loadGenericData),
    "loadUserData": (()=>loadUserData),
    "saveGenericData": (()=>saveGenericData),
    "saveUserData": (()=>saveUserData)
});
const APP_PREFIX = 'lifeOS_';
function saveUserData(userId, keySuffix, data) {
    if ("TURBOPACK compile-time truthy", 1) {
        console.warn("Attempted to save user data without userId or outside browser.");
        return;
    }
    "TURBOPACK unreachable";
}
function loadUserData(userId, keySuffix) {
    if ("TURBOPACK compile-time truthy", 1) {
        console.warn("Attempted to load user data without userId or outside browser.");
        return null;
    }
    "TURBOPACK unreachable";
}
function deleteUserData(userId, keySuffix) {
    if ("TURBOPACK compile-time truthy", 1) {
        console.warn("Attempted to delete user data without userId or outside browser.");
        return;
    }
    "TURBOPACK unreachable";
}
function saveGenericData(keySuffix, data) {
    if ("TURBOPACK compile-time truthy", 1) return;
    "TURBOPACK unreachable";
}
function loadGenericData(keySuffix) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    "TURBOPACK unreachable";
}
}}),
"[project]/src/ai/flows/goal-breakdown-flow.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40816088f865a7ec006898895a8066c6d03b3141e3":"breakDownGoalIntoTasks"} */ __turbopack_context__.s({
    "breakDownGoalIntoTasks": (()=>breakDownGoalIntoTasks)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
;
var breakDownGoalIntoTasks = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40816088f865a7ec006898895a8066c6d03b3141e3", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "breakDownGoalIntoTasks");
 // Wrapper function breakDownGoalIntoTasks is exported for use in server actions.
}}),
"[project]/src/ai/flows/generate-flashcards.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40177653d8220ec78da75b2339a1d7ba34853f9ccf":"generateFlashcardsFromPdf"} */ __turbopack_context__.s({
    "generateFlashcardsFromPdf": (()=>generateFlashcardsFromPdf)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
;
var generateFlashcardsFromPdf = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40177653d8220ec78da75b2339a1d7ba34853f9ccf", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "generateFlashcardsFromPdf");
 // IMPORTANT: Because this file uses 'use server', it CANNOT directly export the
 // result of ai.defineFlow. We export the wrapper function `generateFlashcardsFromPdf` instead.
 // The Genkit flow `generateFlashcardsFlow` is defined but only called internally by the wrapper.
}}),
"[project]/src/ai/flows/generate-notes.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40e68f04bfc235594d3e830ff59b2305892bcfa1d7":"generateNotesFromPdf"} */ __turbopack_context__.s({
    "generateNotesFromPdf": (()=>generateNotesFromPdf)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
;
var generateNotesFromPdf = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40e68f04bfc235594d3e830ff59b2305892bcfa1d7", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "generateNotesFromPdf");
}}),
"[project]/src/ai/flows/summarize-content-flow.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"4088dcb2cd2737b28e1de4b03bcf7fe922ca7e1de1":"summarizeContent"} */ __turbopack_context__.s({
    "summarizeContent": (()=>summarizeContent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
;
var summarizeContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("4088dcb2cd2737b28e1de4b03bcf7fe922ca7e1de1", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "summarizeContent");
}}),
"[project]/src/ai/flows/answer-question.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"4076b01d7a5500b865a4490651ea4a244e3234a3c4":"answerQuestion"} */ __turbopack_context__.s({
    "answerQuestion": (()=>answerQuestion)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
;
var answerQuestion = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("4076b01d7a5500b865a4490651ea4a244e3234a3c4", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "answerQuestion");
}}),
"[project]/src/ai/flows/generate-gemini-key.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"4041079ea9125c54507c880b8418f088fbd561b2e4":"generateGeminiKey"} */ __turbopack_context__.s({
    "generateGeminiKey": (()=>generateGeminiKey)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
;
var generateGeminiKey = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("4041079ea9125c54507c880b8418f088fbd561b2e4", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "generateGeminiKey");
 // The Genkit flow definition can be removed or commented out if not used,
 // as the exported function `generateGeminiKey` now handles the simulation directly.
 // If you intend to keep it for potential future integration with a real key generation service,
 // it would look something like this, but would require a tool or a model capable of this.
 /*
const prompt = ai.definePrompt({
  name: 'generateGeminiKeyPrompt',
  input: {
    schema: GenerateGeminiKeyInputSchema,
  },
  output: {
    schema: GenerateGeminiKeyOutputSchema,
  },
  prompt: \`You are an AI assistant that can generate Gemini API keys for users.
  Based on the user description, generate a Gemini API key and provide instructions on how to use it.
  User Description: {{{userDescription}}}
  \`,
  // This prompt would likely require a 'tool' to actually generate a key.
});

const generateGeminiKeyFlow = ai.defineFlow<
  typeof GenerateGeminiKeyInputSchema,
  typeof GenerateGeminiKeyOutputSchema
>({
  name: 'generateGeminiKeyFlow',
  inputSchema: GenerateGeminiKeyInputSchema,
  outputSchema: GenerateGeminiKeyOutputSchema,
}, async input => {
  // In a real scenario, this would interact with a key generation service/tool
  // For simulation, we're handling it in the exported function directly.
  // const {output} = await prompt(input); // This would call the LLM
  // return output!;
  
  // For this simulation, the flow would just call the direct logic.
  // However, the exported function `generateGeminiKey` above bypasses this flow.
  const fakeApiKey = \`SIMULATED-KEY-\${Date.now()}\`;
  const instructions = "This is a simulated key. See Google AI Studio for real keys.";
  return { geminiApiKey: fakeApiKey, instructions };
});
*/ }}),

};

//# sourceMappingURL=src_3c286757._.js.map