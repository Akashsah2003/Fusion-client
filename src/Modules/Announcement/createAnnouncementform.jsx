import { useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  Paper,
  TextInput,
  Title,
  Select,
  ScrollArea,
  Textarea,
  FileInput,
} from "@mantine/core";
import axios from "axios";
import CustomBreadcrumbs from "../../components/Breadcrumbs";
import classes from "./createAnnouncement.module.css";
import userIDs from "./userIDs";

const categories = [
  "All",
  "Staff and Student",
  "Students",
  "Faculty",
  "Faculty and Staff",
  "Staff",
];
const batches = ["2019", "2020", "2021", "2022", "2023", "2024"];
const departments = ["CSE", "ECE", "ME", "SM", "DES"];

function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [department, setDepartment] = useState(departments[0]);
  const [batch, setBatch] = useState(batches[0]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    setLoading(true);

    try {
      const payload = {
        title,
        category,
        description,
        flag: "announcement",
      };
      const response = await axios.post("/api/announcement/create", payload, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 200) {
        console.log("Announcement created successfully");
        // Reset form
        setTitle("");
        setCategory(categories[0]);
        setDescription("");
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
                    data={departments}
                    value={department}
                    onChange={setDepartment}
                    classNames={{
                      input: classes.selectInput,
                    }}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Batch"
                    placeholder="Select category"
                    data={batches}
                    value={batch}
                    onChange={setBatch}
                    classNames={{
                      input: classes.selectInput,
                    }}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Checkbox.Group
                    label="specific users"
                    value={selectedUsers}
                    onChange={setSelectedUsers}
                  >
                    <ScrollArea
                      style={{
                        height: 200,
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "4px",
                      }}
                      offsetScrollbars
                    >
                      {userIDs.map((id) => (
                        <Checkbox key={id} value={id} label={id} />
                      ))}
                    </ScrollArea>
                  </Checkbox.Group>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Textarea
                    label="Description"
                    placeholder="Write announcement details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={5}
                    classNames={{
                      input: classes.textAreaInput,
                    }}
                    required
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
                  disabled={!title || !description}
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
