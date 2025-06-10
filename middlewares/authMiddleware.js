const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Récupérer l'en-tête Authorization
  const authHeader = req.headers.authorization;

  // Vérifier si le token est présent
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send({ error: 'Accès refusé. Aucun token fourni.' });
  }

  // Extraire le token sans le préfixe "Bearer"
  const token = authHeader.split(' ')[1];

  try {
    // Vérifier et décoder le token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Ajouter les infos utilisateur à la requête
    next(); // Continuer avec la requête suivante
  } catch (err) {
    console.error('Erreur de vérification du token :', err.message);
    res.status(401).json({ error: 'Token invalide.' });
  }
};

module.exports = verifyToken;
