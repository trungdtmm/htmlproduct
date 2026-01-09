import { ProductData } from '../types';

export const generateProductHtml = (data: ProductData): string => {
  // Generate rows from the dynamic attributes array
  // We explicitly handle the SKU row first as per the requested format
  
  const attributeRows = data.attributes.map(attr => 
    `<tr><td style="width:167px">${attr.label}</td><td style="width:235px">${attr.value}</td></tr>`
  ).join('');

  const infoContent = data.additionalInfo ? data.additionalInfo.replace(/\n/g, '<br/>') : '';

  return `<p>&nbsp;</p><p>####</p><table cellpadding="0" cellspacing="0" border="1" style="border-collapse:collapse; height:350px; width:409px"><tbody><tr><td style="width:167px">Mã Hàng</td><td style="width:235px">${data.sku}</td></tr>${attributeRows}</tbody></table><p>&nbsp;<p>&nbsp;</p>${infoContent}</p>`;
};