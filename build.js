const fs = require('fs');
const filesize = require('filesize');
const CleanCSS = require('clean-css');
const JSZip = require('jszip');
const ClosureCompiler = require('google-closure-compiler').jsCompiler;

const SCRIPTS = fs.readdirSync('src')
  .filter(x => x.includes('.js'))
  .map(filename => `src/${filename}`);

const raw = path => fs.readFileSync(path, 'utf8');
const rawConcat = paths => paths.reduce((res, curr) => res + raw(curr), '');

const js = paths => new Promise(resolve => {
  const compiler = new ClosureCompiler({
    compilation_level: 'ADVANCED',
    language_in: 'ECMASCRIPT_2018',
    language_out: 'ECMASCRIPT_2018',
    jscomp_off: '*'
  });

  let src = rawConcat(paths);

  compiler.run([{ src }], (_, out, err) => {
    if (err) throw err;
    console.log('JS ✔️');
    resolve(out[0].src); });
});

const css = path => new Promise(resolve => {
  const compiler = new CleanCSS({ level: { 1: { all: true }, 2: { all: true }}});
  const src = fs.readFileSync(path, 'utf8');

  compiler.minify(src, (err, output) => {
    if (err) throw err;
    console.log('CSS ✔️');
    resolve(output.styles);
  });
});

const expandMarkup = template => ([ js, css ]) => {
  const src = fs.readFileSync(template, 'utf8');
  return src.replace('{{js}}', js).replace('{{css}}', css).replace('\n', '');
};

const zipTap = path => contents => new Promise(resolve => {
  const zip = new JSZip();
  zip.file('index.html', contents);

  zip.generateNodeStream({
    streamFiles: true,
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  })
    .pipe(fs.createWriteStream(path))
    .on('finish', resolve(contents));
});

const fileTap = path => contents => {
  fs.writeFileSync(path, contents);
  return contents;
};

const writeStats = (path, dev) => tap => {
  const stats = fs.statSync(path);
  console.log(`File: ${path}, size: ${filesize(stats.size)} ${dev ? '(not minified)' : ''}`);
  return tap;
};

const compile = () => {
  console.log('Production minification started...');
  Promise.all([ js(SCRIPTS), css('src/style.css') ])
    .then(expandMarkup('scaffold.template'))
    .then(zipTap('dist/min.zip'))
    .then(fileTap('dist/index.html'))
    .then(writeStats('dist/index.html'))
    .catch(err => { throw err });
}

const bundle = () => {
  console.log('\n\nDevelopment bundling started...');
  Promise.all([ rawConcat(SCRIPTS), raw('src/style.css') ])
    .then(expandMarkup('scaffold.template'))
    .then(fileTap('dist/index.html'))
    .then(writeStats('dist/index.html', true))
    .catch(err => { throw err });
}

process.argv[2] ? compile() : bundle();