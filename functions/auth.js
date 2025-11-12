import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : ["*"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any localhost or local network IP
    const isDevelopment = /^http:\/\/(localhost|192\.168\..*):\d+$/.test(origin);
    if (isDevelopment) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const ok = (res, payload = {}) => res.status(200).json({ success: true, ...payload });
const err = (res, status, message, extra = {}) => res.status(status).json({ success: false, message, ...extra });

app.get("/health", (req, res) => ok(res, { status: "ok" }));

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return err(res, 400, "Missing email or password");

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) return err(res, 400, error.message);

    const user_id = data.user?.id || null;
    const token = data.session?.access_token || null; // may be null if email confirmation is enabled

    return ok(res, { user_id, token });
  } catch (e) {
    return err(res, 500, "Registration failed", { error: e.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return err(res, 400, "Missing email or password");

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return err(res, 401, "Invalid email or password");

    const token = data.session?.access_token || null;
    const user_id = data.user?.id || null;

    return ok(res, { user_id, token });
  } catch (e) {
    return err(res, 500, "Login failed", { error: e.message });
  }
});

app.get("/profile", async (req, res) => {
  const authHeader = req.headers["authorization"] || "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return err(res, 401, "Missing or invalid Authorization header");

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return err(res, 401, "Invalid token");

    const user = data.user;
    return ok(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
      },
    });
  } catch (e) {
    return err(res, 500, "Profile fetch failed", { error: e.message });
  }
});

export const handler = serverless(app, { basePath: "/.netlify/functions/auth" });