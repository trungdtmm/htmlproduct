import React, { useState, useEffect } from 'react';
import { INITIAL_DATA, ProductData } from './types';
import { generateProductHtml } from './services/htmlGenerator';
import { InputForm } from './components/InputForm';
import { OutputPreview } from './components/OutputPreview';
import { SmartExtractor } from './components/SmartExtractor';
import { Box, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [productData, setProductData] = useState<ProductData>(INITIAL_DATA);
  const [htmlOutput, setHtmlOutput] = useState('');

  // Update HTML whenever data changes
  useEffect(() => {
    const html = generateProductHtml(productData);
    setHtmlOutput(html);
  }, [productData]);

  const handleInputChange = (field: keyof ProductData, value: string) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDataExtracted = (extractedData: Partial<ProductData>) => {
    setProductData((prev) => ({
      ...prev,
      ...extractedData,
    }));
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hết dữ liệu không?')) {
      setProductData(INITIAL_DATA);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Box className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Tạo Mã Sản Phẩm
            </h1>
          </div>
          <button
            onClick={handleReset}
            className="text-sm font-medium text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <SmartExtractor onDataExtracted={handleDataExtracted} />
            <InputForm data={productData} onChange={handleInputChange} />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7 h-[600px] lg:h-auto lg:sticky lg:top-24">
            <OutputPreview htmlContent={htmlOutput} />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
           © 2024 Product HTML Generator. Built with React & Gemini.
        </div>
      </footer>
    </div>
  );
};

export default App;