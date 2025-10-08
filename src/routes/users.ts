import express, { Request, Response } from "express";
import lodash from "lodash";

const router = express.Router();

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

// Mock database (in-memory)
let users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@example.com",
  },
  { id: 2, username: "user", password: "password", email: "user@example.com" },
];

// SQL Injection vulnerability (simulated)
router.get("/search", (req: Request, res: Response) => {
  const query = req.query.q as string;

  // Vulnerable: Direct string concatenation (SQL injection pattern)
  const sqlQuery = `SELECT * FROM users WHERE username = '${query}'`;
  console.log("Executing query:", sqlQuery);

  // In real scenario, this would execute against database
  const results = users.filter(u => u.username.includes(query));
  res.json(results);
});

// XSS vulnerability
router.get("/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === parseInt(userId));

  if (!user) {
    // Vulnerable: Reflecting user input without sanitization
    return res.status(404).send(`<h1>User ${userId} not found</h1>`);
  }

  res.json(user);
});

// Insecure direct object reference
router.post("/", (req: Request, res: Response) => {
  const newUser = req.body as User;

  // Vulnerable: No input validation
  // Vulnerable: Storing passwords in plain text
  newUser.id = users.length + 1;
  users.push(newUser);

  res.status(201).json(newUser);
});

// Vulnerable authentication
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body as User;

  // Vulnerable: Plain text password comparison
  const user = users.find(
    u => u.username === username && u.password === password,
  );

  if (!user) {
    // Vulnerable: Information disclosure
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Vulnerable: Weak JWT secret
  const token = "fake_jwt_token_" + user.id;

  res.json({
    token,
    user: user, // Vulnerable: Returning sensitive data including password
  });
});

// Insecure deserialization pattern
router.post("/import", (req: Request, res: Response) => {
  try {
    // Vulnerable: eval-like behavior
    const body = req.body as { data?: unknown };
    const data: string = body && typeof body.data === "string" ? body.data : "";
    const parsed: unknown = JSON.parse(data);
    const imported: User[] = Array.isArray(parsed) ? (parsed as User[]) : [];

    // Vulnerable: No validation of imported data
    users = users.concat(imported);

    res.json({ message: "Import successful", count: imported.length });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Path traversal vulnerability
router.get("/file/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename;

  // Vulnerable: No path sanitization
  const filePath = `./uploads/${filename}`;
  console.log("Accessing file:", filePath);

  res.json({ path: filePath, message: "File access simulated" });
});

// SECURITY: Command injection (simulated)
router.post("/backup", (req: Request, res: Response) => {
  interface test {
    name: string;
  }

  const backupName = (req.body as test).name;

  // VULNERABLE: Command injection pattern
  const command = `backup_script.sh ${backupName}`;
  console.log("Executing:", command);

  res.json({ message: "Backup initiated", command });
});

export default router;
