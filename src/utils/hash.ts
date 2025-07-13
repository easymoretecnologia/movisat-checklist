const bcrypt = require('bcrypt')

/**
 * Laravel-compatible password hashing utility
 * Mimics Laravel's Hash::make() and Hash::check() functionality
 * 
 * Handles bcrypt prefix compatibility:
 * - Laravel/PHP uses $2y$ prefix
 * - Node.js bcrypt uses $2b$ prefix
 * - They are compatible algorithms, just different prefixes
 */

// Default rounds used by Laravel (updated to 12 as of Laravel 12.x)
const DEFAULT_ROUNDS = 12

/**
 * Hash a password using bcrypt with Laravel-compatible settings
 * Equivalent to Laravel's Hash::make()
 * 
 * @param password - The plain text password to hash
 * @param rounds - The cost factor (default: 12, same as Laravel 12.x)
 * @returns Promise<string> - The hashed password with $2y$ prefix (Laravel compatible)
 */
export async function make(password: string, rounds: number = DEFAULT_ROUNDS): Promise<string> {
  if (!password) {
    throw new Error('Password cannot be empty')
  }
  
  // Generate hash with Node.js bcrypt (creates $2b$ prefix)
  const nodeHash = await bcrypt.hash(password, rounds)
  
  // Convert to Laravel-compatible $2y$ prefix
  const laravelHash = nodeHash.replace('$2b$', '$2y$')
  
  return laravelHash
}

/**
 * Verify a password against a hash
 * Equivalent to Laravel's Hash::check()
 * 
 * @param password - The plain text password
 * @param hash - The hashed password to compare against (supports $2y$, $2b$, $2a$ prefixes)
 * @returns Promise<boolean> - True if password matches
 */
export async function check(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false
  }
  
  // Convert Laravel $2y$ hashes to Node.js compatible $2a$ for verification
  // This handles Laravel hashes, while leaving $2b$ (Node.js) hashes unchanged
  const nodeCompatibleHash = hash.replace('$2y$', '$2a$')
  
  return await bcrypt.compare(password, nodeCompatibleHash)
}

/**
 * Check if a hash needs to be re-hashed (rounds changed)
 * Equivalent to Laravel's Hash::needsRehash()
 * 
 * @param hash - The hash to check
 * @param rounds - The desired number of rounds (default: 12)
 * @returns boolean - True if hash needs to be re-hashed
 */
export function needsRehash(hash: string, rounds: number = DEFAULT_ROUNDS): boolean {
  if (!hash) {
    return true
  }
  
  // Extract the cost from the hash (bcrypt format: $2y$12$... or $2b$12$...)
  const costMatch = hash.match(/\$2[ayb]\$(\d+)\$/)
  if (!costMatch) {
    return true
  }
  
  const currentRounds = parseInt(costMatch[1])
  return currentRounds !== rounds
}

/**
 * Check if hash uses Laravel-compatible prefix
 * 
 * @param hash - The hash to check
 * @returns boolean - True if hash uses $2y$ prefix (Laravel compatible)
 */
export function isLaravelCompatible(hash: string): boolean {
  return hash.startsWith('$2y$')
}

/**
 * Convert Node.js hash to Laravel-compatible format
 * 
 * @param hash - The hash to convert (usually $2b$ from Node.js)
 * @returns string - Laravel-compatible hash with $2y$ prefix
 */
export function toLaravelFormat(hash: string): string {
  return hash.replace('$2b$', '$2y$')
}

/**
 * Convert Laravel hash to Node.js-compatible format for verification
 * 
 * @param hash - The hash to convert (usually $2y$ from Laravel)
 * @returns string - Node.js-compatible hash with $2a$ prefix
 */
export function toNodeFormat(hash: string): string {
  return hash.replace('$2y$', '$2a$')
}

// Default export with Laravel-style interface
const Hash = {
  make,
  check,
  needsRehash,
  isLaravelCompatible,
  toLaravelFormat,
  toNodeFormat
}

export default Hash 