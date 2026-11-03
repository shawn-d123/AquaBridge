// Builds the static site from the planning data.
//   node tools/build.js
// Outputs: backlog/index.html, planning/sprint1-jira-import.csv
// Edit planning/sprint1-tasks.json or planning/backlog.template.html, then re-run.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(root, p), s);

const HEAD = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
`;
// Wraps a page fragment (title, styles, markup, script) as a full HTML document.
const page = body => body.startsWith('<!doctype') ? body : HEAD + body + '\n</html>\n';

const data = JSON.parse(read('planning/sprint1-tasks.json'));

// Backlog page: links point at the prototype in this repo rather than the Claude-hosted copy.
const tpl = read('planning/backlog.template.html');
write('backlog/index.html', page(tpl.replace('/*DATA*/', JSON.stringify(data)).replace('/*PROTO*/', '../prototype/')));

// Jira CSV: team-managed projects link children to epics through Issue ID / Parent.
const article = as => /^(Owner|Adopter|Administrator)/.test(as) ? 'an' : 'a';
const storyLine = id => { const s = data.stories.find(x => x.id === id); return `${id}: As ${article(s.as)} ${s.as.toLowerCase()}, I want to ${s.want.charAt(0).toLowerCase() + s.want.slice(1)}, so that ${s.so}.`; };
const bullets = arr => arr && arr.length ? arr.map(a => `* ${a}`).join('\n') : 'None.';
const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
const rows = [['Issue ID', 'Issue Type', 'Summary', 'Description', 'Priority', 'Labels', 'Labels', 'Labels', 'Parent', 'Assignee (map on import)']];
const epicIds = {};
data.epics.forEach((e, i) => {
  epicIds[e.key] = i + 1;
  rows.push([i + 1, 'Epic', e.name, `${e.summary}\n\nBacklog stories: ${e.stories}`, 'High', 'sprint-1', '', '', '', '']);
});
data.tasks.forEach((t, i) => {
  const desc = [
    t.description,
    `h3. User stories\n${t.stories.length ? t.stories.map(id => `* ${storyLine(id)}`).join('\n') : 'Team process task.'}`,
    `h3. What to build\n${bullets(t.build)}`,
    `h3. States to handle\n${bullets(t.states)}`,
    `h3. Data in and out\n${t.data}`,
    `h3. Depends on\n${t.depends}`,
    `h3. Where to look in the prototype\n${t.design}\nPrototype: ${data.prototype}`,
    `h3. Acceptance criteria\n${bullets(t.ac)}`,
    `_Plan ticket ${t.id} · ${t.week === 4 ? 'Deferred' : 'Week ' + t.week}_`,
  ].join('\n\n');
  rows.push([100 + i, t.type, `${t.id} ${t.summary}`, desc, t.priority, t.week === 4 ? 'deferred' : 'sprint-1', t.week === 4 ? '' : `week-${t.week}`, t.rw ? 'reading-week-target' : '', epicIds[t.epic], t.owner]);
});
write('planning/sprint1-jira-import.csv', '﻿' + rows.map(r => r.map(q).join(',')).join('\r\n'));

console.log(`Built backlog/index.html and planning/sprint1-jira-import.csv (${data.epics.length} epics, ${data.tasks.length} tickets)`);
