import { useState } from "react";
import { Flex } from "@mantine/core";
import { useSelector } from "react-redux";

import CustomBreadcrumbs from "../../components/Breadcrumbs";
import ModuleTabs from "../../components/moduleTabs";
import RegisteredCourses from "./RegisteredCourses";
import AvailableCourses from "./AvailableCourses";
import PreRegistration from "./PreRegistration";
import FinalRegistration from "./FinalRegistration";
import StudentCourses from "./StudentCourses";
import DeletePreRegistration from "./DeletePreRegistration";
import AcademicCalendar from "./AcademicCalendar";
import VerifyStudentRegistration from "./VerifyStudentRegistration";

function AcademicPage() {
  const [activeTab, setActiveTab] = useState("0");
  const role = useSelector((state) => state.user.role);
  const tabItems =
    role === "acadadmin" || role === "studentacadadmin"
      ? [
          { title: "Student Courses" },
          { title: "Delete Pre-Registration" },
          { title: "Academic Calendar" },
          { title: "Verify Student Registration" },
        ]
      : [
          { title: "Registered Courses" },
          { title: "Available Courses" },
          { title: "Pre-Registration" },
          { title: "Final-Registration" },
        ];
  const tabComponents =
    role === "acadadmin" || role === "studentacadadmin"
      ? [
          StudentCourses,
          DeletePreRegistration,
          AcademicCalendar,
          VerifyStudentRegistration,
        ]
      : [
          RegisteredCourses,
          AvailableCourses,
          PreRegistration,
          FinalRegistration,
        ];
  const ActiveComponent = tabComponents[parseInt(activeTab, 10)];
  return (
    <>
      <CustomBreadcrumbs />
      <Flex justify="space-between" align="center" mt="lg">
        <ModuleTabs
          tabs={tabItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Flex>
      <ActiveComponent mt="xl" />
    </>
  );
}

export default AcademicPage;
