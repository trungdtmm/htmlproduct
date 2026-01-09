import React from 'react';
import { ProductData, ProductAttribute } from '../types';
import { PencilLine, Plus, Trash2, GripVertical } from 'lucide-react';

interface InputFormProps {
  data: ProductData;
  onChange: (field: keyof ProductData, value: any) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ data, onChange }) => {
  
  const handleAttributeChange = (id: string, field: 'label' | 'value', newValue: string) => {
    const newAttributes = data.attributes.map(attr => 
      attr.id === id ? { ...attr, [field]: newValue } : attr
    );
    onChange('attributes', newAttributes);
  };

  const handleAddAttribute = () => {
    const newAttribute: ProductAttribute = {
      id: `manual-${Date.now()}`,
      label: '',
      value: ''
    };
    onChange('attributes', [...data.attributes, newAttribute]);
  };

  const handleDeleteAttribute = (id: string) => {
    onChange('attributes', data.attributes.filter(attr => attr.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <PencilLine className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Thông tin sản phẩm</h2>
      </div>
      
      <div className="space-y-6">
        {/* Fixed SKU Field */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 md:col-span-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Tên trường (Cố định)</label>
             <input
                disabled
                value="Mã Hàng"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
             />
          </div>
          <div className="col-span-12 md:col-span-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <input
              type="text"
              value={data.sku}
              onChange={(e) => onChange('sku', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Nhập mã hàng..."
            />
          </div>
        </div>

        {/* Dynamic Attributes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
             <label className="text-sm font-medium text-gray-700">Thông tin chi tiết</label>
             <button 
               onClick={handleAddAttribute}
               className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
             >
               <Plus className="w-3 h-3" /> Thêm dòng
             </button>
          </div>
          
          {data.attributes.map((attr) => (
            <div key={attr.id} className="grid grid-cols-12 gap-2 md:gap-4 items-start group">
              <div className="col-span-4 md:col-span-4">
                <input
                  type="text"
                  value={attr.label}
                  onChange={(e) => handleAttributeChange(attr.id, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm placeholder-gray-400"
                  placeholder="Tên trường (vd: Màu sắc)"
                />
              </div>
              <div className="col-span-7 md:col-span-7">
                <input
                  type="text"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(attr.id, 'value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm placeholder-gray-400"
                  placeholder="Nội dung"
                />
              </div>
              <div className="col-span-1 md:col-span-1 flex justify-center pt-2">
                <button
                  onClick={() => handleDeleteAttribute(attr.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Xóa dòng này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {data.attributes.length === 0 && (
            <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500">
              Chưa có thông tin chi tiết. Nhấn "Thêm dòng" để bắt đầu.
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin thêm (Mô tả sản phẩm)</label>
          <textarea
            value={data.additionalInfo}
            onChange={(e) => onChange('additionalInfo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[120px] resize-y"
            placeholder="Nhập mô tả chi tiết, tóm tắt nội dung..."
          />
        </div>
      </div>
    </div>
  );
};