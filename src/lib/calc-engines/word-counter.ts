export interface WordCounterStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  readingTimeString: string;
  speakingTimeMinutes: number;
  speakingTimeString: string;
  avgWordLength: number;
}

export function analyzeText(text: string): WordCounterStats {
  if (!text || text.trim().length === 0) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      readingTimeString: "0 min",
      speakingTimeMinutes: 0,
      speakingTimeString: "0 min",
      avgWordLength: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  // Words: match alphanumeric and hyphenated words
  const wordsMatch = text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
  const words = wordsMatch ? wordsMatch.length : 0;

  // Sentences: split on ., !, ? followed by space or end
  const sentencesMatch = text
    .trim()
    .split(/[.!?]+(?:\s+|$)/)
    .filter((s) => s.trim().length > 0);
  const sentences = sentencesMatch.length;

  // Paragraphs: split on 2 or more newlines
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Reading time (200 words/min)
  const readingTimeMinutes = words > 0 ? words / 200 : 0;
  const readingTimeString = formatDuration(readingTimeMinutes);

  // Speaking time (130 words/min)
  const speakingTimeMinutes = words > 0 ? words / 130 : 0;
  const speakingTimeString = formatDuration(speakingTimeMinutes);

  // Avg word length
  const totalLetters = wordsMatch ? wordsMatch.reduce((sum, w) => sum + w.length, 0) : 0;
  const avgWordLength = words > 0 ? parseFloat((totalLetters / words).toFixed(1)) : 0;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    readingTimeString,
    speakingTimeMinutes,
    speakingTimeString,
    avgWordLength,
  };
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 min";
  if (minutes < 1) {
    const sec = Math.ceil(minutes * 60);
    return `${sec} sec`;
  }
  const fullMin = Math.floor(minutes);
  const sec = Math.round((minutes - fullMin) * 60);
  if (sec === 0) return `${fullMin} min`;
  return `${fullMin} min ${sec} sec`;
}
