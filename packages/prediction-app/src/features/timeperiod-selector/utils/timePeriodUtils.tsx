import { Period } from "../interfaces/Period";



export const toDHIS2PeriodeData = (start: string, end: string, periodType: "week" | "month" | ""): Period[] => {
  // Parse the starting and ending year and week numbers
  if (periodType === "week") return getWeeks(start, end);
  if (periodType === "month") return getMonths(start, end);

  return [];
}

const getWeeks = (start: string, end: string): Period[] => {
  let [startYear, startWeek] = start.split('-W').map(Number);
  let [endYear, endWeek] = end.split('-W').map(Number);

  //if more than 100 years between start and end, just return as the user probably made a mistake
  if (endYear - startYear > 100) {
    return [];
  }

  let weeks : Period[] = [];

  for (let year = startYear; year <= endYear; year++) {
    // Determine the maximum number of weeks in the current year
    // January 4th should always be in the first week of the ISO calendar.
    //let maxWeeks = Math.max( moment(new Date(year, 11, 31)).isoWeek() , moment(new Date(year, 11, 31-7)).isoWeek() );
    let maxWeeks = weeksInYear(year);

    // Determine the correct starting and ending week numbers
    let startW = year === startYear ? startWeek : 1;
    let endW = year === endYear ? endWeek : maxWeeks;

    for (let week = startW; week <= endW; week++) {
      let weekString = `${year}W${String(week).padStart(2, '0')}`;
      weeks.push(
        {
          endDate : undefined,
          startDate : undefined,
          id : weekString,
        });
    }
  }
  return weeks;
}

//https://stackoverflow.com/questions/18478741/get-weeks-in-year
const getWeekNumber = (d : any) => {
  d = new Date(+d);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart : any = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return [d.getFullYear(), weekNo];
}

const weeksInYear = (year : number) => {
  var d = new Date(year, 11, 31);
  var week = getWeekNumber(d)[1];
  return week == 1 ? 52 : week;
}


const getMonths = (start: string, end: string): Period[] => {
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = end.split('-').map(Number);

  //if more than 100 years between start and end, just return as the user probably made a mistake
  if (endYear - startYear > 100) {
    return [];
  }

  let months : Period[] = [];
  let currentYear = startYear;
  let currentMonth = startMonth;

  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    let formattedMonth = String(currentMonth).padStart(2, '0');
    months.push(
      {
        id : `${currentYear}${formattedMonth}`,
        endDate : undefined,
        startDate : undefined,
      })

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return months;

}