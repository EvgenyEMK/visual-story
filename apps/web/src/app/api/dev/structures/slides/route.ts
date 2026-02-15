/**
 * DEV-ONLY API route — returns the fully resolved DEMO_SLIDES array as JSON.
 *
 * GET /api/dev/structures/slides
 */

import { NextResponse } from 'next/server';
import { DEMO_SLIDES } from '@/config/demo-slides';
import { devJsonReplacer } from '../_lib/replacer';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  return new NextResponse(JSON.stringify(DEMO_SLIDES, devJsonReplacer, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
