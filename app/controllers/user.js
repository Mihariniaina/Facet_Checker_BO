const User = require("../models/User");
const subscribe = require("../controllers/subscribe"); // subscribe
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');

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
  User.findById({ _id: mongoose.Types.ObjectId(req.body.id) }).then((user) => {
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
exports.sendRequest = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
  if (err) {
  console.error(err);
  return res.status(500).send('Internal Server Error');
  }
  if (!user) {
  return res.status(404).send('Email not found');
  }
  // Génération du code de confirmation
  const code = Math.floor(100000 + Math.random() * 900000);
  // Stockage du code de confirmation et de son expiration dans la base de données
  user.resetToken = code.toString();
  user.resetTokenExpiration = Date.now() + 60 * 1000; // 1 minute
  user.save((err, user) => {
  if (err) {
  console.error(err);
  return res.status(500).send('Internal Server Error');
  }
  // Envoi du code de confirmation par email
  res.send('Confirmation code sent to ${email}');
  });
  });
  }
  exports.verifyCode = (req, res) => {
    const { email, code } = req.body;
    User.findOne({ email }, (err, user) => {
    if (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
    }
    if (!user || user.resetToken !== code || user.resetTokenExpiration < Date.now()) {
    return res.status(404).send('Invalid Token');
    }
    // Code de confirmation valide
    res.send('Token verified');
    });
    }
    exports.resetPassword = (req, res) => {
      const { email, code, password } = req.body;
      User.findOneAndUpdate({ email, resetToken: code, resetTokenExpiration: { $gt: Date.now() } }, { password }, { new: true }, (err, user) => {
      if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
      }
      if (!user) {
      return res.status(404).send('Invalid Token');
      }
      // Mot de passe réinitialisé avec succès
      res.send('Password reset successfully');
      });
      };

      exports.forgotPassword = (req, res) => {
        const { email } = req.body;
      
        User.findOne({ email }, (err, user) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
          }
      
          if (!user) {
            return res.status(400).send('User not found');
          }
      
          const confirmationCode = Math.floor(Math.random() * 900000) + 100000;
          let transporter = nodemailer.createTransport(
            // "smtps://mohamedelhousni702@gmail.com:1245gkjd678he"
            {
              host: "mail.semwee.com",

              // port: 587,
              // secure: false,
              secure: true,//true
              port: 465,//465
              auth: {
                user: "no-reply@semwee.com",
                pass: "56854qsDFgmmMpf5245"
              }
            }
          );
          
          // Define the email options
          const mailOptions = {
            from: '"Semwee " <no-reply@semwee.com>',
            to: email,
            subject: 'Confirmation code for resetting your password',
            text: `Your confirmation code is: ${confirmationCode}`
          };
          try {
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.error(err);
              } else {
                console.log(`Email sent: ${info.response}`);
              }
            });
            user.confirmationCode = confirmationCode;
            user.save();
        
            
          } catch (error) {
            console.log(error);
            
          }
          // Send the email
         
      
        
          res.status(200).send();
        });
      };
      
      exports.checkConfirmationCode = (req, res) => {
        const { confirmationCode } = req.body;
      
        User.findOne({ confirmationCode }, (err, user) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
          }
      
          if (!user) {
            return res.status(400).send('Invalid confirmation code');
          }
      
          res.status(200).send();
        });
      };
      
      exports.resetPassword =  (req, res) => {
        const { newPassword, confirmationCode } = req.body;
        console.log(req.body);
      
        // TODO: verify that the user is authenticated and authorized to reset the password
      
        User.findOne({ confirmationCode }, (err, user) => {
          console.log(user)    

          if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
          }
      
          if (!user) {
            return res.status(400).send('Invalid confirmation code');
          }
          bcrypt.hash(newPassword, 10).then((hashPwd) => 
          {
            
           console.log(hashPwd)
            user.password = hashPwd;
            user.confirmationCode = null;
            user.save();

            res.json(user);

          
          })

      
          
      
         
      
        });
      };