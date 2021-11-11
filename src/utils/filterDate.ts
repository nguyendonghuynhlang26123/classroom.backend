export function filterDate(fromDate: number, toDate: number) {
  let filter: any = {
    updated_at: { $gte: 0 },
  };
  if (fromDate) {
    filter[`updated_at`] = { $gte: fromDate };
  }
  if (toDate) {
    filter[`updated_at`] = { $lte: toDate };
  }
  if (fromDate && toDate) {
    filter[`updated_at`] = { $lte: toDate, $gte: fromDate };
  }
  return filter;
}
