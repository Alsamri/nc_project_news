const express = require("express");
const routercomment = express.Router();
const { deleteByid, patchCommentVotes } = require("../controller");

routercomment.delete("/:comment_id", deleteByid);
routercomment.patch("/:comment_id", patchCommentVotes);

module.exports = routercomment;
