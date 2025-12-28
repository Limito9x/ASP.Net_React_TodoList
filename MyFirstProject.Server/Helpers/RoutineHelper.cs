using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Helpers
{
    public static class RoutineHelper
    {
        /// <summary>
        /// Tính toán ngày x?y ra ti?p theo c?a routine d?a trên recurrence rule
        /// </summary>
        /// <param name="currentOccurrence">Ngày x?y ra hi?n t?i</param>
        /// <param name="scheduledTime">Th?i gian ???c lên l?ch</param>
        /// <param name="rule">Quy t?c l?p l?i</param>
        /// <returns>Ngày x?y ra ti?p theo ho?c null n?u không còn l?n x?y ra nào</returns>
        public static DateTime? GetNextOccurrence(DateTime currentOccurrence, TimeOnly scheduledTime, RecurrenceRule rule)
        {
            if (rule == null) return null;

            var nextDate = currentOccurrence.Date;
            var interval = rule.Interval > 0 ? rule.Interval : 1;

            switch (rule.Frequence)
            {
                case Frequence.Daily:
                    nextDate = GetNextDailyOccurrence(nextDate, interval);
                    break;

                case Frequence.Weekly:
                    nextDate = GetNextWeeklyOccurrence(nextDate, interval, rule.DaysOfWeek);
                    break;

                case Frequence.Monthly:
                    nextDate = GetNextMonthlyOccurrence(nextDate, interval, rule.DaysOfMonth);
                    break;

                case Frequence.Yearly:
                    nextDate = GetNextYearlyOccurrence(nextDate, interval);
                    break;

                default:
                    return null;
            }

            // K?t h?p ngày v?i th?i gian ???c lên l?ch
            var nextOccurrence = nextDate.Add(scheduledTime.ToTimeSpan());

            // Ki?m tra ?i?u ki?n k?t thúc
            if (rule.EndDate.HasValue && nextOccurrence > rule.EndDate.Value)
            {
                return null;
            }

            return nextOccurrence;
        }

        /// <summary>
        /// Tính ngày x?y ra ti?p theo cho routine Daily
        /// </summary>
        private static DateTime GetNextDailyOccurrence(DateTime currentDate, int interval)
        {
            return currentDate.AddDays(interval);
        }

        /// <summary>
        /// Tính ngày x?y ra ti?p theo cho routine Weekly
        /// </summary>
        private static DateTime GetNextWeeklyOccurrence(DateTime currentDate, int interval, List<int>? daysOfWeek)
        {
            if (daysOfWeek == null || daysOfWeek.Count == 0)
            {
                // N?u không ch? ??nh ngày c? th?, l?p l?i theo tu?n
                return currentDate.AddDays(7 * interval);
            }

            var sortedDays = daysOfWeek.OrderBy(d => d).ToList();
            var currentDayOfWeek = (int)currentDate.DayOfWeek;
            
            // Tìm ngày ti?p theo trong cùng tu?n
            var nextDay = sortedDays.FirstOrDefault(d => d > currentDayOfWeek, -1);
            
            if (nextDay >= 0)
            {
                // Có ngày ti?p theo trong tu?n này
                var daysToAdd = nextDay - currentDayOfWeek;
                return currentDate.AddDays(daysToAdd);
            }
            else
            {
                // Chuy?n sang tu?n ti?p theo
                var firstDayOfWeek = sortedDays.First();
                var daysToAdd = (7 * interval) - currentDayOfWeek + firstDayOfWeek;
                return currentDate.AddDays(daysToAdd);
            }
        }

        /// <summary>
        /// Tính ngày x?y ra ti?p theo cho routine Monthly
        /// </summary>
        private static DateTime GetNextMonthlyOccurrence(DateTime currentDate, int interval, List<int>? daysOfMonth)
        {
            if (daysOfMonth == null || daysOfMonth.Count == 0)
            {
                // N?u không ch? ??nh ngày c? th?, l?p l?i cùng ngày trong tháng
                return currentDate.AddMonths(interval);
            }

            var sortedDays = daysOfMonth.OrderBy(d => d).ToList();
            var currentDay = currentDate.Day;
            
            // Tìm ngày ti?p theo trong cùng tháng
            var nextDay = sortedDays.FirstOrDefault(d => d > currentDay, -1);
            
            if (nextDay > 0 && nextDay <= DateTime.DaysInMonth(currentDate.Year, currentDate.Month))
            {
                // Có ngày ti?p theo trong tháng này
                return new DateTime(currentDate.Year, currentDate.Month, nextDay);
            }
            else
            {
                // Chuy?n sang tháng ti?p theo
                var nextMonth = currentDate.AddMonths(interval);
                var firstDayOfMonth = sortedDays.First();
                
                // ??m b?o ngày h?p l? trong tháng (ví d?: tháng 2 ch? có 28/29 ngày)
                var maxDay = DateTime.DaysInMonth(nextMonth.Year, nextMonth.Month);
                var validDay = Math.Min(firstDayOfMonth, maxDay);
                
                return new DateTime(nextMonth.Year, nextMonth.Month, validDay);
            }
        }

        /// <summary>
        /// Tính ngày x?y ra ti?p theo cho routine Yearly
        /// </summary>
        private static DateTime GetNextYearlyOccurrence(DateTime currentDate, int interval)
        {
            var nextYear = currentDate.AddYears(interval);
            
            // X? lý tr??ng h?p ngày 29/2 (n?m nhu?n)
            if (currentDate.Month == 2 && currentDate.Day == 29)
            {
                // N?u n?m ti?p theo không ph?i n?m nhu?n, chuy?n sang 28/2
                if (!DateTime.IsLeapYear(nextYear.Year))
                {
                    return new DateTime(nextYear.Year, 2, 28);
                }
            }
            
            return nextYear;
        }

        /// <summary>
        /// Tính ngày x?y ra ??u tiên c?a routine (t? ngày b?t ??u)
        /// </summary>
        /// <param name="startDate">Ngày b?t ??u</param>
        /// <param name="scheduledTime">Th?i gian ???c lên l?ch</param>
        /// <param name="rule">Quy t?c l?p l?i</param>
        /// <returns>Ngày x?y ra ??u tiên</returns>
        public static DateTime GetFirstOccurrence(DateTime startDate, TimeOnly scheduledTime, RecurrenceRule rule)
        {
            var firstDate = startDate.Date.Add(scheduledTime.ToTimeSpan());
            
            // N?u th?i gian ?ã qua, tính l?n x?y ra ti?p theo
            if (firstDate <= DateTime.Now)
            {
                var next = GetNextOccurrence(firstDate, scheduledTime, rule);
                return next ?? firstDate;
            }
            
            return firstDate;
        }
    }
}
