import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Button,
  Alert,
  Modal,
  Group,
  TextInput,
  Loader,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import FusionTable from "../../components/FusionTable";

const hardcodedEvents = [
  {
    id: 1,
    description: "Last Date for Adding/Dropping of course",
    startDate: "2024-05-06T09:00:00",
    endDate: "2024-07-27T23:59:00",
    timestamp: "2024-04-15T10:00:00",
  },
  {
    id: 2,
    description: "Sem 2024-2025",
    startDate: "2024-06-01T12:00:00",
    endDate: "2025-04-30T16:59:00",
    timestamp: "2024-04-15T10:05:00",
  },
  {
    id: 3,
    description: "Physical Reporting at the Institute",
    startDate: "2024-07-06T09:00:00",
    endDate: "2024-07-31T23:59:00",
    timestamp: "2024-04-15T10:10:00",
  },
  {
    id: 4,
    description: "Course verification date",
    startDate: "2024-07-06T12:00:00",
    endDate: "2024-07-31T16:59:00",
    timestamp: "2024-04-15T10:15:00",
  },
  {
    id: 5,
    description: "Pre Registration 3 2024",
    startDate: "2024-06-01T00:00:00",
    endDate: "2024-07-17T23:59:00",
    timestamp: "2024-04-15T10:20:00",
  },
  {
    id: 6,
    description: "Pre Registration 7 2024",
    startDate: "2024-07-18T09:00:00",
    endDate: "2024-07-20T16:59:00",
    timestamp: "2024-04-15T10:25:00",
  },
  {
    id: 7,
    description: "Pre Registration 5 2024",
    startDate: "2024-07-21T12:00:00",
    endDate: "2024-07-22T16:59:00",
    timestamp: "2024-04-15T10:30:00",
  },
];

function AcademicCalendar() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    description: "",
    startDateTime: null,
    endDateTime: null,
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });

        // Convert ISO strings to Date objects
        const parsedEvents = hardcodedEvents.map((event) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          timestamp: new Date(event.timestamp),
        }));

        setEvents(parsedEvents);
      } catch (error1) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const columnNames = [
    "Description",
    "Start Date",
    "End Date",
    "Last Updated",
    "Actions",
  ];

  // Formatting helpers
  const formatDateTime = (date) =>
    date?.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) || "";

  const handleEdit = (event) => {
    setEditingEvent({
      ...event,
      startDateTime: event.startDate,
      endDateTime: event.endDate,
    });
  };

  const handleSaveEdit = async () => {
    if (
      !editingEvent?.description ||
      !editingEvent.startDateTime ||
      !editingEvent.endDateTime
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      // Simulated API call
      const updatedEvent = {
        ...editingEvent,
        startDate: editingEvent.startDateTime,
        endDate: editingEvent.endDateTime,
        timestamp: new Date(),
      };

      // Replace with actual API call:
      // const response = await fetch(`/api/events/${editingEvent.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(updatedEvent)
      // });

      setEvents(
        events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
      );
      setEditingEvent(null);
      setError("");
    } catch (error1) {
      setError("Failed to update event");
    }
  };

  const handleAddEvent = async () => {
    if (
      !newEvent.description ||
      !newEvent.startDateTime ||
      !newEvent.endDateTime
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      // Simulated API call
      const eventToAdd = {
        ...newEvent,
        id: events.length + 1,
        startDate: newEvent.startDateTime,
        endDate: newEvent.endDateTime,
        timestamp: new Date(),
      };

      // Replace with actual API call:
      // const response = await fetch('/api/events', {
      //   method: 'POST',
      //   body: JSON.stringify(eventToAdd)
      // });
      // const createdEvent = await response.json();

      setEvents([...events, eventToAdd]);
      setAddModalOpen(false);
      setNewEvent({ description: "", startDateTime: null, endDateTime: null });
      setError("");
    } catch (error1) {
      setError("Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Simulated API call
      // await fetch(`/api/events/${id}`, { method: 'DELETE' });

      setEvents(events.filter((event) => event.id !== id));
    } catch (error1) {
      setError("Failed to delete event");
    }
  };

  const mappedEvents = events.map((event) => ({
    Description: event.description,
    "Start Date": formatDateTime(event.startDate),
    "End Date": formatDateTime(event.endDate),
    "Last Updated": formatDateTime(event.timestamp),
    Actions: (
      <Group spacing="xs">
        <Button
          variant="outline"
          color="blue"
          size="xs"
          onClick={() => handleEdit(event)}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          color="red"
          size="xs"
          onClick={() => handleDelete(event.id)}
        >
          Delete
        </Button>
      </Group>
    ),
  }));

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text
        size="lg"
        weight={700}
        mb="md"
        style={{ textAlign: "center", color: "#3B82F6" }}
      >
        Academic Calendar Management
      </Text>

      {loading ? (
        <Group position="center" py="xl">
          <Loader variant="dots" />
        </Group>
      ) : error ? (
        <Alert color="red">{error}</Alert>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <FusionTable
              columnNames={columnNames}
              elements={mappedEvents}
              width="100%"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "1rem",
            }}
          >
            <Button
              style={{ backgroundColor: "#4CBB17", color: "white" }}
              onClick={() => setAddModalOpen(true)}
            >
              Add New Event
            </Button>
          </div>
        </>
      )}

      <Modal
        opened={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Event"
        size="lg"
      >
        {error && (
          <Alert color="red" mb="sm">
            {error}
          </Alert>
        )}

        <TextInput
          label="Description"
          value={editingEvent?.description || ""}
          onChange={(e) =>
            setEditingEvent({ ...editingEvent, description: e.target.value })
          }
          mb="md"
          required
        />

        <DateTimePicker
          label="Start Date & Time"
          value={editingEvent?.startDateTime}
          onChange={(date) =>
            setEditingEvent({ ...editingEvent, startDateTime: date })
          }
          mb="md"
          clearable
          required
        />

        <DateTimePicker
          label="End Date & Time"
          value={editingEvent?.endDateTime}
          onChange={(date) =>
            setEditingEvent({ ...editingEvent, endDateTime: date })
          }
          mb="md"
          clearable
          required
        />

        <Group position="right" mt="lg">
          <Button color="blue" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Event"
        size="lg"
      >
        {error && (
          <Alert color="red" mb="sm">
            {error}
          </Alert>
        )}

        <TextInput
          label="Description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
          mb="md"
          required
        />

        <DateTimePicker
          label="Start Date & Time"
          value={newEvent.startDateTime}
          onChange={(date) => setNewEvent({ ...newEvent, startDateTime: date })}
          mb="md"
          clearable
          required
        />

        <DateTimePicker
          label="End Date & Time"
          value={newEvent.endDateTime}
          onChange={(date) => setNewEvent({ ...newEvent, endDateTime: date })}
          mb="md"
          clearable
          required
        />

        <Group position="right" mt="lg">
          <Button color="green" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}

export default AcademicCalendar;
