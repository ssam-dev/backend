import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  date_of_birth: { type: String },
  membership_type: { type: String, required: true, enum: ["basic", "premium", "vip", "student"], index: true },
  membership_start_date: { type: String },
  membership_end_date: { type: String },
  status: { type: String, default: "active", enum: ["active", "expired", "suspended", "cancelled"], index: true },
  emergency_contact_name: { type: String },
  emergency_contact_phone: { type: String },
  medical_conditions: { type: String },
  profile_photo: { type: String }
}, {
  timestamps: true
});

// Create indexes for better query performance
memberSchema.index({ email: 1 });
memberSchema.index({ membership_type: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ createdAt: -1 });

const Member = mongoose.model("Member", memberSchema);
export default Member;
