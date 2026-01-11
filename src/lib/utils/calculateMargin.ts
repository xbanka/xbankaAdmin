export const calculateMargin = (
  xbankasRate?: number | string,
  vendorRate?: number | string
): number => {
  const xbanka = Number(xbankasRate);
  const vendor = Number(vendorRate);

  if (Number.isNaN(xbanka) || Number.isNaN(vendor)) {
    return 0;
  }

  console.log(Number((xbanka - vendor).toFixed(2)))
  return Number((xbanka - vendor).toFixed(2));
};
