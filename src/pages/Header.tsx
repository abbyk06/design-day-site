import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useTranslation } from "react-i18next";
import config from "../config/config";
import i18n from "i18next";
import useHideOnScroll from "../hooks/useHideOnScroll";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const Header = () => {
  const { t } = useTranslation();
  const visible = useHideOnScroll();

  const navigation = [
    { name: t("home"), href: "#home", current: true },
    { name: t("schedule"), href: "#schedule", current: false },
    { name: t("presentations"), href: "#presentation", current: false },
    { name: t("sponsors"), href: "#sponsors", current: false },
  ];

  return (
    <Disclosure
      as="nav"
      className={classNames(
        "fixed top-0 left-0 w-full z-50 bg-[#1a2332]/90 backdrop-blur",
        "transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <FontAwesomeIcon icon={solid("bars")} size="lg" />
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center mr-4">
                  <a
                    href="https://makerepo.com"
                    className="text-white font-bold text-lg hover:text-gray-300 transition-colors"
                  >
                    MakerRepo
                  </a>
                </div>

                <div className="flex flex-shrink-0 items-center text-gray-400 text-sm sm:text-base mr-6">
                  {t("design_day", {
                    year: config.year,
                    semester: t(`semesters.${config.semester}`),
                  })}
                </div>

                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  i18n.changeLanguage(
                    i18n.language === "fr" ? "en" : "fr",
                    () => {
                      localStorage.setItem("defaultLang", i18n.language);
                    }
                  )
                }
                className="flex items-center justify-center sm:justify-end text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {i18n.language === "fr" ? "EN" : "FR"}
              </button>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                as="a"
                href="https://makerepo.com"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                MakerRepo
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
