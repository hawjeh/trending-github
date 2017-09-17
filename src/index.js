'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const ImgHelper = require('./imageHelper');

'use strict';

module.exports = function (period, language) {
  return new Promise((resolve, reject) => {

    if (typeof period === 'undefined') {
      period = 'daily';
    }

    if (typeof language === 'undefined') {
      language = '';
    }

    return axios.get('https://github.com/trending/' + encodeURIComponent(language) + '?since=' + period)
      .then(response => {
        const $ = cheerio.load(response.data);
        const repos = [];

        $('li', 'ol.repo-list').each((index, repo) => {
          const title = $(repo).find('h3').text().trim();

          const starLink = '/' + title.replace(/ /g, '') + '/stargazers';
          const forkLink = '/' + title.replace(/ /g, '') + '/network';

          ImgHelper($(repo).find('img', 'avatar mb-1')).then((imgs) => {
            repos.push({
              id: index,
              author: title.split(' / ')[0],
              name: title.split(' / ')[1],
              authorName: title,
              href: 'https://github.com/' + title.replace(/ /g, ''),
              description: $(repo).find('p', '.py-1').text().trim() || null,
              colorStyle: $(repo).find('span', '.repo-language-color ml-0')[2].attribs.style,
              language: $(repo).find('[itemprop=programmingLanguage]').text().trim(),
              stars: parseInt($(repo).find('[href="' + starLink + '"]').text().trim().replace(',', '') || 0),
              starsDay: $(repo).find('span', '.d-inline-block float-sm-right').last().text().trim().replace(',', ''),
              forks: parseInt($(repo).find('[href="' + forkLink + '"]').text().trim().replace(',', '') || 0),
              imgs: imgs
            });
          });
        });

        resolve(repos);
      })
      .catch(err => {
        reject(err);
      });
  });
}
