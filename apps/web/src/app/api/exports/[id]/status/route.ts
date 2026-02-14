// Purpose: Check export render status and progress
// Doc: docs/modules/export-publish/video-export.md
// Services: @/services/export/video-export
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement — query Remotion Lambda render status,
  // return progress percentage, status (pending/rendering/done/failed),
  // and download URL when complete
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
