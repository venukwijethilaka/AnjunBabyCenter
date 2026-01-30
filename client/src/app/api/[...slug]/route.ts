import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  slug: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const slug = params.slug;
  const path = slug.join('/');

  try {
    const backendUrl = `http://anjun_baby_server:8000/${path}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const slug = params.slug;
  const path = slug.join('/');
  const body = await request.json();

  try {
    const backendUrl = `http://anjun_baby_server:8000/${path}`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const slug = params.slug;
  const path = slug.join('/');
  const body = await request.json();

  try {
    const backendUrl = `http://anjun_baby_server:8000/${path}`;

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const slug = params.slug;
  const path = slug.join('/');

  try {
    const backendUrl = `http://anjun_baby_server:8000/${path}`;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}
