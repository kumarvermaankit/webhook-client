import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { CircularProgress, MenuItem, FormControl, Select, InputLabel, Box } from '@mui/material';

const RealTimeWebhook = ({ webhookId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState('all'); // Default filter is 'all' to show all events
  const token = getToken();

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/webhooks/recent-events/${webhookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents(response.data.recentEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on initial render and start polling
  useEffect(() => {
    if (webhookId) {
      fetchEvents(); // Initial fetch when component mounts

      // Polling logic
      const interval = setInterval(() => {
        fetchEvents();
      }, 5000); // Poll every 5 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [webhookId, token]);

  // Handle the filter change
  const handleFilterChange = (event) => {
    setEventTypeFilter(event.target.value);
  };

  // Filter the events based on the selected event type
  const filteredEvents = eventTypeFilter === 'all' ? events : events.filter(event => event.type === eventTypeFilter);

  // Get unique event types for filter options
  const filters = [...new Set(events.map((e) => e.type))];

  return (
    <div className="real-time-events">
      <h3>Real-Time Webhook Events</h3>
      {loading ? <CircularProgress /> : null}

      <Box sx={{ marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Filter by Event Type</InputLabel>
          <Select
            value={eventTypeFilter}
            onChange={handleFilterChange}
            label="Filter by Event Type"
          >
            <MenuItem value="all">All</MenuItem>
            {filters.map((e, index) => (
              <MenuItem key={index} value={e}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ul>
        {filteredEvents?.length === 0 || filteredEvents === null ? (
          <li>No events found</li>
        ) : (
          filteredEvents.map((event, index) => (
            <li key={index}>
              <strong>{event.type}</strong>: {JSON.stringify(event.data)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RealTimeWebhook;
