import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import WebhookForm from './components/WebhookForm';
import WebhookList from './components/WebhookList';
import { isAuthenticated, removeToken } from './utils/auth';
import { Container, AppBar, Toolbar, Typography, Box, Button, Stack } from '@mui/material';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Webhook Subscription System
            </Typography>
            <Stack direction="row" spacing={2}>
              {isAuthenticated() && (
                <>
                  <Button color="inherit" component={Link} to="/webhooks">Webhooks</Button>
                  <Button color="inherit" component={Link} to="/subscribe">Subscribe</Button>
                  <Button color="inherit" component={Link} to="/login" onClick={() =>{ 
                    removeToken();
                    
                    }}>Logout</Button>
                </>
              )}
              {!isAuthenticated() && (
                <>
                  <Button color="inherit" component={Link} to="/login">Login</Button>
                  <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        <Container>
          <Box sx={{ marginTop: 4 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/webhooks"
                element={<WebhookList />}
              />
              <Route
                path="/subscribe"
                element={isAuthenticated() ? <WebhookForm /> : <Login />}
              />
              <Route path="/" element={<Login />} />
            </Routes>
          </Box>
        </Container>
      </div>
    </Router>
  );
}

export default App;
