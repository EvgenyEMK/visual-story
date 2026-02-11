// Purpose: List projects (with pagination, sort, search) and create new projects
// Doc: docs/modules/user-management/projects-library.md
// Services: @/lib/db/supabase
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // TODO: Implement — list projects with pagination, sort, search filters
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}

export async function POST(request: Request) {
  // TODO: Implement — create a new project
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
