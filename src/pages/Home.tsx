import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import config from "../config/config";
import homeImgOne from "../images/home-1.jpg"; // replace with your pictures
import homeImgTwo from "../images/home-2.jpg";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div
      id="home"
      className="min-h-650 bg-[#1a2332] text-white flex items-center overflow-hidden"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: text */}
        <div>
          <h1 className="text-5xl font-semibold leading-tight mt-0 mb-4">
            {t("design_day", {
              year: config.year,
              semester: t(`semesters.${config.semester}`),
            })}
          </h1>

          <p className="text-lg font-light leading-relaxed mt-0 mb-6 text-gray-200">
            {t("home_paragraph")}{" "}
            <a
              href={t("what_is_design_day_url") ?? ""}
              className="font-medium text-ceed hover:underline"
            >
              {t("what_is_design_day")}
            </a>
          </p>

          <a href="#schedule">
            <button
              type="button"
              className="rounded-xl px-4 py-3 bg-ceed text-white"
            >
              {t("schedule")}
              <FontAwesomeIcon className="ml-2" icon={solid("arrow-down")} />
            </button>
          </a>
        </div>

        {/* Right: two pictures */}
        <div className="relative h-80 lg:h-[28rem]">
          <img
            src={homeImgOne}
            alt=""
            className="absolute top-0 right-0 w-2/3 rounded-2xl shadow-xl object-cover"
          />
          <img
            src={homeImgTwo}
            alt=""
            className="absolute bottom-0 left-0 w-1/2 rounded-2xl shadow-xl object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
