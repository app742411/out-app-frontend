import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { TimeIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  onChange?: Hook | Hook[];
  defaultTime?: DateOption;
  label?: string;
  placeholder?: string;
  time24hr?: boolean;
};

export default function TimePicker({
  id,
  onChange,
  label,
  defaultTime,
  placeholder = "Select time",
  time24hr = true,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      enableTime: true,
      noCalendar: true,
      dateFormat: time24hr ? "H:i" : "h:i K",
      time_24hr: time24hr,
      defaultDate: defaultTime,
      onChange,
      static: true,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [onChange, id, defaultTime, time24hr]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative w-full">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden transition-all duration-200 ease-in-out dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 hover:border-gray-400 focus:border-brand-500 focus:shadow-focus-ring dark:border-gray-700 dark:hover:border-gray-600 dark:focus:border-brand-500"
        />

        <span className="absolute text-gray-400 dark:text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2">
          <TimeIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
