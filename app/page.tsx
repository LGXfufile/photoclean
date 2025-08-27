'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import ImageEditor from '@/components/ImageEditor';
import Header from '@/components/Header';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleImageUpload = (imageUrl: string, name: string) => {
    setUploadedImage(imageUrl);
    setFileName(name);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!uploadedImage ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Remove Unwanted People
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Upload your photo and let AI automatically detect and remove people in the background
              </p>
            </div>
            <UploadZone onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <ImageEditor 
            imageUrl={uploadedImage} 
            fileName={fileName}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Powered by AI • Made with ❤️</p>
      </footer>
    </div>
  );
}