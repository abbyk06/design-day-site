import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import config from "../config/config";

interface ScheduleTableProps {
  type: "judges" | "students";
  day: 1 | 2;
}

// Shape of one schedule entry in config. `day` is optional so existing
// entries without it keep working (they show on both days).
interface ScheduleEntry {
  time: string;
  eventEn: string;
  eventFr: string;
  day?: 1 | 2;
}

/**
 * Displays a table for the schedule of judges or students on a given day.
 *
 * Receives `type` (judges or students) and `day` (1 or 2), filters the
 * matching config schedule by day, and renders time slots and events
 * localized to the selected language.
 */
const ScheduleTable: React.FC<ScheduleTableProps> = ({ type, day }) => {
  const { t } = useTranslation();

  const allEntries = (
    type === "judges" ? config.judgesSchedule : config.studentsSchedule
  ) as ScheduleEntry[];

  // Entries with no `day` are shown on every day.
  const scheduleData = allEntries.filter(
    (sched) => sched.day === undefined || sched.day === day
  );

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
      <div className="py-4 pt-1">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal bg-gray-50">
              <thead>
                <tr>
                  {/* Time column header */}
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-300 text-gray-800 text-left text-sm uppercase font-semibold"
                  >
                    {t("time")}
                  </th>
                  {/* Event column header */}
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-300 text-gray-800 text-left text-sm uppercase font-semibold"
                  >
                    {t("event")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-5 py-5 text-sm text-gray-500 text-center"
                    >
                      {t("no_events", {
                        defaultValue: "No events scheduled for this day.",
                      })}
                    </td>
                  </tr>
                ) : (
                  scheduleData.map((sched) => (
                    <tr key={`${sched.time}-${sched.eventEn}`}>
                      {/* Time slot */}
                      <td className="px-5 py-5 border-b border-gray-300 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {sched.time}
                        </p>
                      </td>
                      {/* Event name */}
                      <td className="px-5 py-5 border-b border-gray-300 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {i18n.language === "fr"
                            ? sched.eventFr
                            : sched.eventEn}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;
