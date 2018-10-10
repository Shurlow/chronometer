const gradientModel = require('../main/models/gradient')

console.log('Creating Gradient...');
const img_dir = "./images"

gradientModel.createGradient(['#abb8c3', '#eb144c'], img_dir)
  .then((gID) => console.log('DONE', gID))