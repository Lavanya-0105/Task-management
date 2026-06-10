import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Comprehensive Swagger Document Specification Object
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Enterprise Task Management API (RBAC)",
    version: "1.0.0",
    description:
      "A robust Node.js/Express REST API featuring strict Role-Based Access Controls.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>",
      },
    },
  },
  paths: {
    "/api/users/register": {
      post: {
        summary: "Register a new system user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  role: {
                    type: "string",
                    enum: ["Developer", "Project Manager", "Admin"],
                    default: "Developer",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully." },
          400: { description: "User already exists / Invalid entry data." },
        },
      },
    },
    "/api/users/login": {
      post: {
        summary: "Log in an existing user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Authentication successful, token returned." },
          401: { description: "Invalid credentials." },
        },
      },
    },
    "/api/tasks": {
      post: {
        summary: "Create a new task (PM & Admin Only)",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "assignedTo"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  assignedTo: {
                    type: "string",
                    description: "MongoDB ObjectId of the assigned developer.",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Task created successfully." },
          403: { description: "Forbidden - Insufficient role permissions." },
        },
      },
    },
    "/api/tasks/all": {
      get: {
        summary: "Fetch all tasks in the system (Admin Only)",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Master task list returned." },
          403: { description: "Forbidden - Admins only." },
        },
      },
    },
    "/api/tasks/my-tasks": {
      get: {
        summary: "Fetch tasks assigned to the logged-in developer",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Assigned task array returned successfully." },
        },
      },
    },
    "/api/tasks/{id}": {
      put: {
        summary: "Update task status (Enforces data ownership validation)",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["Pending", "In Progress", "Completed"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Status updated." },
          403: { description: "Forbidden - Task assigned to someone else." },
        },
      },
      delete: {
        summary: "Permanently delete a task (Admin Only)",
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Task removed." },
          403: { description: "Forbidden - Admin clearance required." },
        },
      },
    },
  },
};

// Bind the Swagger spec object directly to the UI middleware loader
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Base Endpoints
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Task Management RBAC API is running smoothly." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server spinning up on port ${PORT}`);
});
