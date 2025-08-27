import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockDetections = [
      {
        id: '1',
        x: 120,
        y: 180,
        width: 95,
        height: 140,
        confidence: 0.94,
        selected: true
      },
      {
        id: '2',
        x: 280,
        y: 160,
        width: 85,
        height: 125,
        confidence: 0.87,
        selected: true
      },
      {
        id: '3',
        x: 450,
        y: 200,
        width: 75,
        height: 115,
        confidence: 0.92,
        selected: true
      }
    ];

    return NextResponse.json({
      success: true,
      detections: mockDetections,
      message: `Detected ${mockDetections.length} people in the image`
    });

  } catch (error) {
    console.error('Detection API error:', error);
    return NextResponse.json(
      { error: 'Failed to detect people in image' },
      { status: 500 }
    );
  }
}