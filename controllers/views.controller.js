const path = require('path');

//models
const { Post } = require('../models/post.model');
const { catchAsync } = require('../utils/catchAsync.util');

const renderIndex = catchAsync(async (req, res, nex) => {
  const posts = await Post.findAll();

  res.status(200).render('index', {
    title: 'Rendered with pug',
    posts,
  });

  //Serve static HTML
  /* const indexPath = path.join(__dirname, '..', 'public', 'index.pug');

  res.status(200).sendFile(indexPath); */
});

module.exports = { renderIndex };
