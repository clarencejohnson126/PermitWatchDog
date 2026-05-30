// POST /api/bescheid/upload
// Body: multipart/form-data with `pdf` (the Bescheid PDF) + `email` (user contact)
//
// Pipeline:
//   1. Read PDF bytes
//   2. Send to Gemini for structured Auflagen extraction
//   3. Insert into permit_watchdog.projects
//   4. Return project_id + extracted fields for client to display+confirm
//
// No auth on this endpoint yet (we're in early T0). Add rate-limiting + abuse
// protection before shipping to the public.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractBescheid } from '@/lib/bescheid/extract';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_PDF_BYTES = 12 * 1024 * 1024;

const EmailSchema = z.string().email().max(254);

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('pdf');
    const emailRaw = form.get('email');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'pdf file is required' }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'pdf file is empty' }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: `pdf too large (${file.size} bytes, max ${MAX_PDF_BYTES})` },
        { status: 413 },
      );
    }
    if (file.type && !file.type.includes('pdf')) {
      return NextResponse.json({ error: `unsupported content-type: ${file.type}` }, { status: 415 });
    }

    const emailParsed = EmailSchema.safeParse(emailRaw);
    if (!emailParsed.success) {
      return NextResponse.json({ error: 'valid email is required' }, { status: 400 });
    }
    const email = emailParsed.data.toLowerCase().trim();

    const bytes = Buffer.from(await file.arrayBuffer());

    const extracted = await extractBescheid(bytes);

    // Parse the YYYY-MM-DD bescheid_date Gemini extracted (or null).
    let bescheidDate: Date | null = null;
    if (extracted.bescheid_date) {
      const d = new Date(extracted.bescheid_date);
      if (!isNaN(d.getTime())) bescheidDate = d;
    }

    const project = await prisma.project.create({
      data: {
        user_email: email,
        project_name: extracted.project_name,
        address: extracted.address,
        gemarkung: extracted.gemarkung,
        flur: extracted.flur,
        flurstueck: extracted.flurstueck,
        bauantrag_nr: extracted.bauantrag_nr,
        aktenzeichen: extracted.aktenzeichen,
        lifecycle_stage: extracted.lifecycle_stage,
        bescheid_auflagen: extracted.bescheid_auflagen,
        abstandsflaeche_nachbarn: extracted.abstandsflaeche_nachbarn,
        bescheid_date: bescheidDate,
      },
    });

    return NextResponse.json({
      status: 'ok',
      project_id: project.id,
      extracted,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[bescheid/upload] fail:', e);
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
