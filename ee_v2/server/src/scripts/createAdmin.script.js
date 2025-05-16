#!/usr/bin/env node

import dotenv from "dotenv";
import { connectDB } from "../config/index.js";
import { User } from "../models/index.js";
import readline from "readline";
import { promises as fs } from "fs";
import path from "path";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Create interface for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Creates an admin user if one doesn't already exist
 */
const createAdminUser = async () => {
  try {
    console.log("🔍 Checking for existing admin user...");
    
    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected!");
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      console.log("👑 Admin user already exists with email:", existingAdmin.email);
      return;
    }
    
    console.log("🆕 No admin user found. Creating new admin user...");
    
    // Get admin details from user input
    console.log("\n👤 Please enter admin details:");
    const firstName = await question("  👉 First name: ");
    const lastName = await question("  👉 Last name: ");
    const email = await question("  📧 Email: ");
    const phone = await question("  📱 Phone number: ");
    const password = await question("  🔑 Password: ");
    
    // Validate inputs
    if (!firstName || !lastName || !email || !phone || !password) {
      console.error("❌ Error: All fields are required");
      return;
    }
    
    if (password.length < 8) {
      console.error("❌ Error: Password must be at least 8 characters");
      return;
    }
    
    console.log("\n⏳ Creating admin user...");
    
    // Create admin user
    const adminUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: "admin"
    });
    
    if (!adminUser) {
      console.error("❌ Failed to create admin user");
      return;
    }
    
    console.log("\n✨ Admin user created successfully:");
    console.log(`👤 Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🛡️  Role: ${adminUser.role}`);
    
    // Create a log entry
    const logDir = path.join(process.cwd(), "src", "logs");
    try {
      await fs.mkdir(logDir, { recursive: true });
      await fs.appendFile(
        path.join(logDir, "admin-creation.log"),
        `[${new Date().toISOString()}] Admin user created: ${adminUser.email}\n`
      );
      console.log("📝 Log entry created");
    } catch (err) {
      console.warn("⚠️ Could not write to log file:", err.message);
    }
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    // Close readline interface
    rl.close();
    // Disconnect from database
    try {
      await mongoose.disconnect();
      console.log("🔌 Database connection closed");
    } catch (err) {
      console.error("❌ Error disconnecting from database:", err.message);
    }
    console.log("👋 Goodbye!");
    process.exit(0);
  }
};

// Execute the function
console.log("\n====================================================");
console.log("🛡️  ADMIN USER CREATION TOOL 🛡️");
console.log("====================================================\n");

createAdminUser();