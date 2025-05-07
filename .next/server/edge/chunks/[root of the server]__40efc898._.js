(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__40efc898._.js", {

"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/src/lib/session.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/session.ts
__turbopack_context__.s({
    "createSession": (()=>createSession),
    "decrypt": (()=>decrypt),
    "deleteSession": (()=>deleteSession),
    "encrypt": (()=>encrypt),
    "getSessionFromCookie": (()=>getSessionFromCookie),
    "updateSessionCookie": (()=>updateSessionCookie)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$sign$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/browser/jwt/sign.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/browser/jwt/verify.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>"); // Corrected import for NextResponse
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
;
;
const JWT_SECRET_KEY = process.env.JWT_SECRET;
const JWT_COOKIE_NAME = 'lifeos_session_token';
const JWT_EXPIRATION_TIME = '30d'; // Session expiration time
if (!JWT_SECRET_KEY) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env');
}
const secret = new TextEncoder().encode(JWT_SECRET_KEY);
async function encrypt(payload) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$sign$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime(JWT_EXPIRATION_TIME).sign(secret);
}
async function decrypt(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secret, {
            algorithms: [
                'HS256'
            ]
        });
        return payload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}
async function createSession(userId, email) {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const sessionToken = await encrypt({
        userId,
        email,
        exp: expires.getTime() / 1000
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])().set(JWT_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        expires: expires,
        sameSite: 'lax',
        path: '/'
    });
    console.log(`Session created for user ${userId}, cookie set.`);
}
async function getSessionFromCookie() {
    const sessionCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])().get(JWT_COOKIE_NAME)?.value;
    if (!sessionCookie) {
        return null;
    }
    return await decrypt(sessionCookie);
}
async function deleteSession() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])().set(JWT_COOKIE_NAME, '', {
        expires: new Date(0),
        path: '/'
    });
    console.log('Session cookie deleted.');
}
async function updateSessionCookie(request) {
    const sessionCookie = request.cookies.get(JWT_COOKIE_NAME)?.value;
    let response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: request.headers
        }
    });
    if (!sessionCookie) {
        return response; // No session to update
    }
    const parsed = await decrypt(sessionCookie);
    if (parsed?.userId && parsed.email) {
        // Re-encrypt and set the cookie to refresh its expiration time
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const newSessionToken = await encrypt({
            userId: parsed.userId,
            email: parsed.email,
            exp: expires.getTime() / 1000
        });
        response.cookies.set(JWT_COOKIE_NAME, newSessionToken, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            expires: expires,
            sameSite: 'lax',
            path: '/'
        });
        console.log('Session cookie updated for user', parsed.userId);
    } else {
        // Invalid session, clear it
        response.cookies.set(JWT_COOKIE_NAME, '', {
            expires: new Date(0),
            path: '/'
        });
    }
    return response;
}
}}),
"[project]/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [middleware-edge] (ecmascript)"); // Use JWT session logic
;
;
const publicRoutes = [
    '/login',
    '/signup'
];
// API routes that should not be protected by default or have their own auth
const apiAuthRoutes = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/session'
];
async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    // Allow API auth routes to pass through without session checks by middleware
    if (apiAuthRoutes.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Check if the current route is public
    const isPublicRoute = publicRoutes.some((route)=>pathname.startsWith(route));
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getSessionFromCookie"])(); // Reads and decrypts JWT from cookie
    if (session?.userId && isPublicRoute) {
        // If session exists and trying to access a public route (like login), redirect to dashboard
        console.log(`Middleware: User with session on public route ${pathname}, redirecting to /`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', request.url));
    }
    if (!session?.userId && !isPublicRoute) {
        // If no session and not a public route, redirect to login
        // Avoid redirect loops for API routes that might be called by client before full auth check
        if (pathname.startsWith('/api/')) {
            // For non-auth API routes, if no session, return 401
            // This prevents redirecting API calls to the login page HTML
            console.log(`Middleware: No session for protected API route ${pathname}, returning 401`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Authentication required'
            }, {
                status: 401
            });
        }
        console.log(`Middleware: No session for protected route ${pathname}, redirecting to /login`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
    }
    // If session exists and it's not a public route, try to update/refresh the session cookie
    // The updateSessionCookie function will return a response with the updated cookie or undefined
    if (session?.userId && !isPublicRoute) {
        console.log(`Middleware: User with session on protected route ${pathname}, updating cookie.`);
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSessionCookie"])(request); // updateSessionCookie now returns a response
    }
    // Allow the request to proceed if none of the above conditions are met
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        // Match all routes except for static files, _next paths, and specific public assets like favicon.ico
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__40efc898._.js.map