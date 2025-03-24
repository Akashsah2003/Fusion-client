/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  Button,
  Alert,
  LoadingOverlay,
  Select,
  Stack,
} from "@mantine/core";
import { IconUpload, IconFileSpreadsheet } from "@tabler/icons-react";

function AllotCourses() {
  // Default hardcoded options for demonstration
  const defaultProgrammeOptions = [
    { value: "B.Tech CSE 2021", label: "B.Tech CSE 2021" },
    { value: "M.Tech CSE 2022", label: "M.Tech CSE 2022" },
    { value: "B.Tech CSE 2022", label: "B.Tech CSE 2022" },
  ];

  const defaultSemesterOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  const defaultYearOptions = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  // State for API driven options, falling back to hardcoded defaults
  const [programmeOptions, setProgrammeOptions] = useState(
    defaultProgrammeOptions,
  );
  const [semesterOptions, setSemesterOptions] = useState(
    defaultSemesterOptions,
  );
  const [yearOptions, setYearOptions] = useState(defaultYearOptions);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [programme, setProgramme] = useState("");
  const [semester, setSemester] = useState("");
  const [workingYear, setWorkingYear] = useState("");

  // useEffect to fetch options from API. Replace the URLs with your actual endpoints.
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const programmeRes = await fetch("/api/programme-options");
        if (programmeRes.ok) {
          const programmes = await programmeRes.json();
          setProgrammeOptions(programmes);
        }
        const semesterRes = await fetch("/api/semester-options");
        if (semesterRes.ok) {
          const semesters = await semesterRes.json();
          setSemesterOptions(semesters);
        }
        const yearRes = await fetch("/api/year-options");
        if (yearRes.ok) {
          const years = await yearRes.json();
          setYearOptions(years);
        }
      } catch (error) {
        console.error(
          "Error fetching options from API, using defaults:",
          error,
        );
        // If there is an error, the defaults remain in state
      }
    };

    fetchOptions();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowSuccess(false);
    }
  };

  const handleUpload = async () => {
    // Check if all dropdown fields have been filled
    if (!programme || !semester || !workingYear) {
      alert("Please fill out all dropdown fields before uploading.");
      return;
    }
    setIsUploading(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
    setIsUploading(false);
    setShowSuccess(true);
    setSelectedFile(null);
  };

  // Validate that all required fields are selected
  const isFormValid = selectedFile && programme && semester && workingYear;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text
        size="lg"
        weight={700}
        mb="md"
        style={{ textAlign: "center", width: "100%", color: "#3B82F6" }}
      >
        Allot Student Courses
      </Text>

      <div style={{ marginBottom: "0.5rem" }}>
        <Text
          size="md"
          weight={700}
          style={{ color: "#003366", marginBottom: "6px" }}
        >
          Note: Provide the data in Excel Sheet in following format:
        </Text>
        <Text size="sm" color="dimmed" style={{ marginBottom: "10px" }}>
          RollNo | CourseSlot Name | CourseCode | CourseName
        </Text>
        <Text size="md" weight={700} style={{ color: "#000000" }}>
          <a
            href="/sample.xlsx"
            download
            style={{
              color: "#3B82F6",
              textDecoration: "underline",
            }}
          >
            Download the sample excel sheet
          </a>
          , fill the data accordingly and then upload the same:
        </Text>
      </div>

      {/* Vertical dropdowns */}
      <Stack spacing="md" mb="xl">
        <Select
          label="Programme"
          placeholder="Select Programme"
          value={programme}
          onChange={setProgramme}
          data={programmeOptions}
          style={{ width: 500 }}
        />
        <Select
          label="Semester"
          placeholder="Select Semester"
          value={semester}
          onChange={setSemester}
          data={semesterOptions}
          style={{ width: 300 }}
        />
        <Select
          label="Working Year"
          placeholder="Select Working Year"
          value={workingYear}
          onChange={setWorkingYear}
          data={yearOptions}
          style={{ width: 300 }}
        />
      </Stack>

      <div
        style={{
          border: "2px dashed #ced4da",
          borderRadius: "8px",
          padding: "2rem",
          textAlign: "center",
          position: "relative",
          backgroundColor: "#f8f9fa",
        }}
      >
        <LoadingOverlay visible={isUploading} />
        <input
          type="file"
          id="file-upload"
          accept=".xlsx,.xls,.csv"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        {/* Always show the Choose File button */}
        <label htmlFor="file-upload">
          <Button
            leftIcon={<IconUpload size="1rem" />}
            variant="outline"
            component="span"
            style={{ borderColor: "#3B82F6", color: "#3B82F6" }}
          >
            Choose File
          </Button>
        </label>

        {selectedFile ? (
          <>
            <div style={{ marginTop: "1rem" }}>
              <IconFileSpreadsheet color="#2b8a3e" size="2.2rem" />
              <Text size="sm" color="dimmed" mt={4}>
                {selectedFile.name}
              </Text>
            </div>
            {/* When a file is selected, show the Upload button below */}
            <Button
              leftIcon={<IconUpload size="1rem" />}
              style={{
                marginTop: "1rem",
                backgroundColor: "#3B82F6",
                color: "#fff",
              }}
              onClick={handleUpload}
              disabled={!isFormValid || isUploading}
            >
              Upload
            </Button>
          </>
        ) : (
          <Button
            leftIcon={<IconUpload size="1rem" />}
            style={{
              marginLeft: "1rem",
              backgroundColor: "#3B82F6",
              color: "#fff",
            }}
            onClick={handleUpload}
            disabled={!isFormValid || isUploading}
          >
            Upload
          </Button>
        )}
      </div>

      {showSuccess && (
        <Alert
          mt="xl"
          title="Upload Successful"
          color="green"
          withCloseButton
          onClose={() => setShowSuccess(false)}
        >
          Student courses have been successfully allotted based on the uploaded
          file.
        </Alert>
      )}
    </Card>
  );
}

export default AllotCourses;
