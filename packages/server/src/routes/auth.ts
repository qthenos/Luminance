import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";
import profiles from "../services/profile-svc";

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

function generateAccessToken(username: string): Promise<String> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      },
    );
  });
}

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .create(username, password)
      .then((creds) => {
        // Create a profile for the new user
        return profiles.create({ userid: creds.username, favoriteCards: [], avatar: "" })
          .then(() => creds)
          .catch((profileErr) => {
            // If profile creation fails, clean up by throwing error
            throw new Error(`Profile creation failed: ${profileErr.message}`);
          });
      })
      .then((creds) => generateAccessToken(creds.username))
      .then((token) => {
        res.status(201).send({ token: token });
      })
      .catch((err) => {
        console.error("Registration error:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        res.status(409).send({ error: errorMessage });
      });
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, password)
      .then((goodUser: string) => generateAccessToken(goodUser))
      .then((token) => res.status(200).send({ token: token }))
      .catch((error) => res.status(401).send("Unauthorized"));
  }
});

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (decoded) next();
      else res.status(401).end();
    });
  }
}

export default router;
