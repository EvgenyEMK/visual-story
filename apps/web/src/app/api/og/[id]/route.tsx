// Purpose: Generate Open Graph image for shared presentations
// Doc: docs/modules/export-publish/embed-sharing.md
// Services: @/lib/db/supabase
// Note: Uses .tsx extension for JSX with next/og ImageResponse
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';
// import { ImageResponse } from 'next/og';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Implement — fetch project/share metadata from Supabase,
  // render an OG image using ImageResponse with project title,
  // thumbnail, and branding
  //
  // Example:
  // return new ImageResponse(
  //   <div style={{ ... }}>
  //     <h1>{project.title}</h1>
  //   </div>,
  //   { width: 1200, height: 630 }
  // );

  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
