import mongoose from "mongoose";
import dotenv from "dotenv";
import Trainer from "./models/Trainer.js";
import Member from "./models/Member.js";
import Equipment from "./models/Equipment.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");

    // Clear existing data
    await Trainer.deleteMany({});
    await Member.deleteMany({});
    await Equipment.deleteMany({});
    console.log("Cleared existing data");

    // Seed trainers
    const trainers = [
      {
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@gym.com",
        phone: "555-0101",
        specialization: "Strength Training",
        specializations: ["Strength Training", "CrossFit"],
        certifications: "NASM, ACE",
        status: "active",
        availability: "Full Day",
        hire_date: new Date("2022-01-15"),
        hourly_rate: 75,
        bio: "Certified strength coach with 10+ years experience",
        profile_photo: "john-smith.jpg"
      },
      {
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@gym.com",
        phone: "555-0102",
        specialization: "Yoga & Flexibility",
        specializations: ["Yoga", "Flexibility Training", "Pilates"],
        certifications: "RYT-200, Pilates Instructor",
        status: "active",
        availability: "Afternoons",
        hire_date: new Date("2021-06-20"),
        hourly_rate: 65,
        bio: "Yoga instructor specializing in flexibility and mindfulness",
        profile_photo: "sarah-johnson.jpg"
      },
      {
        first_name: "Mike",
        last_name: "Davis",
        email: "mike.davis@gym.com",
        phone: "555-0103",
        specialization: "Cardio & HIIT",
        specializations: ["Cardio", "HIIT", "Boxing"],
        certifications: "ISSA, CPR/AED",
        status: "active",
        availability: "Full Day",
        hire_date: new Date("2022-03-10"),
        hourly_rate: 70,
        bio: "Expert in high-intensity interval training and cardio conditioning",
        profile_photo: "mike-davis.jpg"
      },
      {
        first_name: "Emily",
        last_name: "Rodriguez",
        email: "emily.rodriguez@gym.com",
        phone: "555-0104",
        specialization: "Weight Loss",
        specializations: ["Weight Loss", "Nutrition", "Personal Training"],
        certifications: "NASM-PES, Health Coach",
        status: "active",
        availability: "Mornings",
        hire_date: new Date("2021-09-05"),
        hourly_rate: 80,
        bio: "Holistic approach to fitness combining training and nutrition",
        profile_photo: "emily-rodriguez.jpg"
      },
      {
        first_name: "David",
        last_name: "Chen",
        email: "david.chen@gym.com",
        phone: "555-0105",
        specialization: "Rehabilitation",
        specializations: ["Physical Therapy", "Injury Prevention", "Rehabilitation"],
        certifications: "PT, CSCS",
        status: "inactive",
        availability: "Full Day",
        hire_date: new Date("2020-11-12"),
        hourly_rate: 90,
        bio: "Specialized in injury recovery and prevention strategies",
        profile_photo: "david-chen.jpg"
      },
      {
        first_name: "Jessica",
        last_name: "Williams",
        email: "jessica.williams@gym.com",
        phone: "555-0106",
        specialization: "Women's Fitness",
        specializations: ["Women's Fitness", "Pre/Post Natal", "General Training"],
        certifications: "ACE, Pre/Post Natal Specialist",
        status: "active",
        availability: "Evenings",
        hire_date: new Date("2022-02-28"),
        hourly_rate: 72,
        bio: "Focused on empowering women through fitness and wellness",
        profile_photo: "jessica-williams.jpg"
      }
    ];

    const createdTrainers = await Trainer.insertMany(trainers);
    console.log(`✅ Created ${createdTrainers.length} trainers`);

    // Seed members
    const members = [
      {
        first_name: "Alice",
        last_name: "Brown",
        email: "alice.brown@email.com",
        phone: "555-1001",
        membership_type: "premium",
        status: "active",
        membership_start_date: "2023-01-10",
        membership_end_date: "2025-01-10",
        emergency_contact_phone: "555-2001",
        medical_conditions: "None"
      },
      {
        first_name: "Bob",
        last_name: "Wilson",
        email: "bob.wilson@email.com",
        phone: "555-1002",
        membership_type: "basic",
        status: "active",
        membership_start_date: "2023-06-15",
        membership_end_date: "2025-06-15",
        emergency_contact_phone: "555-2002",
        medical_conditions: "None"
      },
      {
        first_name: "Carol",
        last_name: "Martinez",
        email: "carol.martinez@email.com",
        phone: "555-1003",
        membership_type: "premium",
        status: "expired",
        membership_start_date: "2022-03-20",
        membership_end_date: "2024-03-20",
        emergency_contact_phone: "555-2003",
        medical_conditions: "None"
      }
    ];

    const createdMembers = await Member.insertMany(members);
    console.log(`✅ Created ${createdMembers.length} members`);

    // Seed equipment
    const equipment = [
      {
        name: "Barbell Set",
        category: "Free Weights",
        brand: "Rogue",
        quantity: 5,
        purchase_date: new Date("2022-01-20"),
        condition: "good",
        status: "operational",
        last_maintenance_date: new Date("2024-12-15"),
        location: "Free Weights Area",
        description: "Olympic bars with plates"
      },
      {
        name: "Treadmill",
        category: "Cardio",
        brand: "Life Fitness",
        quantity: 8,
        purchase_date: new Date("2021-06-10"),
        condition: "excellent",
        status: "operational",
        last_maintenance_date: new Date("2025-01-10"),
        location: "Cardio Zone",
        description: "Commercial grade machines"
      },
      {
        name: "Yoga Mats",
        category: "Accessories",
        brand: "Liforme",
        quantity: 30,
        purchase_date: new Date("2023-02-14"),
        condition: "good",
        status: "operational",
        location: "Yoga Studio",
        description: "Premium non-slip mats"
      },
      {
        name: "Dumbbells",
        category: "Free Weights",
        brand: "Powerblock",
        quantity: 50,
        purchase_date: new Date("2022-05-22"),
        condition: "excellent",
        status: "operational",
        last_maintenance_date: new Date("2024-11-20"),
        location: "Free Weights Area",
        description: "Adjustable dumbbells 5-50 lbs"
      },
      {
        name: "Leg Press Machine",
        category: "Machines",
        brand: "Hammer Strength",
        quantity: 2,
        purchase_date: new Date("2021-09-30"),
        condition: "good",
        status: "operational",
        last_maintenance_date: new Date("2024-12-01"),
        location: "Machine Zone",
        description: "Commercial Hammer Strength equipment"
      }
    ];

    const createdEquipment = await Equipment.insertMany(equipment);
    console.log(`✅ Created ${createdEquipment.length} equipment items`);

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();
