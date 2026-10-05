import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, password, isGuest } = req.body;
    
    if (isGuest) {
      return res.json({ 
        success: true, 
        user: { 
          id: "guest", 
          name: "Guest Learner", 
          email: "guest@example.com",
          program: "Public Resources Only"
        } 
      });
    }

    // For testing: allow empty or any credentials
    res.json({ 
      success: true, 
      user: { 
        id: "1", 
        name: "Learner User", 
        email: email || "test@example.com",
        program: "Adult Literacy & ESOL"
      } 
    });
  });

  // Mock Messaging API
  app.post("/api/messages", (req, res) => {
    const { message, name, email } = req.body;
    console.log("Message received:", { name, email, message });
    res.json({ success: true, message: "Your message has been sent to the school office." });
  });

  // Mock Resources API
  app.get("/api/resources", (req, res) => {
    res.json([
      { 
        id: "1", 
        title: "Student Handbook", 
        type: "Guide", 
        date: "Mar 2024",
        content: "Welcome! This guide helps you succeed in our program.\n\n• Attendance: Please call if you are sick.\n• Schedule: Classes are Mon-Thu.\n• Support: We are here to help you learn!"
      },
      { 
        id: "2", 
        title: "Weekly Study Guide", 
        type: "Lesson", 
        date: "Mar 4, 2024",
        content: "Practical communication for this week.\n\nKey Vocabulary:\n• Appointment\n• Reschedule\n• Confirmation\n\nTask: Practice calling the office to set a meeting."
      },
      { 
        id: "3", 
        title: "Library Access", 
        type: "Info", 
        date: "Feb 2024",
        content: "How to use the digital library:\n\n1. Open the library website.\n2. Enter your Student ID.\n3. Use your birth year as the password."
      },
    ]);
  });

  // Mock Updates API
  app.get("/api/updates", (req, res) => {
    res.json([
      { id: "1", title: "Spring Break", content: "School will be closed next week, March 10-15. Enjoy your break!", date: "Mar 1" },
      { id: "2", title: "New Computer Class", content: "Free computer basics class starts April 1st. Sign up at the front desk.", date: "Feb 25" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
