/**
 * Validation middleware for API requests
 */

export const validateMember = (req, res, next) => {
  const { name, email, phone, membershipType } = req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (phone && !isValidPhone(phone)) {
    errors.push("Invalid phone number");
  }

  if (!membershipType || membershipType.trim() === "") {
    errors.push("Membership type is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateTrainer = (req, res, next) => {
  const { name, email, phone, specialization } = req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (phone && !isValidPhone(phone)) {
    errors.push("Invalid phone number");
  }

  if (!specialization || specialization.trim() === "") {
    errors.push("Specialization is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateEquipment = (req, res, next) => {
  const { name, category, quantity } = req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Equipment name is required");
  }

  if (!category || category.trim() === "") {
    errors.push("Category is required");
  }

  if (!quantity || isNaN(quantity) || quantity < 1) {
    errors.push("Valid quantity is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Helper functions
 */

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  const regex = /^[\d\s()+\-]+$/;
  return regex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

export default {
  validateMember,
  validateTrainer,
  validateEquipment
};
