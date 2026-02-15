/**
 * DEV-ONLY API route — returns demo slide items as JSON.
 *
 * GET /api/dev/structures/widgets
 *
 * Returns the DEMO_SLIDES array for inspection.
 */

import { NextResponse } from 'next/server';
import { DEMO_SLIDES } from '@/config/demo-slides';
import { devJsonReplacer } from '../_lib/replacer';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  const items = DEMO_SLIDES.map((s) => ({
    id: s.id,
    title: s.title,
    items: s.items,
    scenes: s.scenes,
  }));

  return new NextResponse(JSON.stringify(items, devJsonReplacer, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
