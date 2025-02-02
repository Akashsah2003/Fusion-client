import CustomBreadcrumbs from "../../components/Breadcrumbs";
import { Flex } from "@mantine/core";
import ModuleTabs from "../../components/moduleTabs";
import { useState } from "react";
import RegisteredCourses from "./RegisteredCourses";
import AvailableCourses from "./AvailableCourses";
import PreRegistration from "./PreRegistration";
import FinalRegistration from "./FinalRegistration";

function AcademicPage() {
  const [activeTab, setActiveTab] = useState("0");
  const tabItems = [{ title: "Registered Courses" }, { title: "Available Courses" }, { title: "Pre-Registration" }, { title: "Final-Registration" }];
  const tabComponents = [RegisteredCourses, AvailableCourses, PreRegistration, FinalRegistration];
  const ActiveComponent = tabComponents[parseInt(activeTab)];
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
