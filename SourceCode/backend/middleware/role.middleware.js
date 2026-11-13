/**
 * Role guard middleware factory.
 * Usage: roleGuard('admin') or roleGuard('admin', 'responder')
 * Returns 403 if the authenticated user's role is not in the allowed list.
 */
const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { roleGuard };
