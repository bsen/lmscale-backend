const { User, Assistant, sequelize } = require("../index");
const jwt = require("jsonwebtoken");

class UserService {
  generateToken(userId) {
    console.log("[UserService] Generating lm_auth_token", {
      userId,
    });

    if (!process.env.JWT_SECRET) {
      console.error(
        "[UserService] JWT_SECRET missing in environment configuration"
      );
      throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET);
  }

  async register({ name = "", email, password }) {
    console.log("[UserService] Attempting to create user", { email });

    const transaction = await sequelize.transaction();

    try {
      const existingUser = await User.findOne({
        where: { email },
        transaction,
      });

      if (existingUser) {
        console.log(
          "[UserService] User creation failed - email already exists",
          { email }
        );
        await transaction.rollback();
        return { success: false, message: "Email already exists" };
      }

      const user = await User.create(
        {
          name,
          email: email.toLowerCase(),
          password,
        },
        { transaction }
      );

      console.log("[UserService] User created successfully", {
        userId: user.id,
        email: user.email,
      });

      const assistant = await Assistant.create(
        {
          name: "Playground",
          userId: user.id,
        },
        { transaction }
      );

      console.log("[UserService] Playground assistant created", {
        assistantId: assistant.id,
        userId: user.id,
      });

      await transaction.commit();

      const lm_auth_token = this.generateToken(user.id);
      return {
        success: true,
        data: { lm_auth_token, assistantId: assistant.id },
        message: "User created successfully",
      };
    } catch (error) {
      console.error("[UserService] Error creating user:", {
        email,
        error: error.message,
        stack: error.stack,
      });

      await transaction.rollback();

      return {
        success: false,
        message: "Failed to create user",
      };
    }
  }

  async login(email, password) {
    console.log("[UserService] Attempting to authenticate user", {
      email,
    });

    try {
      if (!email || !password) {
        console.log(
          "[UserService] Authentication failed - missing credentials",
          {
            email,
            hasPassword: !!password,
          }
        );
        return { success: false, message: "Email and password are required" };
      }

      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
          isActive: true,
        },
        attributes: ["id", "name", "email", "password"],
        raw: false,
      });

      if (!user) {
        console.log("[UserService] Authentication failed - user not found", {
          email,
        });
        return { success: false, message: "Invalid email" };
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        console.log("[UserService] Authentication failed - invalid password", {
          userId: user.id,
          email,
        });
        return { success: false, message: "Invalid password" };
      }

      console.log("[UserService] User authenticated successfully", {
        userId: user.id,
        email,
      });

      const assistant = await Assistant.findOne({
        where: {
          userId: user.id,
        },
        order: [["createdAt", "ASC"]],
        attributes: ["id"],
      });

      const lm_auth_token = this.generateToken(user.id);

      if (!lm_auth_token) {
        throw new Error("Failed to generate access token");
      }

      return {
        success: true,
        data: { lm_auth_token, assistantId: assistant.id },
        message: "Login successful",
      };
    } catch (error) {
      console.error("[UserService] Authentication error:", {
        email,
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: "An error occurred during authentication",
        error: error.message,
      };
    }
  }

  async getProfile(userId) {
    console.log("[UserService] Fetching user profile", {
      userId,
    });

    try {
      const user = await User.findOne({
        where: { id: userId },
        attributes: [
          "id",
          "name",
          "email",
          "isActive",
          "createdAt",
          "updatedAt",
        ],
      });

      if (!user) {
        console.log("[UserService] Profile not found", {
          userId,
        });
        return {
          success: false,
          message: "User profile not found",
        };
      }

      console.log("[UserService] Profile retrieved successfully", {
        userId,
      });

      return {
        success: true,
        data: { user },
        message: "Profile retrieved successfully",
      };
    } catch (error) {
      console.error("[UserService] Error fetching user profile:", {
        userId,
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: "Failed to retrieve user profile",
      };
    }
  }
}

module.exports = UserService;
