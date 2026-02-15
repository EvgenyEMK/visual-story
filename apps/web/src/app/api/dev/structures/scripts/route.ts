/**
 * DEV-ONLY API route — returns DEMO_SCRIPTS as JSON.
 *
 * GET /api/dev/structures/scripts
 */

import { NextResponse } from 'next/server';
import { DEMO_SCRIPTS } from '@/config/demo-slides';
import { devJsonReplacer } from '../_lib/replacer';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Dev only' }, { status: 403 });
  }

  return new NextResponse(JSON.stringify(DEMO_SCRIPTS, devJsonReplacer, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
