const userSchema = require("../../../Models/userSchema");
const chatSchema = require("../../../Models/chatSchema");
const formidable = require("formidable");
const fs = require("fs").promises;
const path = require("path");
// import name from ''

exports.getAllOwners = async (req, res) => {
  console.log("ccc", req.query.id);
  console.log(typeof req.query.id);
  try {
    const contacts = await userSchema
      .find({
        _id: { $ne: req.query.id },
      })
      .select(["Email", "Name", "Status", "ProfileImage"]);
    return res.status(200).json(contacts);
  } catch (error) {
    console.log("ALL owners error", error);
    res.status(500).json("Internal Server Error");
  }
};

exports.addMessageController = async (req, res) => {
  try {
    const { from, to, message } = req.body.data;

    const data = await chatSchema.create({
      message: {
        text: message,
        image: "",
      },
      users: [from, to],
      sender: from,
    });

    if (data) {
      res.status(201).json(data);
      console.log("done it");
    } else {
      res.status(400).json({ msg: "Failed to add Message to the database" });
      console.log("not done it");
    }
  } catch (error) {
    console.log("error in adding msgs", error);
    res.status(500).json("Internal Server Error");
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { from, to } = req.body.data;
    const messages = await chatSchema
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("error finding msgs", error);
    return res.status(500).json("error while finding messages");
  }
};

exports.sendImages = async (req, res) => {
  console.log("done");
  console.log(req.body);
  try {
    const { from, to, image } = req.body.data;

    const data = await chatSchema.create({
      message: {
        text: "",
        image: image,
      },
      users: [from, to],
      sender: from,
    });

    if (data) {
      res.status(201).json(data);
      console.log("Image done");
    } else {
      res
        .status(400)
        .json({ msg: "Failed to add Image Message to the database" });
      console.log("not done it");
    }
  } catch (error) {
    console.log("error in adding image msgs", error);
    res.status(500).json("Internal Server Error");
  }
};
