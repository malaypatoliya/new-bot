const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storageFunc = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = path.join(__dirname, "..", "public", "uploads");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const filterFunc = (req, file, cb) => {
    if (!file.originalname.match(/\.(xls|XLS|xlsx|XLSX|jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF|doc|DOC|DOCX|docx)$/)) {
        return cb(new Error("FILE_VALIDATION_ERROR"), false);
    }
    cb(null, true);
};

module.exports = {
    storageFunc,
    filterFunc
}