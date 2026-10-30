import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import config from "../config/config";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import { DayType, useSelectedDay } from "./useSelectedDay";

interface Category {
  name: string;
  description?: string;
  location: string;
  presentations: Record<string, Presentation[]>;
}

interface Presentation {
  section?: string;
  group?: string;
  time?: string;
  project?: string;
  project_description?: string;
  project_repo?: string;
  // Read from the 7th column of each category block in the sheet (the one that
  // used to be an empty spacer). Blank = shown on both days.
  day?: DayType;
}

interface FloorPlan {
  url: string;
  title?: string;
  // Undefined when the same floor plan applies to both days.
  day?: DayType;
}

// Optional per-day floor plans. If it isn't in config, the existing
// `floorplans` / `floorplan_titles` are used for both days.
type FloorPlansByDay = Record<DayType, { url: string; title?: string }[]>;
const cfg = config as typeof config & { floorplansByDay?: FloorPlansByDay };

// Same colors as the day cards in GeneralSchedule so the days look consistent.
// Full class strings so Tailwind can detect them.
const DAY_FILTER_STYLES: Record<DayType, string> = {
  1: "bg-sky-500 border-sky-500 text-white",
  2: "bg-violet-500 border-violet-500 text-white",
};

// Color of the check mark inside the white checkbox on an active day button.
const DAY_CHECK_STYLES: Record<DayType, string> = {
  1: "text-sky-500",
  2: "text-violet-500",
};

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fuzzyMatch(pattern: string, str: string) {
  pattern = pattern.normalize().toLowerCase();
  str = str.normalize().toLowerCase();
  pattern =
    ".*" +
    pattern
      .split("")
      .map((l) => `${escapeRegExp(l)}.*`)
      .join("");
  const re = new RegExp(pattern);
  return re.test(str);
}

function filteredCategories(
  categories: Category[],
  search: string,
  days: DayType[]
): Category[] {
  // Nothing selected or both selected means "show every day".
  const allDays = days.length === 0 || days.length === 2;

  // Output categories
  let outCat: Category[] = [];
  categories.forEach((cat) => {
    // Sections underneath each category
    let outSections: Record<string, Presentation[]> = {};
    for (const [section, presentations] of Object.entries(cat.presentations)) {
      // Groups presenting underneath each category, matching both the search
      // text and the selected day. Presentations with no day are always kept.
      let newPresentations = presentations.filter(
        (p: Presentation) =>
          fuzzyMatch(search, p.group || "") &&
          (allDays || p.day === undefined || days.includes(p.day))
      );

      // If some presentations are hit insert filtered array
      if (newPresentations.length > 0) {
        outSections[section] = newPresentations;
      }
    }

    // If section has any presentations left push to return
    if (Object.entries(outSections).length > 0) {
      outCat.push({
        name: cat.name,
        description: cat.description,
        location: cat.location,
        presentations: outSections,
      });
    }
  });
  return outCat;
}

const DisplayTh = ({
  category,
  presentationSection,
  cell,
}: {
  category: Category;
  presentationSection: string;
  cell: keyof Presentation;
}) => {
  const { t } = useTranslation();
  return category.presentations[presentationSection].some((el) => el[cell]) ? (
    <th
      scope="col"
      className="px-5 py-3 border-b border-gray-300 text-gray-800 text-left text-sm uppercase font-semibold"
    >
      {t(cell)}
    </th>
  ) : null;
};

const DisplayTd = ({
  category,
  presentationSection,
  presentation,
  cell,
  with_link = false,
}: {
  category: Category;
  presentationSection: string;
  presentation: Presentation;
  cell: keyof Presentation;
  with_link?: boolean;
}) => {
  return category.presentations[presentationSection].some((el) => el[cell]) ? (
    with_link ? (
      <td className="px-5 py-5 border-b border-gray-300 text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {String(presentation[cell] ?? "").includes("https://") ? (
            <a className="underline" href={String(presentation[cell])}>
              {presentation[cell]}
            </a>
          ) : (
            presentation[cell]
          )}
        </p>
      </td>
    ) : (
      <td className="px-5 py-5 border-b border-gray-300 text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{presentation[cell]}</p>
      </td>
    )
  ) : null;
};

const PresentationDisclosure = ({
  category,
  presentationSection,
  i,
  openAll,
}: {
  category: Category;
  presentationSection: string;
  i: number;
  openAll: boolean;
}) => {
  return (
    <Disclosure
      key={i}
      defaultOpen={Object.keys(category.presentations).length === 1}
    >
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full bg-ceed-light text-white my-2 items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium focus:outline-none">
            <span>{presentationSection}</span>
            <FontAwesomeIcon
              icon={open ? solid("chevron-up") : solid("chevron-down")}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="px-4 text-sm text-gray-500">
              <div key={i} className="overflow-x-scroll">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <DisplayTh
                        category={category}
                        presentationSection={presentationSection}
                        cell="section"
                      />
                      <DisplayTh
                        category={category}
                        presentationSection={presentationSection}
                        cell="group"
                      />
                      <DisplayTh
                        category={category}
                        presentationSection={presentationSection}
                        cell="time"
                      />
                      <DisplayTh
                        category={category}
                        presentationSection={presentationSection}
                        cell="project"
                      />
                      <DisplayTh
                        category={category}
                        presentationSection={presentationSection}
                        cell="project_description"
                      />
                      <DisplayTh
                        category={category}
                        presentationSection={presentationSection}
                        cell="project_repo"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {category.presentations[presentationSection].map(
                      (presentation, i) => (
                        <tr key={i}>
                          <DisplayTd
                            category={category}
                            presentationSection={presentationSection}
                            presentation={presentation}
                            cell="section"
                          />
                          <DisplayTd
                            category={category}
                            presentationSection={presentationSection}
                            presentation={presentation}
                            cell="group"
                          />
                          <DisplayTd
                            category={category}
                            presentationSection={presentationSection}
                            presentation={presentation}
                            cell="time"
                          />
                          <DisplayTd
                            category={category}
                            presentationSection={presentationSection}
                            presentation={presentation}
                            cell="project"
                          />
                          <DisplayTd
                            category={category}
                            presentationSection={presentationSection}
                            presentation={presentation}
                            cell="project_description"
                            with_link={true}
                          />
                          <DisplayTd
                            category={category}
                            presentationSection={presentationSection}
                            presentation={presentation}
                            cell="project_repo"
                            with_link={true}
                          />
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
};

const CategoryDisclosure = ({
  category,
  openAll,
}: {
  category: Category;
  openAll: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Disclosure key={category.name}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full bg-ceed text-white my-2 items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium focus:outline-none">
            <span>{category.name}</span>
            <FontAwesomeIcon
              icon={open ? solid("chevron-up") : solid("chevron-down")}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="px-4 text-sm text-gray-500">
              <div className="p-2 items-center w-full sm:flex sm:justify-between">
                {category.description ? (
                  <p className="mb-2 lg:mb-0">
                    {t("description")}{" "}
                    <a className="underline" href={category.description}>
                      {category.description}
                    </a>
                  </p>
                ) : (
                  <div></div>
                )}
                <div className="px-2 py-1 bg-ceed text-white rounded-2xl flex justify-center">
                  {category.location}
                </div>
              </div>

              {Object.keys(category.presentations).map(
                (presentationSection, i) => (
                  <PresentationDisclosure
                    key={i}
                    category={category}
                    presentationSection={presentationSection}
                    i={i}
                    openAll={openAll}
                  />
                )
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

/**
 * Displays presentation schedules for different categories.
 *
 * This component fetches presentation data from a Google Sheets spreadsheet and displays it
 * in a series of collapsible sections. Each section contains a table with presentation details
 * such as section, group, time, project, project description, and project repository. It also
 * includes a day filter, a search box, and a lightbox for viewing floor plans.
 *
 * The day filter defaults to the day selected in GeneralSchedule. Each day button can be
 * toggled off and on, so the visitor can view one day or both. Floor plans follow the filter.
 */
const PresentationSchedules = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  // Default to whichever day the visitor is viewing in the schedule above, and
  // follow it when they switch days there. Manual toggles below override it
  // until the schedule day changes again.
  const [scheduleDay] = useSelectedDay();
  const [selectedDays, setSelectedDays] = useState<DayType[]>([scheduleDay]);
  useEffect(() => {
    setSelectedDays([scheduleDay]);
  }, [scheduleDay]);

  const toggleDay = (day: DayType) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  // Nothing selected or both selected means "show every day".
  const showAllDays = selectedDays.length === 0 || selectedDays.length === 2;
  const visibleDays: DayType[] = showAllDays ? [1, 2] : selectedDays;

  // Floor plans for the visible days. Without `floorplansByDay` in config, the
  // same plans are shown for every day (listed once, with no day label).
  const floorPlans: FloorPlan[] = cfg.floorplansByDay
    ? visibleDays.flatMap((day) =>
        (cfg.floorplansByDay?.[day] ?? []).map((fp) => ({ ...fp, day }))
      )
    : cfg.floorplans.map((url, i) => ({
        url,
        title: cfg.floorplan_titles[i],
      }));
  const images = floorPlans.map((fp) => ({ src: fp.url, title: fp.title }));

  const dayLabels: Record<DayType, string> = {
    1: `${t("day_1", { defaultValue: "Day 1" })} · ${t("day_1_date", {
      defaultValue: "Saturday, Nov 7",
    })}`,
    2: `${t("day_2", { defaultValue: "Day 2" })} · ${t("day_2_date", {
      defaultValue: "Sunday, Nov 8",
    })}`,
  };

  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/1st-year?key=${process.env.REACT_APP_GOOGLE_API_KEY}&range=!A2:ZZZ1000`
    )
      .then((res) => res.json())
      .then((data) => {
        const categories: Category[] = [];
        for (let i = 0; i < data.values[0].length; i += 7) {
          categories.push({
            name: data.values[0][i],
            description: data.values[0][i + 1],
            location: data.values[0][i + 2],
            presentations: {},
          });
        }

        const presentationData = data.values.slice(3);
        for (let i = 0; i < presentationData.length; i++) {
          for (let j = 0; j < presentationData[i].length; j += 7) {
            if (presentationData[i].slice(j, j + 6).some((el: string) => el)) {
              if (!categories[j / 7].presentations[presentationData[i][j]]) {
                categories[j / 7].presentations[presentationData[i][j]] = [];
              }
              // 7th column of the block: "1", "2", "Day 1", etc. Blank = both days.
              const dayMatch = String(presentationData[i][j + 6] ?? "").match(
                /[12]/
              );
              categories[j / 7].presentations[presentationData[i][j]].push({
                section: presentationData[i][j],
                group: presentationData[i][j + 1],
                time: presentationData[i][j + 2],
                project: presentationData[i][j + 3],
                project_description: presentationData[i][j + 4],
                project_repo: presentationData[i][j + 5],
                day: dayMatch ? (Number(dayMatch[0]) as DayType) : undefined,
              });
            }
          }
        }

        setCategories(categories);
      });
  }, []);

  const visibleCategories = filteredCategories(
    categories,
    searchTerm,
    selectedDays
  );
  // Sections open automatically while searching or viewing a single day.
  const openAll = searchTerm !== "" || !showAllDays;

  return (
    <div id="presentation" className="flex justify-center">
      <div className="w-full lg:w-1/2 pb-10 px-4 lg:px-0">
        {/* Day filter: checkbox-style buttons so it's clear you can pick one or both */}
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t("select_days_prompt", {
            defaultValue: "Show presentations for (pick one or both):",
          })}
        </p>
        <div
          role="group"
          aria-label={String(t("schedule_day_label", { defaultValue: "Day" }))}
          className="grid grid-cols-2 gap-2 mb-1"
        >
          {([1, 2] as DayType[]).map((day) => {
            const isActive = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                role="checkbox"
                aria-checked={isActive}
                onClick={() => toggleDay(day)}
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? DAY_FILTER_STYLES[day]
                    : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                }`}
              >
                {/* Checkbox square */}
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 text-sm font-bold leading-none ${
                    isActive
                      ? `bg-white border-white ${DAY_CHECK_STYLES[day]}`
                      : "bg-white border-gray-400 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span>{dayLabels[day]}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            {showAllDays
              ? t("showing_both_days", { defaultValue: "Showing both days" })
              : `${t("showing", { defaultValue: "Showing" })}: ${
                  dayLabels[selectedDays[0]]
                }`}
          </span>
          {selectedDays.length < 2 && (
            <button
              type="button"
              onClick={() => setSelectedDays([1, 2])}
              className="underline font-semibold text-gray-700"
            >
              {t("show_both_days", { defaultValue: "Show both days" })}
            </button>
          )}
        </div>

        <input
          name="presentationSearch"
          placeholder={t("search_prompt") ?? ""}
          className="shadow block appearance-none border rounded mb-3 px-4 py-2 w-full focus:shadow-outline"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <hr />
        <div className="rounded-2xl pb-5">
          {visibleCategories.length === 0 && categories.length > 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              {t("no_results", {
                defaultValue: "No presentations match your search.",
              })}
            </p>
          )}
          {visibleCategories.map((category, i) => (
            <CategoryDisclosure key={i} category={category} openAll={openAll} />
          ))}
        </div>
        <h4 className="text-xl font-normal mt-0 mb-2">{t("floor_plans")}</h4>

        {config.showFloorPlan === false || images.length === 0 ? (
          t("no_floor_plans")
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {images.map((image, i) => (
              <button
                onClick={() => {
                  setImgIndex(i);
                  setIsImgPopupOpen(true);
                }}
                className="flex flex-col items-center justify-center"
                key={`${floorPlans[i].day ?? 0}-${i}`}
              >
                {/* Day badge only when floor plans from both days are shown */}
                {floorPlans[i].day && visibleDays.length === 2 && (
                  <span
                    className={`text-xs font-bold rounded-full px-2.5 py-0.5 mb-1 ${
                      DAY_FILTER_STYLES[floorPlans[i].day as DayType]
                    }`}
                  >
                    {t(`day_${floorPlans[i].day}`, {
                      defaultValue: `Day ${floorPlans[i].day}`,
                    })}
                  </span>
                )}
                <p>{floorPlans[i].title}</p>
                <img
                  className="w-auto h-auto max-h-full"
                  src={image.src}
                  // alt={image.caption}
                />
              </button>
            ))}
          </div>
        )}

        <Lightbox
          open={isImgPopupOpen}
          index={imgIndex}
          slides={images}
          close={() => setIsImgPopupOpen(false)}
          plugins={[Captions]}
        />
      </div>
    </div>
  );
};

export default PresentationSchedules;
