import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // Get user role if authenticated
    let userRole = 'guest';
    if (!user.error) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.data.user.id)
        .single();
      userRole = profile?.role || 'customer';
    }

    // Protected routes handling
    if (request.nextUrl.pathname.startsWith("/protected")) {
      if (user.error) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    // Role-based route protection
    if (request.nextUrl.pathname.startsWith("/admin") && userRole !== 'admin') {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/provider")) {
      if (userRole !== 'provider' && userRole !== 'admin') {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Redirect authenticated users based on role
    if (request.nextUrl.pathname === "/") {
      if (!user.error) {
        switch (userRole) {
          case 'admin':
            return NextResponse.redirect(new URL("/admin", request.url));
          case 'provider':
            return NextResponse.redirect(new URL("/provider", request.url));
          case 'customer':
            return NextResponse.redirect(new URL("/bookings", request.url));
        }
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
