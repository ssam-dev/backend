import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  specialization: { type: String, index: true },
  specializations: [{ type: String }],
  certifications: { type: String },
  status: { type: String, default: "active", index: true },
  availability: { type: String, default: "Full Day" },
  hire_date: { type: Date },
  hourly_rate: { type: Number },
  bio: { type: String },
  profile_photo: { type: String },
  certificate_files: [{ type: String }]
}, { timestamps: true });

// Create indexes for better query performance
TrainerSchema.index({ email: 1 });
TrainerSchema.index({ specialization: 1 });
TrainerSchema.index({ status: 1 });
TrainerSchema.index({ createdAt: -1 });

// Normalize JSON output to include id and drop _id/__v
TrainerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Trainer = mongoose.model("Trainer", TrainerSchema);
export default Trainer;