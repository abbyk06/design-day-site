import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleTable from "./ScheduleTable";
import { DayType, useSelectedDay } from "./useSelectedDay";

type AudienceType = "judges" | "students";

// Full class strings are used (not template fragments) so Tailwind can detect them.
const DAY_STYLES: Record<
  DayType,
  {
    card: string;
    cardActive: string;
    badge: string;
    banner: string;
    bar: string;
  }
> = {
  1: {
    card: "border-gray-200 text-gray-600 hover:border-sky-300",
    cardActive: "border-sky-500 bg-sky-50 text-sky-900 shadow-md",
    badge: "bg-sky-500 text-white",
    banner: "bg-sky-500 text-white",
    bar: "border-sky-500",
  },
  2: {
    card: "border-gray-200 text-gray-600 hover:border-violet-300",
    cardActive: "border-violet-500 bg-violet-50 text-violet-900 shadow-md",
    badge: "bg-violet-500 text-white",
    banner: "bg-violet-500 text-white",
    bar: "border-violet-500",
  },
};

const AUDIENCE_STYLES: Record<AudienceType, { active: string }> = {
  students: {
    active: "bg-orange-500 text-white shadow",
  },
  judges: {
    active: "bg-ceed text-white shadow",
  },
};

// Component that displays a 2-day schedule, filtered by audience (student / judge & sponsor).
const GeneralSchedule = () => {
  // Shared with PresentationSchedules so its filter defaults to this day.
  const [activeDay, setActiveDay] = useSelectedDay();
  const [activeAudience, setActiveAudience] =
    useState<AudienceType>("students");
  const { t } = useTranslation();

  // Both days are presentation days, so the card subtitle is just a short
  // descriptor. Change the defaults (or the day_X_theme translation keys) to
  // say which groups/projects present each day, e.g. "Groups A–F".
  const days: { id: DayType; label: string; date: string; theme: string }[] = [
    {
      id: 1,
      label: t("day_1", { defaultValue: "Day 1" }),
      date: t("day_1_date", { defaultValue: "Saturday, Nov 7" }),
      theme: t("day_1_theme", { defaultValue: "Presentations" }),
    },
    {
      id: 2,
      label: t("day_2", { defaultValue: "Day 2" }),
      date: t("day_2_date", { defaultValue: "Sunday, Nov 8" }),
      theme: t("day_2_theme", { defaultValue: "Presentations" }),
    },
  ];

  const audiences: { id: AudienceType; label: string; hint: string }[] = [
    {
      id: "students",
      label: t("student", { defaultValue: "Student" }),
      hint: t("students_hint", { defaultValue: "I'm presenting" }),
    },
    {
      id: "judges",
      label: t("judge_sponsor", { defaultValue: "Judge" }),
      hint: t("judges_hint", { defaultValue: "I'm attending as a guest" }),
    },
  ];

  const currentDay = days.find((d) => d.id === activeDay)!;
  const currentAudience = audiences.find((a) => a.id === activeAudience)!;
  const dayStyle = DAY_STYLES[activeDay];

  return (
    <div id="schedule" className="flex justify-center">
      <div className="lg:w-1/2 w-full pt-10 py-3 px-4 lg:px-0">
        <ScheduleHeader />

        {/* STEP 1: Pick your role */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold text-center mb-2">
            {t("schedule_step_1", { defaultValue: "I am a…" })}
          </p>
          <div
            role="tablist"
            aria-label={String(
              t("schedule_audience_label", { defaultValue: "Audience" })
            )}
            className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl"
          >
            {audiences.map((a) => {
              const isActive = a.id === activeAudience;
              return (
                <button
                  key={a.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveAudience(a.id)}
                  className={`flex flex-col items-center py-3 px-2 rounded-lg transition-all ${
                    isActive
                      ? AUDIENCE_STYLES[a.id].active
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <span className="font-semibold text-sm sm:text-base">
                    {a.label}
                  </span>
                  <span
                    className={`text-xs font-light ${
                      isActive ? "text-white/90" : "text-gray-400"
                    }`}
                  >
                    {a.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Pick the day */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold text-center mb-2">
            {t("schedule_step_2", { defaultValue: "Choose a day" })}
          </p>
          <div
            role="tablist"
            aria-label={String(
              t("schedule_day_label", { defaultValue: "Day" })
            )}
            className="grid grid-cols-2 gap-3"
          >
            {days.map((d) => {
              const isActive = d.id === activeDay;
              const s = DAY_STYLES[d.id];
              return (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveDay(d.id)}
                  className={`text-left rounded-xl border-2 p-4 transition-all ${
                    isActive ? s.cardActive : `bg-white ${s.card}`
                  }`}
                >
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wide rounded-full px-2.5 py-0.5 mb-2 ${
                      isActive ? s.badge : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span className="block font-semibold text-base leading-tight">
                    {d.date}
                  </span>
                  <span className="block text-sm font-light mt-1">
                    {d.theme}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Always-visible summary of what you're looking at */}
        <div
          className={`rounded-t-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 ${dayStyle.banner}`}
        >
          <span className="font-bold text-lg">
            {currentDay.label} · {currentDay.date}
          </span>
          <span className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
            {currentAudience.label}
          </span>
        </div>

        {/* Schedule table (colored side/bottom border reinforces the day) */}
        <div
          className={`border-x-4 border-b-4 rounded-b-xl p-2 mb-6 ${dayStyle.bar}`}
        >
          {/* ScheduleTable accepts and filters by `day` as well as `type` */}
          <ScheduleTable type={activeAudience} day={activeDay} />
        </div>

        {/* Additional text and list items */}
        <p className="text-base font-light leading-relaxed mt-0 mb-2">
          {t("presentation_paragraph")}
        </p>
        <ul className="text-base font-light leading-relaxed mt-0 mb-2 space-y-1 list-disc list-inside pl-3">
          <li>{t("presentation_li_1")}</li>
          <li>{t("presentation_li_2")}</li>
        </ul>
      </div>
    </div>
  );
};

export default GeneralSchedule;
