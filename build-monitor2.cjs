const fs = require('node:fs');
const path = require('node:path');
const folder = path.join(__dirname, 'monitor2');
let html = fs.readFileSync(path.join(folder, 'index.html'), 'utf8');
html = html.replace('<link rel="stylesheet" href="style.css">', () => '<style>\n' + fs.readFileSync(path.join(folder, 'style.css'), 'utf8') + '\n</style>');
html = html.replace('<script src="app.js"></script>', () => '<script>\n' + fs.readFileSync(path.join(folder, 'app.js'), 'utf8') + '\n</script>');
fs.writeFileSync(path.join(folder, 'wallpaper-monitor2.html'), html);
console.log('monitor2/wallpaper-monitor2.html created. Repackage the Lively ZIP after changes.');
