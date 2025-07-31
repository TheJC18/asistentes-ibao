import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const notifications = [
  {
    id: 1,
    user: "Terry Franci",
    avatar: "/images/user/user-02.jpg",
    status: "online",
    project: "Project - Nganter App",
    time: "5 min ago",
  },
  {
    id: 2,
    user: "Alena Franci",
    avatar: "/images/user/user-03.jpg",
    status: "online",
    project: "Project - Nganter App",
    time: "8 min ago",
  },
  {
    id: 3,
    user: "Jocelyn Kenter",
    avatar: "/images/user/user-04.jpg",
    status: "online",
    project: "Project - Nganter App",
    time: "15 min ago",
  },
  {
    id: 4,
    user: "Brandon Philips",
    avatar: "/images/user/user-05.jpg",
    status: "offline",
    project: "Project - Nganter App",
    time: "1 hr ago",
    link: "/",
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setNotifying(false);
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
        aria-label="Toggle notifications"
      >
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <FontAwesomeIcon icon={["far", "bell"]} className="fill-current" width={20} height={20} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute left-[-15px] lg:right-0 lg:left-auto mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-900 dark:bg-gray-dark sm:w-[361px]"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notification
          </h5>
          <button
            onClick={closeDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Close notifications"
          >
            <FontAwesomeIcon icon={["fas", "xmark"]} width={24} height={24} />
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.map(({ id, user, avatar, status, project, time, link = "#" }) => (
            <li key={id}>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                to={link}
              >
                <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                  <img
                    width={40}
                    height={40}
                    src={avatar}
                    alt={`Avatar of ${user}`}
                    className="w-full overflow-hidden rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white ${
                      status === "online" ? "bg-success-500" : "bg-error-500"
                    } dark:border-gray-900`}
                  ></span>
                </span>

                <span className="block">
                  <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {user}
                    </span>
                    <span>requests permission to change</span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {project}
                    </span>
                  </span>

                  <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                    <span>Project</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{time}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}