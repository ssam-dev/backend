import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  brand: { type: String },
  model: { type: String },
  serial_number: { type: String, unique: true, sparse: true },
  purchase_date: { type: Date },
  purchase_price: { type: Number },
  warranty_end_date: { type: Date },
  location: { type: String },
  condition: { type: String, default: "good", index: true },
  status: { type: String, default: "operational", index: true },
  last_maintenance_date: { type: Date },
  next_maintenance_date: { type: Date },
  maintenance_notes: { type: String },
  image_path: { type: String },
  description: { type: String },
  quantity: { type: Number, default: 1 }
}, { timestamps: true });

// Create indexes for better query performance
EquipmentSchema.index({ name: 1 });
EquipmentSchema.index({ category: 1 });
EquipmentSchema.index({ status: 1 });
EquipmentSchema.index({ condition: 1 });
EquipmentSchema.index({ createdAt: -1 });

EquipmentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Equipment = mongoose.model("Equipment", EquipmentSchema);
export default Equipment;