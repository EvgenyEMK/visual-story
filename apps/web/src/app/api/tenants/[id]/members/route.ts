// Purpose: List tenant members and invite new members
// Doc: docs/product-summary/MVP-architecture.md
// Services: @/lib/db/supabase
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement — list members of the tenant (with roles)
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement — invite a new member by email, assign role
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
