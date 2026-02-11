// Purpose: Duplicate an existing project (deep copy)
// Doc: docs/modules/user-management/projects-library.md
// Services: @/lib/db/supabase
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement — deep copy project record, slides, and assets;
  // assign new ID and "Copy of ..." title
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
