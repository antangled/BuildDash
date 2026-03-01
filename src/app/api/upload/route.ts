import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith('.stl')) {
    return NextResponse.json({ error: 'Only STL files are accepted' }, { status: 400 });
  }

  // 100MB limit
  if (file.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: 'File exceeds 100MB limit' }, { status: 400 });
  }

  // In production, upload to Supabase Storage
  // For now, return metadata
  return NextResponse.json({
    filename: file.name,
    size: file.size,
    type: file.type,
    uploadedAt: new Date().toISOString(),
  });
}
