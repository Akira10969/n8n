import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const levelsDir = path.join(__dirname, '../src/data/levels');

async function dumpCurriculum() {
  const files = [
    'level1.js', 'level2.js', 'level3.js', 'level4.js', 'level5.js', 'level6.js', 'level7.js', 'level8.js',
    'level9.js', 'level10.js', 'level11.js', 'level12.js', 'level13.js', 'level14.js', 'level15.js', 'level16.js',
    'level17.js', 'level18.js', 'level19.js', 'level20.js', 'level21.js', 'level22.js', 'level23.js', 'level24.js',
    'project1.js', 'project2.js', 'project3.js', 'project4.js', 'project5.js', 'project6.js', 'project7.js'
  ];

  let output = '# Curriculum Dump\n\n';

  for (const file of files) {
    const filePath = path.join(levelsDir, file);
    try {
      // Import the file
      const moduleUrl = pathToFileURL(filePath).href;
      const mod = await import(moduleUrl);
      const level = Object.values(mod)[0];
      
      output += '## ' + level.id + ': ' + level.title + '\n\n';
      output += '**Type:** ' + level.type + '\n\n';
      output += '**Briefing Task:** ' + (level.briefing ? level.briefing.task : 'None') + '\n\n';
      output += '**Content Overview:** ' + (level.content ? level.content.substring(0, 300).replace(/\n/g, ' ') + '...' : 'None') + '\n\n';
      output += '**Instructions:**\n';
      if (level.simulator && level.simulator.tasks) {
        level.simulator.tasks.forEach((t, i) => {
          output += '  ' + (i + 1) + '. ' + t.instruction + '\n';
        });
      }
      output += '\n---\n\n';
    } catch (e) {
      output += 'Error reading ' + file + ': ' + e.message + '\n\n';
    }
  }

  const scratchDir = path.join(__dirname, '../../.gemini/antigravity/brain/f1b45ca7-d061-43ce-9f9c-27356e8b1a1d/scratch');
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
  fs.writeFileSync(path.join(scratchDir, 'curriculum_dump.md'), output);
  console.log('Dump completed to scratch/curriculum_dump.md');
}

dumpCurriculum();
