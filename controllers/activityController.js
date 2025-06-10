const Activity = require('../models/Activity');


exports.createActivity = async (req, res) => {
  try {
    //console.log( req.body);
    //console.log( req.files);
    const { title, description, location, price } = req.body;
    const manager = req.user.id;

    const mainImage = req.files?.["mainImage"]?.[0]?.path || null;

    const gallery = req.files?.["gallery"]?.map((file) => file.path) || [];
   
    const newActivity = new Activity({
      title,
      description,
      location,
      price,
      manager,
      mainImage,
      gallery,
    });

    await newActivity.save();

    res.status(201).json({ message: "Activité créée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de l'activité" });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('manager', 'name email');
    if (!activity) {
      return res.status(404).send({ message: 'Activité non trouvée' });
    }
    res.send(activity);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};




exports.updateActivity = async (req, res) => {
  try {
    const { title, description, location, price } = req.body;

    const updateData = {
      title,
      description,
      location,
      price,
    };

    // ✅ Handle image uploads if they exist
    if (req.files?.mainImage) {
      updateData.mainImage = req.files.mainImage[0].path;
    }

    if (req.files?.gallery) {
      updateData.gallery = req.files.gallery.map(file => file.path);
    }

    const activity = await Activity.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!activity) {
      return res.status(404).json({ message: "Activité non trouvée" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Erreur update :", error);
    res.status(400).json({ error: error.message });
  }
};



exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).send({ message: "Activité non trouvée" });
    }

    res.send({ message: "Activité supprimée avec succès" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


exports.getFilteredActivities = async (req, res) => {
  const { query,  minPrice, maxPrice, location, page = 1, limit = 10 } = req.query;
  
  const filter = {};
  //console.log("Applied filters:", filter);


  //if (category) filter.category = category;
  if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) }; 
  if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) }; 
  if (location) filter.location = { $regex: location, $options: 'i' }; 
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } }, 
      { description: { $regex: query, $options: 'i' } }, 
    ];
  }
  //console.log("Applied filters:", filter); ///////////////////

  try {
   
    const skip = (page - 1) * limit;


    const activities = await Activity.find(filter)
      .populate("manager", "name email")
      .skip(skip) 
      .limit(Number(limit)); 

      //console.log("Returned activities:", activities.length);

    const totalCount = await Activity.countDocuments(filter);

    
    res.status(200).send({
      activities, 
      totalPages: Math.ceil(totalCount / limit), 
      currentPage: Number(page), 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch activities' });
  } 
};
// 🔐 Dashboard admin/manager (filtrée selon le rôle)
exports.getAllActivitiesDashboard = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "manager") {
      filter.manager = req.user.id; //  ne voir que ses propres activités
    }

    const activities = await Activity.find(filter).populate("manager", "name email");
    res.send(activities);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

