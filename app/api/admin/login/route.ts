import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Master Admin Credentials for GEO Trips staff/management (configurable via env vars in production)
const getMasterCredentials = () => {
  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const configuredEmail = (process.env.ADMIN_EMAIL || 'admin@geotrips.com').toLowerCase();
  
  return [
    { email: configuredEmail, password: configuredPassword },
    { email: 'geotrips19@gmail.com', password: configuredPassword },
  ];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    // Handle logout action
    if (body.action === 'logout') {
      cookieStore.delete('geo_admin_session');
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const matched = getMasterCredentials().find(
      (c) => c.email.toLowerCase() === normalizedEmail && c.password === password
    );

    if (matched) {
      // Set session cookie for 7 days
      cookieStore.set('geo_admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        admin: {
          email: matched.email,
          role: 'admin',
          full_name: 'Md Mesbah Uddin (Admin)',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
