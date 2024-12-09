const config = require('../config');
const { throwForbiddenError } = require('../utils/helpers/genrateTokenAndSetCookie');

const isAdmin = (req) => {
  const { username } = req.user || {};
  if (username !== config.ADMIN_USER) {
    throwForbiddenError(); // 권한 없는 요청 차단
  }
};

module.exports = isAdmin;
