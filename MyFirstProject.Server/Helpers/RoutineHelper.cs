using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Helpers
{
    public static class RoutineHelper
    {
        /// <summary>
        /// Tính l?n x?y ra ??u tiên c?a routine
        /// </summary>
        public static DateTime GetFirstOccurrence(DateTime startDate, TimeOnly time, RecurrenceRule rule)
        {
            if (rule == null)
                throw new ArgumentNullException(nameof(rule));

            var startAnchor = startDate.Date.Add(time.ToTimeSpan());

            // ? N?u startAnchor ch?a qua, tr? v? luôn
            if (startAnchor >= DateTime.UtcNow)
            {
                return startAnchor;
            }

            // ? N?u ?ã qua, tìm occurrence ti?p theo
            var nextOcc = IcalHelper.GetNextOccurrence(DateTime.UtcNow, startAnchor, rule);
            
            // N?u không tìm ???c (rule h?t h?n), tr? v? startAnchor
            return nextOcc ?? startAnchor;
        }

        /// <summary>
        /// Tính l?n x?y ra ti?p theo sau lastOccurrence
        /// </summary>
        public static DateTime? GetNextOccurrence(DateTime lastOccurrence, RecurrenceRule rule)
        {
            if (rule == null)
                return null;

            // ?? QUAN TR?NG: Ph?i truy?n startAnchor (th?i ?i?m routine ???c t?o)
            // Vì không có thông tin này, ta dùng lastOccurrence làm anchor t?m th?i
            // Trong th?c t?, nên l?u StartDate trong Routine model
            return IcalHelper.GetNextOccurrence(lastOccurrence, lastOccurrence, rule);
        }

        /// <summary>
        /// ??m t?ng s? occurrences trong kho?ng th?i gian
        /// </summary>
        public static int CalculateTotalOccurrences(DateTime startDate, DateTime? endDate, RecurrenceRule rule)
        {
            if (rule == null)
                return 0;

            // N?u không có endDate, tính trong 1 n?m
            var searchEnd = endDate ?? startDate.AddYears(1);

            return IcalHelper.CountOccurrences(startDate, searchEnd, rule);
        }
    }
}
