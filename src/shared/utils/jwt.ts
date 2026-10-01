import fs from "node:fs";
import path from "node:path";
import { importSPKI, jwtVerify } from "jose";

const publicKeyPem = fs.readFileSync(
  path.join(process.cwd(), "keys/jwt-public.pem"),
  "utf8",
);

const publicKey = await importSPKI(publicKeyPem, "RS256");

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, publicKey, {
    algorithms: ["RS256"],
  });

  return payload;
}