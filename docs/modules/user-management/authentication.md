# Feature: Authentication

## Module
User Management

## Overview
Authentication handles user sign-up, login, and session management. The system uses NextAuth.js (Auth.js) to provide secure OAuth and email-based authentication.

## User Stories

### US-AU-001: Sign Up with Email
**As a** new user  
**I want to** create an account with my email  
**So that** I can start using VisualStory

**Acceptance Criteria:**
- [ ] Email input with validation
- [ ] Password with strength requirements
- [ ] Email verification required
- [ ] Welcome email sent
- [ ] Automatic login after verification

### US-AU-002: Sign Up with Google
**As a** new user  
**I want to** sign up using my Google account  
**So that** I can get started quickly without creating a password

**Acceptance Criteria:**
- [ ] "Continue with Google" button
- [ ] OAuth consent flow
- [ ] Automatic account creation
- [ ] Profile picture imported

### US-AU-003: Log In
**As a** returning user  
**I want to** log into my account  
**So that** I can access my projects

**Acceptance Criteria:**
- [ ] Email + password login
- [ ] Google OAuth login
- [ ] "Remember me" option
- [ ] Redirect to dashboard after login

### US-AU-004: Reset Password
**As a** user who forgot my password  
**I want to** reset my password  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] "Forgot password" link
- [ ] Email with reset link
- [ ] Link expires after 1 hour
- [ ] Password update confirmation

### US-AU-005: Log Out
**As a** logged-in user  
**I want to** log out  
**So that** I can secure my account

**Acceptance Criteria:**
- [ ] Logout button in header/menu
- [ ] Session destroyed
- [ ] Redirect to homepage
- [ ] Clear local data

## Technical Specifications

### NextAuth.js Configuration

```typescript
// auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        
        if (!user || !user.password) {
          return null;
        }
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        
        if (!isValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan || 'free';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },
});
```

### Sign Up API

```typescript
// app/api/auth/signup/route.ts
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  
  // Validate input
  if (!email || !password) {
    return Response.json(
      { error: 'Email and password required' },
      { status: 400 }
    );
  }
  
  // Check password strength
  if (password.length < 8) {
    return Response.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }
  
  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existing) {
    return Response.json(
      { error: 'Email already registered' },
      { status: 409 }
    );
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      plan: 'free',
      emailVerified: null, // not verified yet
    },
  });
  
  // Create verification token
  const token = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: crypto.randomUUID(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });
  
  // Send verification email
  await sendVerificationEmail(email, token.token);
  
  return Response.json({
    message: 'Account created. Please verify your email.',
    userId: user.id,
  });
}
```

### Password Reset Flow

```typescript
// app/api/auth/forgot-password/route.ts
export async function POST(req: Request) {
  const { email } = await req.json();
  
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  // Always return success to prevent email enumeration
  if (!user) {
    return Response.json({ message: 'If email exists, reset link sent' });
  }
  
  // Delete existing tokens
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });
  
  // Create new token
  const token = await prisma.passwordResetToken.create({
    data: {
      email,
      token: crypto.randomUUID(),
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });
  
  await sendPasswordResetEmail(email, token.token);
  
  return Response.json({ message: 'If email exists, reset link sent' });
}

// app/api/auth/reset-password/route.ts
export async function POST(req: Request) {
  const { token, password } = await req.json();
  
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  
  if (!resetToken || resetToken.expires < new Date()) {
    return Response.json(
      { error: 'Invalid or expired token' },
      { status: 400 }
    );
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  });
  
  await prisma.passwordResetToken.delete({
    where: { token },
  });
  
  return Response.json({ message: 'Password reset successful' });
}
```

### Protected Routes Middleware

```typescript
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                     req.nextUrl.pathname.startsWith('/signup');
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                           req.nextUrl.pathname.startsWith('/editor') ||
                           req.nextUrl.pathname.startsWith('/settings');
  
  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL('/dashboard', req.nextUrl));
  }
  
  // Redirect unauthenticated users to login
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## UI Components

### Login Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    VisualStory Logo                         │
│                                                             │
│                    Welcome back                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🔵 Continue with Google                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│                    ────── or ──────                         │
│                                                             │
│  Email                                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ email@example.com                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Password                                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ••••••••                                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ☐ Remember me              [Forgot password?]              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     Log In                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│              Don't have an account? [Sign up]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Implementation

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };
  
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
}
```

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // null for OAuth users
  plan          Plan      @default(FREE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  projects      Project[]
  subscription  Subscription?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

model PasswordResetToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime
}

enum Plan {
  FREE
  CREATOR
  PRO
  TEAM
}
```

## Security Considerations

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for session management
- CSRF protection via SameSite cookies
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Secure password reset flow

## Dependencies
- next-auth v5 (Auth.js)
- bcryptjs
- @auth/prisma-adapter
- Resend for email delivery

## Related Features
- [Projects Library](./projects-library.md)
- [Subscription Billing](./subscription-billing.md)
