const pdfParse = require("pdf-parse");

async function extractPdfText(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("PDF buffer is required.");
  }

  const data = await pdfParse(buffer);
  return cleanExtractedText(data.text || "");
}

function cleanExtractedText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

module.exports = {
  extractPdfText,
  cleanExtractedText
};
