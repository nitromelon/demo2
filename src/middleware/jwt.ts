import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();
const audience = process.env["AUTH0_AUDIENCE"] || "";
const issuerBaseURL = process.env["AUTH0_ISSUERBASEURL"] || "";
const tokenSigningAlg = process.env["AUTH0_TOKENSIGNINGAL"] || "";

const checkJWT = auth({
    audience: audience,
    issuerBaseURL: issuerBaseURL,
    tokenSigningAlg: tokenSigningAlg,
});

export default checkJWT;
