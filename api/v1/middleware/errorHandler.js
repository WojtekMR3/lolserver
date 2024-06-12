const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    console.log("middleware error")
    console.log(err.code)
    console.log(err.message)
    // console.log(err.statusCode)
    // console.log(err.msg)

    if (err.code == "ENOTFOUND") {
        err.statusCode = 404
        err.msg = "Invalid params"
      } else if (err.code == "ERR_BAD_REQUEST" && typeof err.response !== 'undefined') {
        err.statusCode = err.response.status
        err.msg = err.response.data.status.message;
        if (err.statusCode == 403) err.msg = "Forbidden. API Key expired?"
      } else {
        err.statusCode = 404
        err.msg = "Unknown error"
      }

      if (err.code == "ERR_BAD_REQUEST" && err.message == "Request failed with status code 429") {
        err.statusCode = 429
        err.msg = "User is being rate limited by riot API"
      }

    res.status(500).send({message: err.msg, statusCode: err.statusCode})
}

module.exports = errorHandler;