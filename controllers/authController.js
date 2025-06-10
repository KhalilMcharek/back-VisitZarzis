const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config();
const { createNotification } = require('../services/notificationService');



const register = async (req, res) => {
  const { name, email, password, role, registerNumber } = req.body;

  try {
    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Cet email est déjà utilisé." });
    }

    // Check for duplicate registerNumber for managers
    if (role === "manager") {
      if (!registerNumber) {
        return res.status(400).send({ error: "Le numéro d'enregistrement est requis pour les managers." });
      }
      const existingRegisterNumber = await User.findOne({ registerNumber });
      if (existingRegisterNumber) {
        return res.status(400).send({ error: "Ce numéro de registre est déjà utilisé." });
      }
    }

    if (!["client", "manager", "admin"].includes(role)) {
      return res.status(400).send({ error: "Rôle invalide." });
    }

    const newUserData = {
      name,
      email,
      password,
      role,
    };

    if (role === "manager") {
      newUserData.registerNumber = registerNumber;
    }

    const newUser = new User(newUserData);
    await newUser.save();

    // Notify admin if a manager registers
    if (role === "manager") {
      const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await createNotification(
          admin._id,
          `Un nouveau manager a demandé une inscription : ${name}`,
          "info"
        );
      }
    }

    res.status(201).send({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      if (duplicateField === "email") {
        return res.status(400).send({ error: "Cet email est déjà utilisé." });
      }
      if (duplicateField === "registerNumber") {
        return res.status(400).send({ error: "Ce numéro de registre est déjà utilisé." });
      }
    }
    res.status(500).send({ error: "Erreur serveur." });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "Utilisateur non trouvé." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: "Mot de passe incorrect." });
    }

    if (user.role === "manager" && user.isValidated === false) {
      return res.status(403).send({
        error: "Votre compte n'a pas encore été validé par un administrateur.",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      //{ expiresIn: "3h" }
    );

    res.status(200).send({
      message: "Connexion réussie.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err); // helpful for debugging
    res.status(500).send({ error: "Erreur serveur." });
  }
};



//forgot password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL, 
    pass: process.env.GMAIL_APP_PASSWORD, 
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    
    });
    //console.log(token)

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;

  
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Hi ${user.name},</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
    };

    
    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
};



// reset 
const resetPassword = async (req, res) => {
  const { userId, token, newPassword } = req.body;

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).send({ error: 'Invalid or expired token' });
    }

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

    res.status(200).send({ message: 'Password has been successfully reset' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Something went wrong' });
  }
};




module.exports = { register, login ,forgotPassword, resetPassword};