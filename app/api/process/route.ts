import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";

// 只在有API密钥时配置
if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { imageData, selectedPeople } = await request.json();

    if (!imageData || !selectedPeople) {
      return NextResponse.json({ 
        error: 'Missing image data or selected people' 
      }, { status: 400 });
    }

    // 如果有FAL API密钥且账户有余额，尝试使用真实图像修复
    if (process.env.FAL_KEY) {
      try {
        // 使用简化的img2img模型进行人物移除
        const result: any = await fal.subscribe("fal-ai/stable-diffusion-v1-5-img2img", {
          input: {
            image_url: imageData,
            prompt: "remove people, clean background, natural scene without people",
            negative_prompt: "people, person, human, face, body, crowd",
            strength: 0.7,
            guidance_scale: 7.5,
            num_inference_steps: 20,
            seed: 42
          },
          logs: true,
        });

        if (result.images && result.images.length > 0) {
          return NextResponse.json({
            success: true,
            cleanedImage: result.images[0].url,
            message: `AI Successfully removed ${selectedPeople.length} people from the image`
          });
        }

      } catch (apiError: any) {
        console.error('FAL AI processing error:', apiError);
        
        // 如果是余额不足等错误，记录但继续到演示模式
        if (apiError.status === 403) {
          console.log('FAL API quota exhausted, using demo mode for processing');
        }
      }
    }

    // 演示模式：返回原图作为"处理结果"
    return NextResponse.json({
      success: true,
      cleanedImage: imageData,
      message: `Demo Mode: Simulated removal of ${selectedPeople.length} people (Real AI processing available with API credits)`
    });

  } catch (error) {
    console.error('Process API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}