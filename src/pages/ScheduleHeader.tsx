import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import config from "../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

/**
 * Displays the header for the schedule section.
 *
 * This component includes the schedule title, a notice that the event
 * is split over two days, the date of the event, and a description.
 */
const ScheduleHeader = () => {
  const { t } = useTranslation();

  // Same keys and defaults as GeneralSchedule, so the dates stay in sync.
  const day1Date = t("day_1_date", { defaultValue: "Saturday, Nov 7" });
  const day2Date = t("day_2_date", { defaultValue: "Sunday, Nov 8" });

  return (
    <div>
      {/* Schedule title */}
      <h2 className="text-5xl font-normal mt-0 mb-4">{t("schedule")}</h2>

      {/* Two-day notice */}
      <div
        role="note"
        className="mb-6 rounded-xl border-l-8 border-amber-500 bg-amber-50 p-4 shadow-md"
      >
        <div className="flex items-start gap-3">
          <FontAwesomeIcon
            icon={solid("calendar-days")}
            size="2x"
            className="text-amber-500 mt-1"
          />
          <div>
            <p className="m-0 text-lg font-bold text-amber-900">
              {t("two_day_notice_title", {
                defaultValue: "New this year: Design Day is now 2 days!",
              })}
            </p>
            <p className="mt-1 mb-2 text-base leading-relaxed text-amber-900">
              {t("two_day_notice_body", {
                defaultValue:
                  "In previous years, Design Day took place in a single day. Because of the number of students participating this year, presentations are split across two days.",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Event date */}
      <h3 className="text-2xl font-normal mt-0 mb-2">
        {i18n.language === "fr" ? config.dateFr : config.dateEn}
      </h3>

      {/* Schedule description */}
      <p className="text-base font-light leading-relaxed mt-0 mb-2">
        {t("schedule_paragraph", {
          year: config.year,
          semester:
            i18n.language === "fr"
              ? t(`semesters.${config.semester}`).toLowerCase()
              : t(`semesters.${config.semester}`),
        })}
      </p>
    </div>
  );
};

export default ScheduleHeader;
