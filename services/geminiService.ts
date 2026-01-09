import { GoogleGenAI, Type } from "@google/genai";
import { ProductData } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ExtractionResult {
  data: Partial<ProductData>;
  sources: { title: string; uri: string }[];
}

export const extractProductInfo = async (rawText: string): Promise<ExtractionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a product data assistant.
      
      User Input: "${rawText}"

      Task:
      1. Identify the product category (Book, Toy, Stationery, Electronics, Household, etc.).
      2. Extract specific specifications relevant to that category as key-value pairs (Label and Value).
         - For BOOKS: Author, Publisher, Publish Year, Pages, Format.
         - For TOYS: Brand, Material, Origin, Age Range.
         - For STATIONERY: Brand, Color, Unit, Type.
         - For GENERAL GOODS: Brand, Origin, Expiry Date, Ingredients.
      3. Always extract "Mã Hàng" (SKU/Barcode) if available.
      4. Always extract "Weight" (Trọng lượng) and "Size" (Kích thước) if available.
      5. Translate all labels and values to Vietnamese (e.g., "Material" -> "Chất liệu", "Plastic" -> "Nhựa").
      6. For 'additionalInfo', write a compelling summary/description in Vietnamese.
      
      Return data in JSON format with a list of attributes.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sku: { type: Type.STRING, description: "Product code / Barcode / ISBN" },
            attributes: {
              type: Type.ARRAY,
              description: "List of product specifications for the table rows",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "The name of the specification (e.g., 'Thương hiệu', 'Chất liệu')" },
                  value: { type: Type.STRING, description: "The value of the specification" },
                }
              }
            },
            additionalInfo: { type: Type.STRING, description: "A detailed product summary/description in Vietnamese." },
          },
        },
      },
    });

    const text = response.text;
    const json = text ? JSON.parse(text) : {};

    // Map JSON attributes to our internal structure with IDs
    const mappedAttributes = (json.attributes || []).map((attr: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      label: attr.label,
      value: attr.value
    }));

    const partialData: Partial<ProductData> = {
      sku: json.sku || '',
      attributes: mappedAttributes,
      additionalInfo: json.additionalInfo || ''
    };

    // Extract grounding sources (URLs)
    const sources: { title: string; uri: string }[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri,
          });
        }
      });
    }

    return { data: partialData, sources };
  } catch (error) {
    console.error("Gemini extraction error:", error);
    throw new Error("Failed to extract product information.");
  }
};