// Purpose: Trigger video export via Remotion Lambda
// Doc: docs/modules/export-publish/video-export.md
// Services: @/services/export/video-export
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement — accept export options (format, resolution, quality),
  // trigger Remotion Lambda render, create export record in DB,
  // return export ID for status polling
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
