const express = require("express");

const {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  updateByIdDynam,
  deleteOneById,
  deleteOneByTitle,
} = require("./controller");

const router = express.Router();

router.post("/", createOne);

router.get("/", getAll);

router.get("/:id", getOneById);

router.put("/:id", updateOneById);

router.patch("/:id", updateByIdDynam);

router.delete("/:id", deleteOneById);

router.delete("/:title", deleteOneByTitle);

module.exports = router;
