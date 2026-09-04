import { generateSecurePassword } from "./password-generator";

export type RandomPasswordPreset = "strong" | "ultra" | "pin" | "memorable";

export interface RandomPresetOptions {
  preset: RandomPasswordPreset;
  customLength?: number | undefined;
}

const MEMORABLE_WORDS = [
  "amber",
  "beacon",
  "breeze",
  "canyon",
  "cedar",
  "cipher",
  "comet",
  "cosmic",
  "crystal",
  "delta",
  "eagle",
  "falcon",
  "forest",
  "galaxy",
  "glacier",
  "harbor",
  "haven",
  "horizon",
  "island",
  "journey",
  "laser",
  "legacy",
  "lunar",
  "meadow",
  "mosaic",
  "nebula",
  "nexus",
  "oasis",
  "orbit",
  "peak",
  "phoenix",
  "planet",
  "prism",
  "pulse",
  "quantum",
  "radiant",
  "ridge",
  "river",
  "rover",
  "shadow",
  "shield",
  "solar",
  "spark",
  "summit",
  "timber",
  "titan",
  "valley",
  "vortex",
  "voyage",
  "zenith",
];

export function generateByPreset(options: RandomPresetOptions): {
  password: string;
  preset: RandomPasswordPreset;
  strength: string;
} {
  const { preset } = options;

  if (preset === "pin") {
    const len = options.customLength || 6;
    const digits = "0123456789";
    const buf = new Uint8Array(len);
    crypto.getRandomValues(buf);
    let pin = "";
    for (let i = 0; i < len; i++) {
      const b = buf[i] ?? 0;
      pin += digits[b % 10] ?? "0";
    }
    return { password: pin, preset, strength: len >= 6 ? "Good" : "Fair" };
  }

  if (preset === "memorable") {
    const wordCount = options.customLength || 4;
    const buf = new Uint8Array(wordCount);
    crypto.getRandomValues(buf);
    const chosen: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const b = buf[i] ?? 0;
      const idx = b % MEMORABLE_WORDS.length;
      chosen.push(MEMORABLE_WORDS[idx] ?? "haven");
    }
    // Add a random 2-digit number at the end for extra entropy
    const numBuf = new Uint8Array(1);
    crypto.getRandomValues(numBuf);
    const extraNum = 10 + ((numBuf[0] ?? 0) % 90);
    const phrase = `${chosen.join("-")}-${extraNum}`;
    return { password: phrase, preset, strength: "Very Strong" };
  }

  if (preset === "ultra") {
    const len = options.customLength || 24;
    const res = generateSecurePassword({
      length: len,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      avoidAmbiguous: true,
    });
    return { password: res.password, preset, strength: res.strength };
  }

  // default: strong
  const len = options.customLength || 16;
  const res = generateSecurePassword({
    length: len,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: false,
  });
  return { password: res.password, preset, strength: res.strength };
}
