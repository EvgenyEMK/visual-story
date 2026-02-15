/**
 * DEV-ONLY API route — returns ALL demo structures in a single response.
 *
 * GET /api/dev/structures/all
 */

import { NextResponse } from 'next/server';
import { DEMO_SLIDES, DEMO_SECTIONS, DEMO_SCRIPTS } from '@/config/demo-slides';
import { devJsonReplacer } from '../_lib/replacer';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  const payload = {
    sections: DEMO_SECTIONS,
    slides: DEMO_SLIDES,
    scripts: DEMO_SCRIPTS,
  };

  return new NextResponse(JSON.stringify(payload, devJsonReplacer, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
