export function transform_text(text: string, wordsPerChunk = 80): string[] {
  if (!text) return [];

  // 1️⃣ First, split on punctuation followed by space
  const sentences = text.split(/(?<=[.!?])\s+/);

  // 2️⃣ If we didn’t find punctuation, fallback to word chunks
  if (sentences.length === 1) {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }
    return chunks;
  }

  // 3️⃣ Group sentences into ~wordsPerChunk each (for huge sentences)
  const paragraphs: string[] = [];
  let current = "";
  let count = 0;

  sentences.forEach((s) => {
    const w = s.split(/\s+/).length;
    if (count + w > wordsPerChunk && current) {
      paragraphs.push(current.trim());
      current = s;
      count = w;
    } else {
      current += (current ? " " : "") + s;
      count += w;
    }
  });

  if (current.trim()) paragraphs.push(current.trim());
  return paragraphs;
}
