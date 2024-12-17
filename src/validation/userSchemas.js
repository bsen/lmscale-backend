const { z } = require("zod");

const userSchemas = {
  register: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 30 characters")
      .transform((val) => val.trim()),
    email: z
      .string()
      .email("Invalid email format")
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),

  login: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .transform((val) => val.toLowerCase()),
    password: z.string().min(1, "Password is required"),
  }),
};

module.exports = userSchemas;
