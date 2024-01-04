const { insertUrl, getUrl, incrementVisit } = require('../data/database');


function routes(app) {
  // Route handler for '/'
  app.get('/', function(req, res) {
    getUrl('all', function (err, urls) { // use 'urls' instead of 'data'
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
      let visitors = 0;
      for (const url of urls) { // use 'urls' directly
        visitors += url.visits; // Assumes 'visits' column exists in the database
      }
      let model = { urls, visitors };
      res.render('home', model);
    });
  });

  // Route handler for '/urls'
  app.get('/urls', function(req, res) {
    getUrl('all', function (err, urls) { // use 'urls' instead of 'data'
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
      let model = { urls }; // again, use 'urls' directly
      console.log(model)
      res.render('urls', model);
    });
  });

  app.get('/add-url', function(req, res) {
    let model = { url: "", shortCode: "newCode" };
    res.render('add-url', model);
  });

  app.post('/add-url', function(req, res) {
    const newUrl = req.body.url;
    const shortCode = req.body.shortCode;
    insertUrl(newUrl, shortCode, (err, urlData) => {
      if (err) {
        // Handle error, for instance when shortCode is not unique
        console.error(err);
        return res.status(500).send("Server error: " + err.message);
      }
      // Redirect to the URLs page after successful insertion
      res.redirect('/urls');
    });
  });

  app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    
      getUrl(shortCode, (err, urlEntry) => {
        if (err) {
          // Handle error
          console.error(err);
          return res.status(500).send("Server error");
        }
        if (urlEntry) {
          incrementVisit(shortCode);
          res.redirect(urlEntry.url); // Redirect to the original URL
        } else {
          res.status(404).send("Shortcode not found"); // Send a 404 not found response
        }
      });
  });


}


module.exports = { routes };
