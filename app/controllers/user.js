const User = require("../models/User");
const subscribe = require("../controllers/subscribe"); // subscribe
const bcrypt = require("bcrypt");
const mongoose = require("mongoose"); 

exports.getUser = (req, res) => {
  User.findById({ _id: req.query.id }).then((user) => {
    if (user) {
      return res.status(200).json({
        numberOfRequest: user.numberOfRequest,
        isrobot: user.isrobot,
      });
    }
  });
};

exports.updateUser = (req, res) => {
  let startDate = new Date();
  User.findById({ _id: req.body.id }).then((user) => {
    if (user) {
      let endDate = new Date();
      let frequency = (
        (endDate.getTime() - startDate.getTime()) /
        1000
      ).toFixed(1);
      console.log(frequency);
      if (user.frequency == frequency) {
        console.log(1);
        if (user.same_frequency >= 2) {
          console.log(2);
          user
            .updateOne({
              numberOfRequest: req.body.numberOfRequest,
              email: req.body.email,
              newsletter: req.body.newsletter,
              connected: req.body.connected,
              same_frequency: user.same_frequency++,
              isrobot: true,
            })
            .then((data) => {
              res.json(data);
              res.end();
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json({
                error: "Email already exists!",
              });
            });
        } else {
          console.log(3);
          user
            .updateOne({
              numberOfRequest: req.body.numberOfRequest,
              email: req.body.email,
              newsletter: req.body.newsletter,
              connected: req.body.connected,
              same_frequency: user.same_frequency + 1,
            })
            .then((data) => {
              res.json(data);
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json({
                error: "Email already exists!",
              });
            });
        }
      } else {
        console.log(4);
        user
          .updateOne({
            numberOfRequest: req.body.numberOfRequest,
            email: req.body.email,
            newsletter: req.body.newsletter,
            connected: req.body.connected,
            frequency: frequency,
            same_frequency: 0,
          })
          .then((data) => {
            res.json(data);
            res.end();
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({
              error: "Email already exists!",
            });
          });
      }
    }
  });
};

exports.SendEmail = (req, res) => {
  console.log(  "Id ==>" , req.body.id )
  User.findById({ _id: mongoose.Types.ObjectId(req.body.id) }).then((user) => { 
    console.log( "User ==>" , user )
    console.log( user )
    bcrypt.hash(req.body.password, 10).then((hashPwd) => {
      if (user) {
        user
          .updateOne({
            numberOfRequest: req.body.numberOfRequest,
            email: req.body.email,
            newsletter: req.body.newsletter,
            connected: req.body.connected,
            password: hashPwd,
          })
          .then((data) => {
            subscribe
              .SendMail(req.body.email, req.body.id)
              .then((data) => {
                console.log("User updated successfully!");
                return res.json(data);
              })
              .catch((error) => {
                return res.json({ msg: "User not updated successfully!" });
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({
              error: "Email already exists!",
            });
          });
      }
    });
  });
};
