// Extracted from docs/modules/export-publish/embed-sharing.md

import { customAlphabet } from 'nanoid';

/**
 * Generate URL-safe, human-readable share IDs.
 * Uses lowercase alphanumeric characters (no ambiguous chars).
 * Length of 10 provides ~36^10 (~3.6 trillion) unique combinations.
 *
 * Example output: "a1b2c3d4e5"
 */
export const generateShareId = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyz',
  10
);
