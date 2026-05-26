const fs = require('fs');
const cheerio = require('cheerio');

function extract(file) {
  const html = fs.readFileSync(file, 'utf-8');
  const $ = cheerio.load(html);
  const results = [];
  $('.views-row').slice(0, 5).each((i, el) => {
    const title = $(el).find('.teaser__title a').text().trim();
    const url = $(el).find('.teaser__title a').attr('href');
    const dateText = $(el).find('.teaser__date').text().trim();
    results.push({ title, url, dateText });
  });
  console.log(`--- Results for ${file} ---`);
  console.log(JSON.stringify(results, null, 2));
}

extract('/tmp/bekannt.html');
extract('/tmp/verg.html');
