import { useState } from "react";
import { Flex } from "@mantine/core";

import CustomBreadcrumbs from "../../components/Breadcrumbs";
import ModuleTabs from "../../components/moduleTabs";
import RegisteredCourses from "./RegisteredCourses";
import AvailableCourses from "./AvailableCourses";
import PreRegistration from "./PreRegistration";
import FinalRegistration from "./FinalRegistration";
import StudentCourses from "./StudentCourses";
import DeletePreRegistration from "./DeletePreRegistration";
import AcademicCalendar from "./AcademicCalendar";

function AcademicPage() {
  const [activeTab, setActiveTab] = useState("0");
  const tabItems = [
    { title: "Registered Courses" },
    { title: "Available Courses" },
    { title: "Pre-Registration" },
    { title: "Final-Registration" },
    { title: "Student Courses" },
    { title: "Delete Pre-Registration" },
    { title: "Academic Calendar" },
  ];
  const tabComponents = [
    RegisteredCourses,
    AvailableCourses,
    PreRegistration,
    FinalRegistration,
    StudentCourses,
    DeletePreRegistration,
    AcademicCalendar,
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
