const pdfParse = require("pdf-parse");

const MAX_PDF_PAGES = 10;
const MIN_TEXT_LENGTH = 50;

/**
 * Extracts and cleans text from a PDF buffer.
 * Validates that the buffer is a valid PDF and contains readable text.
 */
async function extractPdfText(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("PDF buffer is required.");
  }

  // Validate PDF magic bytes
  const pdfHeader = buffer.slice(0, 5).toString("ascii");
  if (!pdfHeader.startsWith("%PDF")) {
    throw new Error("Invalid PDF file format.");
  }

  const options = {
    max: MAX_PDF_PAGES
  };

  let data;
  try {
    data = await pdfParse(buffer, options);
  } catch (error) {
    throw new Error("Failed to parse PDF. The file may be corrupted or password-protected.");
  }

  const rawText = data.text || "";
  const cleanedText = cleanExtractedText(rawText);

  if (cleanedText.length < MIN_TEXT_LENGTH) {
    throw new Error(
      "Could not extract enough text from the PDF. " +
      "Please ensure the resume contains selectable text (not scanned images) " +
      "and has meaningful content."
    );
  }

  return {
    text: cleanedText,
    pageCount: data.numpages || 0,
    wordCount: countWords(cleanedText)
  };
}

/**
 * Cleans extracted PDF text for better readability.
 */
function cleanExtractedText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // Remove control characters
    .replace(/\uFFFD/g, "") // Remove replacement characters
    .trim();
}

/**
 * Counts words in text.
 */
function countWords(text) {
  const words = text.match(/\b[\w'-]+\b/g) || [];
  return words.length;
}

module.exports = {
  extractPdfText,
  cleanExtractedText,
  countWords
};
