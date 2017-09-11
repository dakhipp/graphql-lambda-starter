/**
 * Fails if userScope is not less than or equal to requiredScope
 * @param {String} requiredScope
 * @param {String} userScope
 * @return {Boolean} scopeIsValid
 */
function scopeIsValid(requiredScope, userScope) {
  const scopeValues = {
    ADMIN: 0,
    USER: 1,
  };

  if (scopeValues[userScope] <= scopeValues[requiredScope]) {
    return true;
  }
  return false;
}

/**
 * Fails if resourceOwnerId is not equal to userId
 * @param {Number} resourceOwnerId
 * @param {Number} userId
 * @return {Boolean} scopeIsValid
 */
function isOwner(resourceOwnerId, userId) {
  // cast to int to avoid inconsistant type issues
  const intOwnerId = parseInt(resourceOwnerId, 0);
  const intUserId = parseInt(userId, 0);

  if (intOwnerId === intUserId) {
    return true;
  }
  return false;
}

/**
 * Checks to make sure both arguments are not undefined
 * @param {Object} args
 * @param {Object} tokenUser
 * @return {Boolean} requiredProvided
 */
function requiredProvided(args, tokenUser) {
  if (args && tokenUser) {
    return true;
  }
  return false;
}

module.exports = {
  scopeIsValid,
  isOwner,
  requiredProvided
};
