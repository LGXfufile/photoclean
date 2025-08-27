'use client';

import { useState, useEffect, useRef } from 'react';
import { DetectedPerson, ProcessingStep } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ImageEditorProps {
  imageUrl: string;
  fileName: string;
  onReset: () => void;
}

export default function ImageEditor({ imageUrl, fileName, onReset }: ImageEditorProps) {
  const [detectedPeople, setDetectedPeople] = useState<DetectedPerson[]>([]);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>({
    step: 'detect',
    progress: 0,
    message: 'Analyzing image...'
  });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageUrl) {
      detectPeople();
    }
  }, [imageUrl]);

  const detectPeople = async () => {
    setProcessingStep({
      step: 'detect',
      progress: 30,
      message: 'Detecting people in the image...'
    });

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDetectedPeople(result.detections);
        setProcessingStep({
          step: 'detect',
          progress: 100,
          message: result.message
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Detection failed:', error);
      setProcessingStep({
        step: 'detect',
        progress: 100,
        message: 'Detection failed. Please try again.'
      });
    }
  };

  const togglePersonSelection = (personId: string) => {
    setDetectedPeople(prev =>
      prev.map(person =>
        person.id === personId
          ? { ...person, selected: !person.selected }
          : person
      )
    );
  };

  const processImage = async () => {
    const selectedPeople = detectedPeople.filter(person => person.selected);
    if (selectedPeople.length === 0) {
      alert('Please select at least one person to remove');
      return;
    }

    setIsProcessing(true);
    setProcessingStep({
      step: 'process',
      progress: 0,
      message: 'Removing selected people...'
    });

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageUrl,
          selectedPeople: selectedPeople
        }),
      });

      const result = await response.json();

      if (result.success) {
        setResultImage(result.cleanedImage);
        setProcessingStep({
          step: 'complete',
          progress: 100,
          message: result.message
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Processing failed:', error);
      setProcessingStep({
        step: 'process',
        progress: 100,
        message: 'Processing failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;

    const link = document.createElement('a');
    link.download = `cleaned_${fileName}`;
    link.href = resultImage;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">AI Photo Editor</h2>
          <button
            onClick={onReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Upload New Photo
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Original Photo</h3>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Original"
                className="w-full h-auto max-h-96 object-contain"
              />
              
              {detectedPeople.map((person) => (
                <div
                  key={person.id}
                  className={`absolute border-2 cursor-pointer transition-colors ${
                    person.selected
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-yellow-400 bg-yellow-400/20'
                  }`}
                  style={{
                    left: `${person.x}px`,
                    top: `${person.y}px`,
                    width: `${person.width}px`,
                    height: `${person.height}px`,
                  }}
                  onClick={() => togglePersonSelection(person.id)}
                >
                  <div className={`absolute -top-6 left-0 px-2 py-1 text-xs font-medium rounded ${
                    person.selected
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-400 text-black'
                  }`}>
                    {person.selected ? 'Will Remove' : 'Keep'}
                  </div>
                </div>
              ))}
            </div>

            {detectedPeople.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>AI Detected {detectedPeople.length} people</strong>
                </p>
                <p className="text-xs text-blue-600">
                  Click on the highlighted boxes to toggle selection. Red = will be removed.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {resultImage ? 'Cleaned Photo' : 'Preview'}
            </h3>
            
            {resultImage ? (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={resultImage}
                  alt="Result"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Cleaned photo will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <ProgressBar
            progress={processingStep.progress}
            message={processingStep.message}
          />
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {!resultImage ? (
            <button
              onClick={processImage}
              disabled={isProcessing || detectedPeople.filter(p => p.selected).length === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Remove Selected People</span>
              )}
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={downloadImage}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Cleaned Photo
              </button>
              <button
                onClick={() => {
                  setResultImage(null);
                  setProcessingStep({
                    step: 'detect',
                    progress: 100,
                    message: `Found ${detectedPeople.length} people. Select which ones to remove.`
                  });
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Different Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}