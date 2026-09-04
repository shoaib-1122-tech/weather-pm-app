import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WeatherLog from '@/models/WeatherLog';

export async function GET() {
  try {
    await connectToDatabase();
    const logs = await WeatherLog.find({}).sort({ searchedAt: -1 });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch search history' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newLog = await WeatherLog.create(body);
    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save weather log' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      await WeatherLog.findByIdAndDelete(id);
      return NextResponse.json({ message: 'Log deleted successfully' });
    }
    await WeatherLog.deleteMany({});
    return NextResponse.json({ message: 'All logs cleared' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete logs' }, { status: 500 });
  }
}
