// here we are creating middleware to get the token and validate it

const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) return next();
    // this can also throw an error so write it in try catch
    // here for error we are just keeping blank
    // here if we get the userpayload then we are calling next()
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}

module.exports = checkForAuthenticationCookie;
