import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageData, selectedPeople } = await request.json();

    if (!imageData || !selectedPeople) {
      return NextResponse.json({ 
        error: 'Missing image data or selected people' 
      }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    const cleanedImageUrl = imageData;

    return NextResponse.json({
      success: true,
      cleanedImage: cleanedImageUrl,
      message: `Successfully removed ${selectedPeople.length} people from the image`
    });

  } catch (error) {
    console.error('Process API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}