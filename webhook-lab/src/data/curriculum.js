import { level1 } from './levels/level1';
import { level2 } from './levels/level2';
import { level3 } from './levels/level3';
import { level4 } from './levels/level4';
import { level5 } from './levels/level5';
import { level6 } from './levels/level6';
import { level7 } from './levels/level7';
import { level8 } from './levels/level8';
import { level9 } from './levels/level9';
import { level10 } from './levels/level10';
import { level11 } from './levels/level11';
import { level12 } from './levels/level12';
import { level13 } from './levels/level13';
import { level14 } from './levels/level14';
import { level15 } from './levels/level15';
import { level16 } from './levels/level16';
import { level17 } from './levels/level17';
import { level18 } from './levels/level18';
import { level19 } from './levels/level19';
import { level20 } from './levels/level20';
import { level21 } from './levels/level21';
import { level22 } from './levels/level22';
import { level23 } from './levels/level23';
import { level24 } from './levels/level24';
import { project1 } from './levels/project1';
import { project2 } from './levels/project2';
import { project3 } from './levels/project3';
import { project4 } from './levels/project4';
import { project5 } from './levels/project5';
import { project6 } from './levels/project6';
import { project7 } from './levels/project7';

const rawCurriculum = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
  level17,
  level18,
  level19,
  level20,
  level21,
  level22,
  level23,
  level24,
  project1,
  project2,
  project3,
  project4,
  project5,
  project6,
  project7
];

export const curriculum = rawCurriculum.map((level, index) => {
  let difficulty = '★☆☆☆☆';
  let location = 'Foundation Zone';
  
  if (index >= 7 && index < 15) {
    difficulty = '★★☆☆☆';
    location = 'Platform Operations Zone';
  } else if (index >= 15 && index < 24) {
    difficulty = '★★★☆☆';
    location = 'Distributed Systems Zone';
  } else if (index >= 24) {
    difficulty = '★★★★☆';
    location = 'The Final Zone';
  }

  return {
    ...level,
    episodeNumber: index + 1,
    duration: index >= 24 ? '45-60 minutes' : '15-20 minutes',
    difficulty,
    location
  };
});

export const finalMessage = {
    id: "complete",
    title: "🎉 Course Complete",
    type: "complete",
    content: `
# 🎯 Congratulations!

You have completed the **Webhook Learning Roadmap**.

## Summary of Achievements
- Understood how modern applications communicate.
- Built secure webhook receivers and senders.
- Learned to troubleshoot webhook integrations confidently.
- Designed reliable event-driven systems.
- Explored advanced automation workflows and cloud services.
- Applied webhook concepts in DevOps and Cloud environments.

You are now ready to implement production-grade webhooks! 🚀
`
  };
