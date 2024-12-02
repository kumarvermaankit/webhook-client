import React, { useState } from 'react';
import { Button, TextField, Container, Box, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const WebhookForm = () => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const token = getToken();
  const navigate = useNavigate();
  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/webhooks/subscribe', {
        sourceUrl,
        callbackUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
      navigate("/webhooks")
    } catch (error) {
      alert('Error subscribing to the webhook!');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Subscribe to Webhook
        </Typography>
        <form onSubmit={handleSubscribe}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Source URL"
                variant="outlined"
                fullWidth
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Callback URL"
                variant="outlined"
                fullWidth
                value={callbackUrl}
                onChange={(e) => setCallbackUrl(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Subscribe
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default WebhookForm;
