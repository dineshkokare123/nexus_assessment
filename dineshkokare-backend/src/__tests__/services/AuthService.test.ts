import { AuthService } from "../../services/AuthService";
import { User } from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock User model and external libs
jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (User.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        role: "member"
      });
      (jwt.sign as jest.Mock).mockReturnValue("testtoken");

      const result = await authService.register("Test User", "test@example.com", "password");

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(User.create).toHaveBeenCalled();
      expect(result).toHaveProperty("token", "testtoken");
      expect(result).toHaveProperty("user");
    });

    it("should throw error if user exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(authService.register("Test", "test@example.com", "pw"))
        .rejects.toThrow("User already exists");
    });
  });

  describe("login", () => {
    it("should login successfully with correct credentials", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        role: "member"
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("testtoken");

      const result = await authService.login("test@example.com", "password");
      expect(result.token).toBe("testtoken");
    });

    it("should fail with invalid password", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ password: "hashedPassword" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login("test@example.com", "wrong")).rejects.toThrow("Invalid credentials");
    });
  });
});
