import React, { useState } from 'react';
import { extractProductInfo, ExtractionResult } from '../services/geminiService';
import { ProductData } from '../types';
import { Sparkles, Loader2, ArrowRight, Search, ExternalLink } from 'lucide-react';

interface SmartExtractorProps {
  onDataExtracted: (data: Partial<ProductData>) => void;
}

export const SmartExtractor: React.FC<SmartExtractorProps> = ({ onDataExtracted }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    setSources([]);
    
    try {
      const result: ExtractionResult = await extractProductInfo(inputText);
      onDataExtracted(result.data);
      setSources(result.sources);
      // We keep the input text so user can see what they searched, or clear it if desired. 
      // Let's clear it to indicate "done" but maybe keeping it is better for context? 
      // The previous version cleared it. Let's keep it clear for clean UX.
      setInputText(''); 
    } catch (err) {
      setError("Không thể tìm kiếm thông tin. Vui lòng thử lại chi tiết hơn.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6 mb-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-900">Tìm kiếm & Điền tự động (AI)</h3>
          <p className="text-sm text-gray-500">Nhập tên sản phẩm (ví dụ: "Sách Doraemon Tập 1") hoặc dán mô tả. AI sẽ tự động tìm kiếm thông tin còn thiếu.</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-24 p-3 pr-12 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white/80 backdrop-blur-sm"
          placeholder="Ví dụ: Nhập 'Solo Leveling tập 2' và AI sẽ tự tìm tác giả, NXB, kích thước..."
        />
        <button
          onClick={handleExtract}
          disabled={isProcessing || !inputText.trim()}
          className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
          title="Phân tích & Tìm kiếm"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      
      {sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-indigo-100">
          <p className="text-xs font-medium text-gray-500 mb-1">Nguồn thông tin:</p>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <a 
                key={index}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 bg-white px-2 py-1 rounded border border-indigo-100 hover:border-indigo-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};