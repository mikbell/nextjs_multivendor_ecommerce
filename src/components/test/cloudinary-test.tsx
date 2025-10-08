"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function CloudinaryTest() {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<any>(null);

  const testCloudinaryConfig = async () => {
    setStatus('Testing Cloudinary configuration...');
    
    console.log('🔧 Cloudinary Config:', {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      isCloudNameSet: !!CLOUD_NAME,
      isUploadPresetSet: !!UPLOAD_PRESET
    });

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setStatus('❌ Missing Cloudinary environment variables');
      return;
    }

    try {
      // Test if upload preset exists and is accessible
      const testUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
      
      // Create a simple test file (1x1 pixel PNG) directly as blob
      const imageData = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
        0x0D, 0x49, 0x44, 0x41, 0x54, 0x78, 0xDA, 0x63, 0x64, 0x60, 0xFE, 0x07,
        0x00, 0x02, 0x84, 0x01, 0x5E, 0x71, 0x18, 0xD0, 0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      
      const formData = new FormData();
      const blob = new Blob([imageData], { type: 'image/png' });
      
      formData.append('file', blob, 'test.png');
      formData.append('upload_preset', UPLOAD_PRESET);
      
      console.log('📤 Sending test upload...');
      
      const uploadResponse = await fetch(testUrl, {
        method: 'POST',
        body: formData
      });
      
      const uploadResult = await uploadResponse.json();
      
      console.log('📥 Upload response:', uploadResult);
      
      if (uploadResponse.ok && uploadResult.secure_url) {
        setStatus('✅ Cloudinary configuration is working!');
        setResult(uploadResult);
      } else {
        setStatus('❌ Upload failed: ' + (uploadResult.error?.message || 'Unknown error'));
        setResult(uploadResult);
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      setStatus('❌ Test error: ' + (error as Error).message);
      setResult(error);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Cloudinary Configuration Test</h2>
      
      <div className="mb-4">
        <p><strong>Cloud Name:</strong> {CLOUD_NAME || '❌ Not set'}</p>
        <p><strong>Upload Preset:</strong> {UPLOAD_PRESET || '❌ Not set'}</p>
      </div>

      <Button onClick={testCloudinaryConfig} className="mb-4">
        Test Cloudinary Upload
      </Button>
      
      {status && (
        <div className="mb-4">
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}
      
      {result && (
        <div>
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}