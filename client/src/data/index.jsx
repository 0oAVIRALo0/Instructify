import React from "react";

import { AiOutlineCalendar } from "react-icons/ai";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const links = [
  {
    title: "student",
    sections: [
      {
        title: "Dashboard",
        links: [
          {
            name: "Offered Courses",
            icon: <GroupsIcon />,
          },
          {
            name: "Enrolled Courses",
            icon: <GroupsIcon />,
          },
        ],
      },
    ],
  },
  {
    title: "instructor",
    sections: [
      {
        title: "Dashboard",
        links: [
          {
            name: "My Courses",
            icon: <PersonSearchIcon />,
          },
          {
            name: "Add Course",
            icon: <GroupsIcon />,
          },
        ],
      },
    ],
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const userProfileData = [
  {
    icon: <ManageAccountsIcon />,
    title: "Update Profile",
    desc: "Edit your profile",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    link: "/form",
  },
];