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
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // 如果有FAL API密钥且账户有余额，尝试使用真实检测
    if (process.env.FAL_KEY) {
      try {
        // 使用FAL AI的人物检测模型
        const result: any = await fal.subscribe("fal-ai/yolov8", {
          input: {
            image_url: imageData,
            model_size: "medium",
            conf_threshold: 0.25,
            iou_threshold: 0.45
          },
          logs: true,
        });

        // 过滤出人物检测结果
        if (result.detections && result.detections.length > 0) {
          const personDetections = result.detections
            .filter((detection: any) => detection.label === 'person')
            .map((detection: any, index: number) => ({
              id: `person_${index}`,
              x: Math.round(detection.bbox[0]),
              y: Math.round(detection.bbox[1]), 
              width: Math.round(detection.bbox[2] - detection.bbox[0]),
              height: Math.round(detection.bbox[3] - detection.bbox[1]),
              confidence: Math.round(detection.confidence * 100) / 100,
              selected: true
            }));

          if (personDetections.length > 0) {
            return NextResponse.json({
              success: true,
              detections: personDetections,
              message: `AI Detected ${personDetections.length} people in the image`
            });
          }
        }

      } catch (apiError: any) {
        console.error('FAL AI error:', apiError);
        
        // 如果是余额不足等错误，记录但不中断流程
        if (apiError.status === 403) {
          console.log('FAL API quota exhausted, falling back to demo mode');
        }
      }
    }
    
    // 演示模式：返回智能模拟的检测结果
    const demoDetections = [
      {
        id: 'demo_1',
        x: 180,
        y: 160,
        width: 110,
        height: 150,
        confidence: 0.94,
        selected: true
      },
      {
        id: 'demo_2', 
        x: 350,
        y: 180,
        width: 95,
        height: 135,
        confidence: 0.87,
        selected: true
      },
      {
        id: 'demo_3', 
        x: 520,
        y: 200,
        width: 85,
        height: 125,
        confidence: 0.91,
        selected: true
      }
    ];

    return NextResponse.json({
      success: true,
      detections: demoDetections,
      message: `Demo Mode: Simulated detection of ${demoDetections.length} people`
    });

  } catch (error) {
    console.error('Detection API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to detect people in image'
    }, { status: 500 });
  }
}