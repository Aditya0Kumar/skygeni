export function isQ1(date: Date): boolean {
  const month = date.getMonth();
  return month >= 0 && month <= 2;
}

export function isQ2(date: Date): boolean {
  const month = date.getMonth();
  return month >= 3 && month <= 5;
}

export function isQ3(date: Date): boolean {
  const month = date.getMonth();
  return month >= 6 && month <= 8;
}

export function getDaysDiff(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getWeekIndex(startDate: Date, currentDate: Date): number {
  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
