module.exports = {
  context: `${__dirname}/app`,

  entry: './js/app.js',

  output: {
    filename: 'bundle.js',
    path: `${__dirname}/app`,
  }
};
