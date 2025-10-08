import app from "./app";

const PORT = process.env.PORT || 3000;

// Hardcoded secret (Gitleaks will catch this)
const API_KEY = "ghp_1234567890abcdefghijklmnopqrstuvwxyz";
const DB_PASSWORD = "SuperSecret123!";

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key: ${API_KEY}`); // Security issue: logging secrets
});

export default app;
