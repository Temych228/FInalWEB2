import Pet from "../models/Pet.js";
import User from "../models/User.js";

export const createPet = async (req, res) => {
  try {
    const pet = await Pet.create({
      ...req.body,
      owner: req.user.id  
    });
    res.status(201).json(pet);
  } catch (err) {
    console.error("CREATE PET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getPets = async (req, res) => {
  const pets = await Pet.find().populate("owner", "username");
  res.json(pets);
};

export const getPetById = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ message: "Pet not found" });
  res.json(pet);
};

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    Object.assign(pet, req.body);
    await pet.save();

    res.json(pet);
  } catch (err) {
    console.error("UPDATE PET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    await pet.deleteOne();
    res.json({ message: "Pet deleted" });
  } catch (err) {
    console.error("DELETE PET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const adoptPet = async (req, res) => {
  try {
    const petId = req.params.id;

    const userId = req.user.id;

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (!pet.isAvailable) {
      return res
        .status(400)
        .json({ message: "This pet has already been adopted" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    pet.isAvailable = false;
    pet.owner = user._id;
    await pet.save();

    user.adoptedPets.push(pet._id);
    await user.save();

    res.status(200).json({
      message: "Pet adopted successfully",
      pet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
