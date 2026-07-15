// One-shot build script: embeds both letterhead PNGs and inlines pdf-lib
// into "Letterhead Tool.html" so the tool is a single standalone file.
const fs = require('fs');
const dir = __dirname;

let html = fs.readFileSync(dir + '/Letterhead Tool.html', 'utf8');
const nusrat = fs.readFileSync(dir + '/Ca Nusrat.png').toString('base64');
const rutuja = fs.readFileSync(dir + '/Ca Rutuja.png').toString('base64');

const scripts = ['pdf-lib.min.js', 'pdfjs.min.js', 'pdfjs.worker.min.js'];
const missing = ['__NUSRAT_BASE64__', '__RUTUJA_BASE64__']
  .filter(p => !html.includes(p))
  .concat(scripts.filter(s => !html.includes('<script src="' + s + '"></script>')));
if (missing.length) {
  console.error('placeholder missing (' + missing.join(', ') + ') — HTML already bundled?');
  process.exit(1);
}

// replacement callbacks: a plain string replacement would mangle "$&"/"$`" sequences inside the JS libs
html = html
  .replace('__NUSRAT_BASE64__', () => nusrat)
  .replace('__RUTUJA_BASE64__', () => rutuja);
for (const s of scripts) {
  const src = fs.readFileSync(dir + '/' + s, 'utf8');
  html = html.replace('<script src="' + s + '"></script>', () => '<script>\n' + src + '\n</script>');
}

fs.writeFileSync(dir + '/Letterhead Tool.html', html);
console.log('bundled, size:', fs.statSync(dir + '/Letterhead Tool.html').size);
