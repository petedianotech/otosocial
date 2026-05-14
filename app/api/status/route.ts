import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    gemini: !!process.env.GEMINI_API_KEY,
    linkedin: !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN),
    x: !!(process.env.X_CONSUMER_KEY && process.env.X_ACCESS_TOKEN),
    devto: !!process.env.DEVTO_API_KEY,
    blogger: !!(process.env.BLOGGER_ACCESS_TOKEN && process.env.BLOGGER_BLOG_ID),
  });
}
