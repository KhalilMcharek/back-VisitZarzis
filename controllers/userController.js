const User = require('../models/User');

// Créer un nouvel utilisateur
exports.createUser = (req, res) => {
  let user = new User(req.body)
  if(req.files && req.files.image){
      user.image = req.files.image
  }

  user.save().then(() => {
      res.send({ message: 'User added successfully' })
  }).catch((err) => {
    console.log(err)
      res.status(410).send(err.errorResponse)
  })


}

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
    res.send({message: 'utilisateur modifié'})

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
    res.send({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// managers non validés
exports.getUnvalidatedManagers = async (req, res) => {
  try {
    const pendingManagers = await User.find({ role: "manager", isValidated: false });
    res.status(200).json(pendingManagers);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Validate a manager
exports.validateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(id, { isValidated: true }, { new: true });
    res.status(200).json({ message: "Manager validé.", manager: updated });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};
