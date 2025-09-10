export function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1_000_000); // 6 digits
  return `TNX-${timestamp}-${random}`;
}
