const https = require('https');
const fs = require('fs');
const path = require('path');

const TRACKS = [
  { name: 'map.mp3', query: 'Kevin_MacLeod_-_The_Complex.ogg', folder: 'ambience' },
  { name: 'briefing.mp3', query: 'Kevin_MacLeod_-_Decisions.ogg', folder: 'briefing' },
  { name: 'deployment.mp3', query: 'Kevin_MacLeod_-_Volatile_Reaction.ogg', folder: 'deployment' },
  { name: 'gameplay.mp3', query: 'Kevin_MacLeod_-_Movement_Proposition.ogg', folder: 'gameplay' },
  { name: 'critical.mp3', query: 'Kevin_MacLeod_-_Dark_Fog.ogg', folder: 'gameplay' },
  { name: 'debrief.mp3', query: 'Kevin_MacLeod_-_Rising_Tide.ogg', folder: 'debrief' },
  { name: 'void.mp3', query: 'Kevin_MacLeod_-_Klockworx.ogg', folder: 'ending' }
];

async function getWikimediaUrl(filename) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&format=json`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJS/18.0 (Bot)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1') return resolve(null);
          const fileUrl = pages[pageId].imageinfo[0].url;
          resolve(fileUrl);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'NodeJS/18.0 (Bot)' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const track of TRACKS) {
    const destDir = path.join(__dirname, '..', 'public', 'audio', track.folder);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const destPath = path.join(destDir, track.name);
    
    console.log(`Locating ${track.query}...`);
    const fileUrl = await getWikimediaUrl(track.query);
    
    if (fileUrl) {
      console.log(`Downloading to ${destPath}...`);
      await downloadFile(fileUrl, destPath);
      console.log(`Successfully downloaded ${track.name}`);
    } else {
      console.log(`Failed to locate ${track.query}`);
    }
  }
}

main().catch(console.error);
