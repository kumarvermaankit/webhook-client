import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { Button, Link, Card, CardContent, Typography, List, ListItem } from '@mui/material';
import RealTimeWebhook from './WebhookEvent';

const WebhookList = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhookId, setSelectedWebhookId] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/webhooks/subscriptions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWebhooks(response.data?.filter((hook) => hook.status === "active"));
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      }
    };

    fetchWebhooks();
  }, [token]);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/webhooks/cancel-subscription/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWebhooks(webhooks.filter((webhook) => webhook._id !== id));
    } catch (error) {
      alert('Failed to cancel webhook!');
    }
  };

  const handleShowEvents = (id) => {
    if (id === selectedWebhookId) {
        setSelectedWebhookId(null)
     } else {
        setSelectedWebhookId(id);
     }
  };

  return (
    <div className="webhook-list" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Subscribed Webhooks
      </Typography>
      <Link href="/subscribe" style={{ marginBottom: '20px', display: 'inline-block' }}>
        <Button variant="outlined" color="primary">
          Subscribe Webhook
        </Button>
      </Link>
      
      <List>
        {webhooks.map((webhook) => (
          <ListItem key={webhook._id} style={{ marginBottom: '15px' }}>
            <Card variant="outlined" style={{ width: '100%', padding: '10px' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Source URL: {webhook.sourceUrl}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Callback URL: {webhook.callbackUrl}
                </Typography>

                <div style={{ marginTop: '10px' }}>
                  <Button
                    onClick={() => handleShowEvents(webhook._id)}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }}
                  >
                    Show Events
                  </Button>
                  <Button
                    onClick={() => handleCancel(webhook._id)}
                    variant="outlined"
                    color="secondary"
                  >
                    Cancel Subscription
                  </Button>
                </div>

                {selectedWebhookId === webhook._id && (
                  <div style={{ marginTop: '15px' }}>
                    <RealTimeWebhook webhookId={webhook._id} />
                  </div>
                )}
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default WebhookList;
