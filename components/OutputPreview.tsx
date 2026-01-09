import React, { useState } from 'react';
import { Check, Copy, Code, Eye } from 'lucide-react';

interface OutputPreviewProps {
  htmlContent: string;
}

export const OutputPreview: React.FC<OutputPreviewProps> = ({ htmlContent }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Xem trước
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'code'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            Mã HTML
          </button>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all border ${
            copied
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Đã sao chép
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Sao chép
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-0 bg-gray-50">
        {activeTab === 'preview' ? (
          <div className="p-6 flex justify-center min-h-[400px]">
             {/* We use dangerouslySetInnerHTML to render the exact output structure */}
            <div 
                className="bg-white p-8 shadow-sm border border-gray-100 w-full max-w-2xl overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          </div>
        ) : (
          <div className="p-0 h-full">
            <textarea
              readOnly
              value={htmlContent}
              className="w-full h-full p-4 font-mono text-sm text-gray-800 bg-gray-900 text-gray-100 resize-none outline-none leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
};