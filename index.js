import express from 'express';
import { routes } from './controllers/mvc-controller.js';

// Create an instance of the express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set Pug as the view engine for rendering views
app.set('view engine', 'pug');

// Use express.urlencoded to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Initialize routes for the application
routes(app);

// Set the port for the server
const port = process.env.PORT || 3000;

// Start listening for requests on the configured port
app.listen(port, () => {
  console.log(`App started. Listening at http://localhost:${port}`);
})
.on('error', (err) => {
  // Handle specific listen errors with friendly messages
  if (err.errno === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
    process.exit(1);
  } else {
    throw err;
  }
});