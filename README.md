# URL Shortener

A simple web application to create short aliases for long URLs, designed to be fast and easy to use.

## Features

- Generate short links for long URLs
- Redirect to the original URLs using the short links
- Track the number of times a shortened URL has been visited
- Easy-to-use interface for creating and managing short links

## Technologies Used

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **SQLite**: An in-process library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine.
- **Pug**: A high-performance template engine heavily influenced by Haml and implemented with JavaScript for Node.js and browsers.
- **sqlite3**: A Node.js module for SQLite, with a simple, clean API.

## Future Improvements

1. **User Authentication**: Implement user accounts to allow users to manage their set of URLs.
2. **Analytics Dashboard**: Provide analytics for each shortened URL, including geographic data and click-through rates.
3. **Custom Short Code**: Allow users to choose custom short codes for their URLs, subject to availability.
4. **Expiration Time/Clicks**: Add an option for URLs to expire after a certain time or number of clicks.
5. **API Access**: Develop an API for programmatic access to create and manage short links.
6. **Rate Limiting**: Incorporate rate limiting to prevent abuse of the service.

## Overview
The code consists of a web application that uses **Node.js**, **Express**, and **SQLite** to manage URLs and their shortened counterparts. 

### `mvc-controller.js`
This file defines the routes and the logic for handling different HTTP requests to the web server.

- `routes(app)` function: Sets up the endpoints of the web application. Each route is mapped to a specific function to handle requests to that path.
- `/` route: Displays the home page with a list of all URLs and the total number of visits across all URLs.
- `/urls` route: Shows a page listing all shortened URLs.
- `/add-url` GET route: Presents a form to add a new URL.
- `/add-url` POST route: Submits the form to add a new URL and short code into the database.
- `/:shortCode` route: Redirects a given short code to its original URL and increments the visit count.
- `handleError` function: A helper to handle errors by logging them and sending an error response.

### `database.js`
This file provides functions to interact with the SQLite database.

- Initialises the database and creates a table for URLs if it doesn't exist.
- `insertUrl`: Adds a new URL and its short code to the database.
- `getUrl`: Fetches a specific URL by short code or all URLs if 'all' is specified.
- `incrementVisit`: Increases the visit count by one for a given short code.

### `index.js`
The entry point of the application that initialises and starts the Express server.

- Sets up Express middleware for static files and URL-encoded body parsing.
- Initialises the routes for the application.
- Starts the server on a specified port and logs the address to the console.

## Model View Controller

The structure of this link shortener application adheres to the MVC (Model-View-Controller) pattern:

### Model:
The interaction with the database is handled by the `data/database.js` file which contains functions to manipulate URL data. This is considered to be the Model component of the MVC pattern, as it manages the data and business logic of the application.

### View:
The application's views are rendered using Pug templates, which define the HTML structure and presentation of data rendered on the client-side. The views are the components that present data to the user and are separate from the controllers and models.

### Controller:
The `controllers/mvc-controller.js` file includes route handlers that act as controllers. These functions respond to HTTP requests, interact with the Model to retrieve or update data, and determine which view to render or redirect to. The `routes` function sets up the route definitions and associates them with controller logic.

This separation of concerns aligns with the MVC framework, allowing for modular development and easier maintenance. The Model is responsible for the data, the View for the user interface, and the Controller for handling the application logic.


