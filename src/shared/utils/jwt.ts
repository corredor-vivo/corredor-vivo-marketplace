import { jwtVerify } from "jose";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não está definido no .env");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyAccessToken(token: string) {
 try {
   const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });

  return payload;
 } catch(error) {
  console.error(error)
 }
}
