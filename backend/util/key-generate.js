import crypto from "crypto";

function generateRandomKey() {
  return crypto.randomBytes(32).toString("hex"); // 32 bytes = 256-bit key.
}

console.log("Generated Key:", generateRandomKey());
