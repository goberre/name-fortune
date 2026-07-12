/** 생년월일 유효성 — 실제 달력 기준 */
export function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  const lastDay = new Date(year, month, 0).getDate();
  return day <= lastDay;
}

export function validateBirthDateFields(
  birthYear: string,
  birthMonth: string,
  birthDay: string,
): string | null {
  if (!birthYear || !birthMonth || !birthDay) return "생년월일을 모두 입력해 주세요.";
  const y = Number(birthYear);
  const m = Number(birthMonth);
  const d = Number(birthDay);
  if (!isValidCalendarDate(y, m, d)) return "올바른 생년월일을 입력해 주세요.";
  return null;
}
