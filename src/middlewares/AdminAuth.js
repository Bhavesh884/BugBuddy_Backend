const adminAuth = (req, res, next) => {
    const a = 1;
    console.log("auth checked")
    if (a === 1) {
        next();
    }
    else {
        res.status(401).send("error");
    }
}
module.exports = { adminAuth }