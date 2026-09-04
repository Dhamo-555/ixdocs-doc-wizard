/**
 * Secure password generation engine using native Web Cryptography API (crypto.getRandomValues).
 * Never uses Math.random().
 */

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean; // avoid 0, O, o, 1, l, I
}

export interface GeneratedPasswordResult {
  password: string;
  entropyBits: number;
  strength: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  strengthPercent: number;
}

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS_CHARS = "0Oo1lI|";

export function generateSecurePassword(options: PasswordOptions): GeneratedPasswordResult {
  let pool = "";
  const requiredChars: string[] = [];

  const filterAmbiguous = (chars: string) =>
    options.avoidAmbiguous
      ? chars
          .split("")
          .filter((c) => !AMBIGUOUS_CHARS.includes(c))
          .join("")
      : chars;

  if (options.uppercase) {
    const chars = filterAmbiguous(UPPERCASE_CHARS);
    if (chars.length > 0) {
      pool += chars;
      requiredChars.push(getRandomChar(chars));
    }
  }

  if (options.lowercase) {
    const chars = filterAmbiguous(LOWERCASE_CHARS);
    if (chars.length > 0) {
      pool += chars;
      requiredChars.push(getRandomChar(chars));
    }
  }

  if (options.numbers) {
    const chars = filterAmbiguous(NUMBER_CHARS);
    if (chars.length > 0) {
      pool += chars;
      requiredChars.push(getRandomChar(chars));
    }
  }

  if (options.symbols) {
    const chars = filterAmbiguous(SYMBOL_CHARS);
    if (chars.length > 0) {
      pool += chars;
      requiredChars.push(getRandomChar(chars));
    }
  }

  // Fallback if no sets selected
  if (!pool) {
    pool = filterAmbiguous(LOWERCASE_CHARS + NUMBER_CHARS);
  }

  const length = Math.max(4, Math.min(128, options.length));
  const passwordChars: string[] = [...requiredChars];

  // Fill remaining slots
  while (passwordChars.length < length) {
    const c = getRandomChar(pool);
    if (c) passwordChars.push(c);
  }

  // Cryptographically shuffle the characters using Fisher-Yates with crypto.getRandomValues
  const shuffled = cryptoShuffle(passwordChars).slice(0, length).join("");

  // Calculate entropy: E = length * log2(poolSize)
  const poolSize = pool.length;
  const entropyBits = Math.round(length * Math.log2(poolSize || 1));

  let strength: GeneratedPasswordResult["strength"] = "Weak";
  let strengthPercent = 20;

  if (entropyBits >= 80) {
    strength = "Very Strong";
    strengthPercent = 100;
  } else if (entropyBits >= 60) {
    strength = "Strong";
    strengthPercent = 80;
  } else if (entropyBits >= 45) {
    strength = "Good";
    strengthPercent = 60;
  } else if (entropyBits >= 30) {
    strength = "Fair";
    strengthPercent = 40;
  }

  return {
    password: shuffled,
    entropyBits,
    strength,
    strengthPercent,
  };
}

/**
 * Select a single character uniformly from the charset using crypto.getRandomValues.
 * Uses rejection sampling to prevent modulo bias.
 */
function getRandomChar(charset: string): string {
  const charLength = charset.length;
  if (charLength === 0) return "";

  const maxValidByte = 256 - (256 % charLength);
  const randomBytes = new Uint8Array(1);

  while (true) {
    getSecureRandomBytes(randomBytes);
    const byte = randomBytes[0];
    if (byte !== undefined && byte < maxValidByte) {
      const ch = charset.charAt(byte % charLength);
      if (ch) return ch;
    }
  }
}

/**
 * Fisher-Yates in-place shuffle using crypto.getRandomValues.
 */
function cryptoShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    const temp = result[i];
    const target = result[j];
    if (temp !== undefined && target !== undefined) {
      result[i] = target;
      result[j] = temp;
    }
  }
  return result;
}

/**
 * Returns a cryptographically uniform random integer in [min, max] inclusive.
 */
function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 1) return min;

  const maxValid = 256 - (256 % range);
  const buf = new Uint8Array(1);

  while (true) {
    getSecureRandomBytes(buf);
    const byte = buf[0];
    if (byte !== undefined && byte < maxValid) {
      return min + (byte % range);
    }
  }
}

function getSecureRandomBytes(target: Uint8Array): void {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(target);
    return;
  }
  throw new Error("Secure crypto.getRandomValues is not supported in this browser environment.");
}
