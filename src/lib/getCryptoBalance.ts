export const getTotalCryptoBalance = (
  cryptoAssets: { balance: number }[],
): number => {
  return cryptoAssets.reduce(
    (total, asset) => total + Number(asset.balance ?? 0),
    0,
  );
};