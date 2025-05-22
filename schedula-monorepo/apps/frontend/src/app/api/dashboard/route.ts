import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request as any });
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch dashboard data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 