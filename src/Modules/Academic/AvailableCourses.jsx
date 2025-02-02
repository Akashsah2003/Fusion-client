import React from "react";
import { Card, Text } from "@mantine/core";
import FusionTable from "../../components/FusionTable";

// Sample data for courses
const courses = [
  { id: 1, code: "CS101", name: "Introduction to Computer Science", type: "Core", semester: "1", credits: 4 },
  { id: 2, code: "CS102", name: "Data Structures and Algorithms", type: "Core", semester: "2", credits: 4 },
  { id: 3, code: "CS201", name: "Web Development", type: "Elective", semester: "3", credits: 3 },
  { id: 4, code: "CS202", name: "Database Management Systems", type: "Core", semester: "4", credits: 4 },
  { id: 5, code: "CS203", name: "Operating Systems", type: "Core", semester: "5", credits: 4 },
];

// Column names for the table
const columnNames = ["id", "code", "name", "type", "semester", "credits"];

const AvailableCourses = () => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text size="xl" weight={700} mb="md">
        Available Courses
      </Text>
      <FusionTable
        caption="List of available courses"
        columnNames={columnNames}
        elements={courses}
        scrollableX
      />
    </Card>
  );
};

export default AvailableCourses;
