import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  return text.trim();
}