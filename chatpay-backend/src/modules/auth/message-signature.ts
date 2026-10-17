import crypto from 'crypto';
import { Keypair, StrKey } from '@stellar/stellar-sdk';

export const SEP53_PREFIX = 'Stellar Signed Message:\n';

export interface VerifyMessageParams {
  publicKey: string;
  message: string;
  signature: string;
}

/**
 * Cryptographically verifies an ed25519 signature for a message.
 * Supports:
 * 1. Freighter SEP-53 standard: ed25519_sign(sha256("Stellar Signed Message:\n" + message))
 * 2. SEP-53 unhashed variant: ed25519_sign("Stellar Signed Message:\n" + message)
 * 3. Legacy raw variant: ed25519_sign(message)
 * Handles both base64 and hex signature encodings.
 */
export function verifyMessageSignature(params: VerifyMessageParams): boolean {
  const { publicKey, message, signature } = params;

  if (!StrKey.isValidEd25519PublicKey(publicKey)) {
    return false;
  }

  if (!signature || typeof signature !== 'string') {
    return false;
  }

  const cleanSig = signature.trim();

  // Parse signature candidate buffers (Base64 and Hex)
  const candidateSigBuffers: Buffer[] = [];
  try {
    const b64 = Buffer.from(cleanSig, 'base64');
    if (b64.length === 64) {
      candidateSigBuffers.push(b64);
    }
  } catch {}

  try {
    const hex = Buffer.from(cleanSig, 'hex');
    if (hex.length === 64) {
      candidateSigBuffers.push(hex);
    }
  } catch {}

  if (candidateSigBuffers.length === 0) {
    return false;
  }

  let keypair: Keypair;
  try {
    keypair = Keypair.fromPublicKey(publicKey);
  } catch {
    return false;
  }

  // Target 1: SEP-53 Standard (SHA-256 of prefixed message)
  const rawMsgBuffer = Buffer.from(message, 'utf8');
  const prefixedMsgBuffer = Buffer.concat([
    Buffer.from(SEP53_PREFIX, 'utf8'),
    rawMsgBuffer
  ]);
  const sha256Hash = crypto.createHash('sha256').update(prefixedMsgBuffer).digest();

  // Verification targets in order of priority:
  // 1. Freighter / SEP-53 (SHA-256 of prefixed message)
  // 2. Prefixed message directly
  // 3. Raw message directly (backwards compatibility for scripts)
  const targets = [sha256Hash, prefixedMsgBuffer, rawMsgBuffer];

  for (const sigBuffer of candidateSigBuffers) {
    for (const target of targets) {
      try {
        if (keypair.verify(target, sigBuffer)) {
          return true;
        }
      } catch {
        // Continue checking other candidates
      }
    }
  }

  return false;
}
