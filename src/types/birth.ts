export type Gender = "male" | "female";
export type CalendarType = "solar" | "lunar";

export type BirthProfile = {
  year: number;
  month: number;
  day: number;
  birthRegion: string;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
};

export const GENDER_LABEL: Record<Gender, string> = {
  male: "남",
  female: "여",
};

export const CALENDAR_LABEL: Record<CalendarType, string> = {
  solar: "양력",
  lunar: "음력",
};
