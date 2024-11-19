import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Flex,
  Grid,
  Paper,
  TextInput,
  Title,
  Select,
  FileInput,
  MultiSelect,
  NumberInput,
} from "@mantine/core";
import axios from "axios";
import CustomBreadcrumbs from "../../components/Breadcrumbs";
import classes from "./createAnnouncement.module.css";
import { host } from "../../routes/globalRoutes";
import {
  userSearchRoute,
  departmentinfoRoute,
} from "../../routes/announcementRoutes";

const categories = ["all", "students", "faculty", "specific_users"];

function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [batch, setBatch] = useState(null);
  const [options, setOptions] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchUsers = async (query) => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.get(userSearchRoute, {
        params: { q: query },
      });

      const users = response.data.results.map((user) => ({
        value: user.id.toString(),
        label: user.text,
      }));

      setOptions(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(departmentinfoRoute); // No token in headers
        setDepartments(response.data); // Set departments from the response
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    setLoading(true);

    try {
      const payload = {
        message: title,
        target_group: category,
        specific_users: selectedUsers,
      };
      if (batch) {
        payload.batch = batch;
      }
      if (department) {
        payload.department = department;
      }
      console.log("Payload:", payload);
      const response = await axios.post(
        `${host}/notifications/api/announcements/create`,
        payload,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      if (response.status === 200) {
        console.log("Announcement created successfully");
        // Reset form
        setTitle("");
        setCategory(categories[0]);
        // setDescription("");
        setDepartment("");
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomBreadcrumbs />
      <Container py="xl">
        {!isFormVisible && (
          <Button onClick={() => setIsFormVisible(true)}>
            Create Announcement
          </Button>
        )}
        {isFormVisible && (
          <>
            <Button onClick={() => setIsFormVisible(false)} mb="lg">
              Back
            </Button>
            <Paper radius="md" px="lg" py="xl" withBorder>
              <Title order={2} mb="lg">
                Create Announcement
              </Title>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Announcement Title"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    classNames={{
                      input: classes.announcementInput,
                    }}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Target Group"
                    placeholder="Select category"
                    data={categories}
                    value={category}
                    onChange={setCategory}
                    classNames={{
                      input: classes.selectInput,
                    }}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Department"
                    placeholder="Select department"
                    data={departments.map((dep) => ({
                      value: String(dep.id), // Use the department ID or unique identifier
                      label: dep.name, // Use the department name or appropriate display name
                    }))}
                    value={String(department)}
                    onChange={(value) => setDepartment(value)}
                    classNames={{
                      input: classes.selectInput,
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Batch"
                    placeholder="Enter Batch"
                    value={batch}
                    onChange={(value) => setBatch(value)} // Directly use the value provided
                    classNames={{
                      input: classes.announcementInput,
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <MultiSelect
                    label="Specific Users"
                    placeholder="Search and select users"
                    searchable
                    nothingFound="No users found"
                    data={options}
                    value={selectedUsers}
                    onChange={(value) => {
                      setSelectedUsers(value);
                      console.log(value);
                    }} // Updates selected users
                    onSearchChange={fetchUsers} // Fetch users based on query
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <FileInput
                    label="Attach Files (PDF, PNG, JPEG, JPG)"
                    placeholder="Choose file"
                    value={attachment}
                    onChange={setAttachment}
                    accept="application/pdf,image/jpeg,image/png,image/jpg"
                    className={{
                      input: classes.fileInput,
                    }}
                  />
                </Grid.Col>
              </Grid>

              <Flex justify="flex-end" mt="xl">
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  loaderProps={{ type: "dots" }}
                  disabled={!title}
                >
                  Create Announcement
                </Button>
              </Flex>
            </Paper>
          </>
        )}
      </Container>
    </>
  );
}

export default CreateAnnouncement;
