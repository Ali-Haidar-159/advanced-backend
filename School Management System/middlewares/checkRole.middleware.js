function requireRole(role) {
    return function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.redirect("/");
        }
        if (req.user.role !== role) {
            return res.status(403).render("access-denied");
        }
        return next();
    };
}


module.exports = requireRole