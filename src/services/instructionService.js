const { Instruction, Assistant, sequelize } = require("../models");

class InstructionService {
  async create(instructionData, userId) {
    const { assistantId, name, content } = instructionData;

    console.log("[InstructionService] Attempting to create instruction", {
      userId,
      assistantId,
      name,
    });

    try {
      if (
        !name ||
        typeof name !== "string" ||
        !content ||
        typeof content !== "string"
      ) {
        return {
          success: false,
          message: "Name and content are required and must be strings",
        };
      }

      const assistant = await Assistant.findOne({
        where: { id: assistantId, userId },
      });

      if (!assistant) {
        console.log("[InstructionService] No assistant found or unauthorized", {
          assistantId,
          userId,
        });
        return {
          success: false,
          message: "Assistant not found or unauthorized access",
        };
      }

      const existingInstruction = await Instruction.findOne({
        where: {
          assistantId,
          name,
        },
      });

      if (existingInstruction) {
        console.log(
          "[InstructionService] Instruction name already exists for assistant",
          {
            assistantId,
            name,
          }
        );
        return {
          success: false,
          message: "This name is already used for another instruction",
        };
      }

      const newInstruction = await Instruction.create({
        name,
        content,
        assistantId,
      });

      console.log("[InstructionService] Instruction created successfully", {
        instructionId: newInstruction.id,
        userId,
      });

      return {
        success: true,
        data: {
          instruction: newInstruction,
        },
      };
    } catch (error) {
      console.error("[InstructionService] Error creating instruction:", {
        userId,
        error: error.message,
        stack: error.stack,
      });

      return {
        success: false,
        message: "Failed to create instruction",
      };
    }
  }

  async list(assistantId, userId) {
    console.log("[InstructionService] Attempting to list instructions", {
      assistantId,
      userId,
    });

    try {
      const assistant = await Assistant.findOne({
        where: { id: assistantId, userId },
      });

      if (!assistant) {
        console.log(
          "[InstructionService] Assistant not found or unauthorized",
          {
            assistantId,
            userId,
          }
        );
        return {
          success: false,
          message: "Assistant not found or unauthorized access",
        };
      }

      const instructions = await Instruction.findAll({
        where: {
          assistantId,
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
      });

      return {
        success: true,
        data: {
          instructions,
        },
      };
    } catch (error) {
      console.error("[InstructionService] Error listing instructions:", {
        assistantId,
        userId,
        error: error.message,
        stack: error.stack,
      });

      return {
        success: false,
        message: "Failed to list instructions",
      };
    }
  }

  async update(instructionId, updateData, userId) {
    console.log("[InstructionService] Attempting to update instruction", {
      instructionId,
      userId,
    });

    try {
      const instruction = await Instruction.findOne({
        where: { id: instructionId },
      });

      if (!instruction) {
        console.log("[InstructionService] Instruction not found", {
          instructionId,
          userId,
        });
        return {
          success: false,
          message: "Instruction not found",
        };
      }

      const assistant = await Assistant.findOne({
        where: {
          id: instruction.assistantId,
          userId,
        },
      });

      if (!assistant) {
        console.log("[InstructionService] Unauthorized access", {
          instructionId,
          userId,
        });
        return {
          success: false,
          message: "Unauthorized access",
        };
      }

      const updatedFields = {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.content && { content: updateData.content }),
        ...(updateData.metadata && { metadata: updateData.metadata }),
        ...(updateData.isActive !== undefined && {
          isActive: updateData.isActive,
        }),
      };

      await instruction.update(updatedFields);

      console.log("[InstructionService] Instruction updated successfully", {
        instructionId,
        userId,
      });

      return {
        success: true,
        data: {
          instruction,
        },
      };
    } catch (error) {
      console.error("[InstructionService] Error updating instruction:", {
        instructionId,
        userId,
        error: error.message,
        stack: error.stack,
      });

      return {
        success: false,
        message: "Failed to update instruction",
      };
    }
  }

  async delete(instructionId, userId) {
    console.log("[InstructionService] Attempting to delete instruction", {
      instructionId,
      userId,
    });

    try {
      const instruction = await Instruction.findOne({
        where: { id: instructionId },
      });

      if (!instruction) {
        console.log("[InstructionService] Instruction not found", {
          instructionId,
          userId,
        });
        return {
          success: false,
          message: "Instruction not found",
        };
      }

      const assistant = await Assistant.findOne({
        where: {
          id: instruction.assistantId,
          userId,
        },
      });

      if (!assistant) {
        console.log("[InstructionService] Unauthorized access", {
          instructionId,
          userId,
        });
        return {
          success: false,
          message: "Unauthorized access",
        };
      }

      await Instruction.destroy({
        where: { id: instructionId },
      });

      console.log("[InstructionService] Instruction deleted successfully", {
        instructionId,
        userId,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("[InstructionService] Error deleting instruction:", {
        instructionId,
        userId,
        error: error.message,
        stack: error.stack,
      });

      return {
        success: false,
        message: "Failed to delete instruction",
      };
    }
  }
}

module.exports = InstructionService;
