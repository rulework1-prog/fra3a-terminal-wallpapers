const fs = require('node:fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<link rel="stylesheet" href="style.css">', () => '<style>\n' + fs.readFileSync('style.css', 'utf8') + '\n</style>');
html = html.replace('<script src="app.js"></script>', () => '<script>\n' + fs.readFileSync('app.js', 'utf8') + '\n</script>');
fs.writeFileSync('wallpaper.html', html);
console.log('wallpaper.html created: self-contained, no dependencies.');
