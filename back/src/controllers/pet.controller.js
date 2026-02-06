import Pet from "../models/Pet.js";

export const createPet = async (req, res) => {
  const pet = await Pet.create({
    ...req.body,
    owner: req.user.id
  });
  res.status(201).json(pet);
};

export const getPets = async (req, res) => {
  const pets = await Pet.find({ isAvailable: true }).populate("owner", "username");
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
