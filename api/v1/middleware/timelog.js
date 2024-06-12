const timelog = (req, res, next) => {
    console.log('Time: ', Date.now(), req.method, req.originalUrl)
    //console.log(`${req.method} ${req.originalUrl}`);
    next()
  }

  module.exports = timelog;