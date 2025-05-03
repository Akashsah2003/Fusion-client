import React, { useEffect, useState } from 'react';
import {
  Title, Table, Select,
  Button, Modal, Group, Text, Loader, Alert,
  Card
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';

import {
  studentRegisteredSlotsRoute,
  studentBatchCreateRoute,
  studentListRequestsRoute,
} from '../../routes/academicRoutes';

export default function StudentCourseReplacement() {
  const [slots, setSlots]             = useState([]);
  const [existingReqs, setExistingReqs] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [preview, setPreview]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  // 1) Load existing requests; if none, load and filter slots
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No auth token found');
      setLoading(false);
      return;
    }

    axios.get(studentListRequestsRoute, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        setExistingReqs(res.data);
        if (res.data.length === 0) {
          return axios.get(studentRegisteredSlotsRoute, {
            headers: { Authorization: `Token ${token}` }
          });
        }
        return null;
      })
      .then(res2 => {
        if (res2) {
          // initialize and filter slots
          const filtered = res2.data
            .filter(s => s.new_courses.length > 1)
            .map(s => ({ ...s, newCourse: '' }));
          setSlots(filtered);
        }
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error)   return <Alert color="red">{error}</Alert>;

  // 2) If already submitted, show notice
  if (existingReqs && existingReqs.length > 0) {
    return (
      <Card>
        <Alert color="yellow">
          You have already filled the replacement form. Please wait for processing.
        </Alert>
      </Card>
    );
  }

  // 3) Handle selection change
  const pickCourse = (idx, val) => {
    setSlots(slots.map((s, i) =>
      i === idx ? { ...s, newCourse: val } : s
    ));
  };

  // 4) Prepare payload
  const toSubmit = slots.filter(s => s.newCourse !== '');

  // 5) Submit handler
  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      showNotification({ title: 'Auth Error', message: 'No token', color: 'red' });
      return;
    }
    setSubmitting(true);

    try {
      const res = await axios.post(studentBatchCreateRoute,
        {
          requests: toSubmit.map(s => ({
            course_slot:   s.id,
            old_course:    s.old_course.id,
            new_course:    parseInt(s.newCourse, 10),
            academic_year: s.academic_year,
            semester_type: s.semester_type,
          }))
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      showNotification({ title: 'Submitted', message: 'Requests are pending', color: 'green' });
      setExistingReqs(res.data.created || []);
    } catch (err) {
      showNotification({
        title: 'Submit failed',
        message: err.response?.data?.error || err.message,
        color: 'red'
      });
    } finally {
      setSubmitting(false);
      setPreview(false);
    }
  };

  return (
    <Card>

      <Table highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Current Course</th>
            <th>New Course</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s, i) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.old_course.code} - {s.old_course.name}</td>
              <td style={{ minWidth: 200 }}>
                <Select
                  placeholder="Select new course…"
                  data={s.new_courses.map(c => ({
                    value: String(c.id),
                    label: `( ${c.code} - ${c.name} ) - (seats available - ${c.seats_available})`,
                  }))}
                  value={s.newCourse}
                  onChange={val => pickCourse(i, val)}
                  clearable
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Group position="right" mt="xl">
        <Button
          disabled={toSubmit.length === 0}
          onClick={() => setPreview(true)}
        >
          Review &amp; Submit
        </Button>
      </Group>

      <Modal
        opened={preview}
        onClose={() => setPreview(false)}
        title="Confirm Your Changes"
        size="lg"
      >
        {toSubmit.length === 0 ? (
          <Text>No changes selected.</Text>
        ) : (
          <>
            <Table>
              <thead>
                <tr><th>Slot</th><th>Old</th><th>New</th></tr>
              </thead>
              <tbody>
                {toSubmit.map((s, idx) => {
                  const nc = s.new_courses.find(c => String(c.id) === s.newCourse);
                  return (
                    <tr key={`${s.id}-${s.newCourse}-${idx}`}>
                      <td>{s.name}</td>
                      <td>{s.old_course.code}</td>
                      <td>{nc ? `${nc.code} – ${nc.name}` : 'Invalid'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setPreview(false)}>Cancel</Button>
              <Button onClick={handleSubmit} loading={submitting}>Submit</Button>
            </Group>
          </>
        )}
      </Modal>
    </Card>
  );
}
