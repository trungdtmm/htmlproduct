export interface ProductAttribute {
  id: string;
  label: string;
  value: string;
}

export interface ProductData {
  sku: string;            // Mã Hàng (Fixed)
  attributes: ProductAttribute[]; // Dynamic rows (e.g., Author, Brand, Material, etc.)
  additionalInfo: string; // Thông tin thêm (Fixed bottom text)
}

export const INITIAL_DATA: ProductData = {
  sku: '',
  attributes: [
    { id: '1', label: 'Tác giả', value: '' },
    { id: '2', label: 'Nhà xuất bản', value: '' },
    { id: '3', label: 'Năm xuất bản', value: '' },
    { id: '4', label: 'Trọng lượng (gr)', value: '' },
    { id: '5', label: 'Kích thước', value: '' },
    { id: '6', label: 'Số trang', value: '' },
    { id: '7', label: 'Hình thức', value: '' },
  ],
  additionalInfo: '',
};