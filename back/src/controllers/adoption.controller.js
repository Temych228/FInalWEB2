import User from "../models/User.js";
import Pet from "../models/Pet.js";

export const sendAdoptionRequest = async (req, res) => {
  const pet = await Pet.findById(req.params.petId);
  if (!pet || !pet.isAvailable) {
    return res.status(400).json({ message: "Pet not available" });
  }

  const user = await User.findById(req.user.id);

  const alreadySent = user.adoptionRequests.some(
    r => r.pet.toString() === pet._id.toString()
  );
  if (alreadySent) {
    return res.status(400).json({ message: "Request already sent" });
  }

  user.adoptionRequests.push({ pet: pet._id });
  await user.save();

  res.status(201).json({ message: "Adoption request sent" });
};

export const getMyAdoptionRequests = async (req, res) => {
  const user = await User.findById(req.user.id).populate(
    "adoptionRequests.pet",
    "name type location"
  );
  res.json(user.adoptionRequests);
};

export const updateAdoptionStatus = async (req, res) => {
  const { status } = req.body; 
  const { userId, requestId } = req.params;

  const user = await User.findById(userId);
  const request = user.adoptionRequests.id(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  const pet = await Pet.findById(request.pet);

  if (
    pet.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "No access" });
  }

  request.status = status;

  if (status === "approved") {
    pet.isAvailable = false;
    await pet.save();
  }

  await user.save();
  res.json({ message: "Status updated" });
};
