module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        sitemapLocations() {
          return fetch(`http://localhost:8000/sitemap.xml`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/xml',
            },
          })
            .then(res => res.text())
            .then(xml => {
              return locs = [...xml.matchAll(`<loc>(.|\n)*?</loc>`)].map(([loc]) =>
                loc.replace('<loc>', '').replace('</loc>', '').replace('https://example.com','http://localhost:8000'),
              )
            })
        },
      })
    },
  },
};
