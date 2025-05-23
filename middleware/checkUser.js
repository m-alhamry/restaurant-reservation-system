const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.render('./auth/access-denied.ejs', { user: null });
};

const isCustomer = (req, res, next) => {
    if (req.session.user.role === 'customer') {
        return next();
    }
    res.render('./auth/access-denied.ejs', { user: null });
};

const isStaff = (req, res, next) => {
    if (req.session.user.role === 'staff') {
        return next();
    }
    res.render('./auth/access-denied.ejs', { user: null });
};

module.exports = {
    isAuthenticated,
    isCustomer,
    isStaff
}