import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role key for backend
);

// health check
app.get("/", (req, res) => {
  res.send("Backend running with Supabase!");
});

// example: fetch users from "users" table
app.get("/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// example: insert new user
app.post("/users", async (req, res) => {
  const { username, email } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const { data, error } = await supabase
    .from("users")
    .update({ username, email })
    .eq("id", id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
