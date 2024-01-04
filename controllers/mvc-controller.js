// Import the necessary functions from the database module.
import { insertUrl, getUrl, incrementVisit } from '../data/database.js';



function handleError(res, err, message = "Server error", statusCode = 500) {
  console.error(message, err);
  res.status(statusCode).send(message);
}




/**
 * Set up routes for the web application.
 *
 * @param {object} app - The express application instance.
 */
function routes(app) {
  // Route handler for the home page ('/').
  app.get('/', async (req, res) => {
    try {
      const urls = await getUrl('all');
      const visitors = urls.reduce((acc, url) => acc + url.visits, 0);
      const model = { urls, visitors };
      res.render('home', model);
    } catch (err) {
      handleError(res, err);
    }
  });

  // Route handler to list all shortened URLs.
  app.get('/urls', async (req, res) => {
    try {
      const urls = await getUrl('all');
      const model = { urls };
      console.log(model)
      res.render('urls', model);
    } catch (err) {
      handleError(res, err);
    }
  });

  // Route handler for the add new URL form page.
  app.get('/add-url', (req, res) => {
    const model = { url: "", shortCode: "newCode" };
    res.render('add-url', model);
  });

  // Route handler for adding a new URL through POST request.
  app.post('/add-url', async (req, res) => {
    try {
      const { url: newUrl, shortCode } = req.body;
      if (!newUrl || !shortCode) {
        return handleError(res, new Error('Missing URL or Short Code'), 'Invalid input', 400);
      }
      await insertUrl(newUrl, shortCode);
      res.redirect('/urls');
    } catch (err) {
      handleError(res, err, "Server error: " + err.message);
    }
  });

  // Route handler for redirecting a shortCode to its original URL.
  app.get('/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params;
      const urlEntry = await getUrl(shortCode);
      if (urlEntry) {
        await incrementVisit(shortCode);
        res.redirect(urlEntry.url);
      } else {
        handleError(res, new Error('Shortcode not found'), 'Shortcode not found', 404);
      }
    } catch (err) {
      handleError(res, err);
    }
  });
}


export { routes };


