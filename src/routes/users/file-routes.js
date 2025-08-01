const router = require("express").Router();

const controller = require("../../controllers/users/file-controller");
const upload = require("../../middlewares/multer-middleware");

router.get("/", controller.getFiles.bind(controller));

router.post(
  "/",
  upload.fields([{ name: "files" }]),
  controller.createFile.bind(controller)
);

router.delete("/:file_id", controller.deleteFile.bind(controller));

module.exports = router;
