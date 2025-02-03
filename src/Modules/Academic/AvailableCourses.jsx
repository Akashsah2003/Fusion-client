import React from "react";
import { Card, Text } from "@mantine/core";
import FusionTable from "../../components/FusionTable";

const courses = [
  {
    id: 1,
    code: "OE4",
    name: "OE3C41: Agile Software Development Process\nCS8012: Compiler Design\nOE3C42: Data Warehousing and Data Mining\nOE3E30: Fibre Optics\nEC5011: Advance Semicondutor Devices\nME8021: Advanced Mechanics of Solids\nOE3M35: Advance welding and joining\nOE3D20: Industrial Design\nSW3004: SWAYAM 4",
    type: "Open Elective",
    semester: "6",
    credits: 3,
  },
  {
    id: 2,
    code: "OE5",
    name: "CS8009: Image Processing\nCS8010: Digital Watermarking\nOE3E15: Information Theory and Coding\nOE3E09: IC Fabrication\nOE3M34: Introduction to Non Destructive Evaluation\nME8019: Robotics and Intelligent Systems\nOE3M36: Generative AI for Product Innovation\nOE3D06: Indian Philosophy and Literature in English\nOE3N37: Optimization Techniques\nOE3D38: Human Computer Interaction\nOE3D21: Communication Design\nSW3005: SWAYAM 5",
    type: "Open Elective",
    semester: "6",
    credits: 3,
  },
  {
    id: 3,
    code: "OE6",
    name: "CS8011: Machine Learning\nOE2C09: Graph Theory\nOE3E35: Speech Processing\nOE3M37: Industrial Engineering\nME8014: NC-CNC Machine Tools and Programming\nOE4M27: Computer Integrated Manufacturing Systems\nOE3N33: Quantum Mechanics for Engineers\nOE3D12: Communication Skills Management\nOE4L01: Japanese Language Course Level-1\nSW3006: SWAYAM 6",
    type: "Open Elective",
    semester: "6",
    credits: 3,
  },
  {
    id: 4,
    code: "DS3014",
    name: "Fabrication Project",
    type: "Core",
    semester: "6",
    credits: 4,
  },
  {
    id: 5,
    code: "IT3C03",
    name: "Web And Mobile App Development",
    type: "Core",
    semester: "6",
    credits: 2,
  },
  {
    id: 6,
    code: "PC3003",
    name: "Professional Development Course",
    type: "Core",
    semester: "6",
    credits: 1,
  },
  {
    id: 7,
    code: "PR3003",
    name: "Optional PR Project",
    type: "Optional",
    semester: "6",
    credits: 2,
  },
];

// Column names for the table
const columnNames = [
  "ID",
  "Slot Code",
  "Slot Name",
  "Slot Type",
  "Semester",
  "Credits",
];

const mappedCourses = courses.map((course) => ({
  ID: course.id,
  "Slot Code": course.code,
  "Slot Name": <Text style={{ whiteSpace: "pre-line" }}>{course.name}</Text>,
  "Slot Type": course.type,
  Semester: course.semester,
  Credits: course.credits,
}));

function AvailableCourses() {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text
        size="lg"
        weight={700}
        mb="md"
        style={{ textAlign: "center", width: "100%", color: "#3B82F6" }}
      >
        Available Courses Next Semester
      </Text>
      <div style={{ overflowX: "auto" }}>
        <FusionTable
          columnNames={columnNames}
          elements={mappedCourses}
          width="100%"
        />
      </div>
    </Card>
  );
}

export default AvailableCourses;
