import Pet from "../models/Pet.js";
import User from "../models/User.js";

export const createPet = async (req, res) => {
  const pet = await Pet.create({
    ...req.body
  });
  res.status(201).json(pet);
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
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ message: "Pet not found" });

  if (pet.owner.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "No access" });
  }

  Object.assign(pet, req.body);
  await pet.save();

  res.json(pet);
};

export const deletePet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ message: "Pet not found" });

  if (pet.owner.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "No access" });
  }

  await pet.deleteOne();
  res.json({ message: "Pet deleted" });
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
