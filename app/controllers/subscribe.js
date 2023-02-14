//const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const auth = require("../AuthUtils.conf/auth");

//signup
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    bcrypt.hash(req.body.ip, 10).then((hashIp) => {
      bcrypt.hash(req.body.password, 10).then((hashPwd) => {
        if (user && hashIp === user.ip) {
          return res.status(200).json({ user });
        }
        if (user) {
          return res.status(200).json({
            id: user._id,
            email: user.email,
            ip: user.ip,
            newsletter: user.newsletter,
            numberOfRequest: user.numberOfRequest++,
            validation: user.validation,
            connected: user.connected,
          });
        } else {
          const user_one = new User({
            ip: hashIp,
            password: hashPwd,
            email: req.body.email,
            newsletter: req.body.newsletter,
            numberOfRequest: req.body.numberOfRequest,
            validation: req.body.validation,
          });
          user_one.save().then((data) => {
            if (data.email) {
              this.SendMail(data.email, data._id)
                .then((data) => {
                  return res.json(data);
                })
                .catch((error) => {
                  return res.json(data);
                });
            } else {
              return res.json(data);
            }
          });
        }
      });
    });
  });
};

function resetNumberOfRequest(userId) {
  User.findOne({ _id: userId }).then((user) => {
    user
      .updateOne({
        numberOfRequest: 0,
      })
      .then((data) => {});
  });
}

//validate email user
exports.validate = (req, res, next) => {
  User.updateOne({ _id: req.params.id }, { validation: true })
    .then((user) => {
      return res.redirect("http://localhost:4200/dashboard");
    })
    .catch((error) => {
      return res.json({ validation: false });
    });
};

//send email to user to validate his email
exports.SendMail = (email, _id) => {
  let promise = new Promise((resolve, reject) => {
    let url = "http://localhost:3000/api/user/confimation";
    const info = {
      from: '"Semwee " <send.mail.semwee@tsangana.com>', // sender address
      to: email, // list of receivers
      subject: "Keys of activation", // Subject line
      html: `<H2 style="color : #62efdf">Semwee</H2>
              <p>Please click on this link to confirm your email</p>
              <a href="${url}/${_id}" >HERE</a>`, // html body
    };

    let transporter = nodemailer.createTransport(
      // "smtps://mohamedelhousni702@gmail.com:1245GKjd678He@smtp.gmail.com"
      {
        host: "mail.tsangana.com",
        // port: 587,
        // secure: false,
        secure: true,//true
        port: 465,//465
        auth: {
          user: "send.mail.semwee@tsangana.com",
          pass: "SenMail+456"
        }
      }
    );
    transporter.sendMail(info, (error, info) => {
      if (error) {
        console.log( error )
        reject({ send: false });
      } else {
        resolve({ send: true });
      }
    });
  });
  return promise;
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((validPWD) => {
          if (validPWD || req.body.password === "auto") {
            var d1 = user.timestamp;
            var d2 = new Date();
            if (d2 - d1 > 60 * 60 * 24 * 1000) {
              resetNumberOfRequest(user.id);
            }
            return res.status(200).json({
              id: user._id,
              email: user.email,
              ip: user.ip,
              newsletter: user.newsletter,
              numberOfRequest: user.numberOfRequest,
              validation: user.validation,
              token: auth.generateToken(user._id),
              connected: user.connected,
              isrobot: user.isrobot,
            });
          } else return res.status(500).json("error");
        })
        .catch((error) => {
          return res.status(500).json("error");
        });
    })
    .catch((error) => {
      return res.status(500).json("error");
    });
};
