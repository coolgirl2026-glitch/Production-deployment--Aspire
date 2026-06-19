import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "30d"; // long-lived session = "continuous authentication"

if (!JWT_SECRET) {
  console.warn(
    "⚠️  JWT_SECRET is not set in backend/.env — sessions will not be secure. " +
    "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
  );
}

const SECRET_FOR_SIGNING = JWT_SECRET || "insecure-dev-secret-set-JWT_SECRET-in-env";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(account) {
  return jwt.sign(
    { sub: account.id, name: account.name, email: account.email },
    SECRET_FOR_SIGNING,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET_FOR_SIGNING);
}

// Express middleware: requires a valid "Authorization: Bearer <token>" header.
// On success, attaches req.user = { id, name, email } and calls next().
export function requireAuth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ error: "Missing session. Please sign in." });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, name: payload.name, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired or invalid. Please sign in again." });
  }
}
