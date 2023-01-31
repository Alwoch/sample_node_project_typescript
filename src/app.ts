import express from "express";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

//express app
const app: express.Application = express();

//middleware
app.use(express.json());

//user interface
interface User {
  id: number;
  username: string;
  email: string;
}

let userData: User[] = [];

// Load data from the userData.json file
try {
  userData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../userData.json"), "utf-8")
  );
} catch (error) {
  console.error(error);
}

// Save data to the userData.json file
const saveData = () => {
  fs.writeFileSync(
    path.join(__dirname, "../userData.json"),
    JSON.stringify(userData)
  );
};

//routes

//create new user
app.post("/", (req: Request, res: Response) => {
  const { username, email } = req.body;

  //throw an error if either username or email is missing
  if (!username || !email) {
    res.status(400).json({ msg: "please provide both username and email" });
  }

  //check if a user with the same email exists
  const existingUser = userData.find((user) => user.email === email);
  if (existingUser) {
    return res.status(209).json({ msg: "user is already in existence" });
  }

  //new user
  const newUser: User = {
    id: userData.length + 1,
    username,
    email,
  };
  userData.push(newUser); //add new user to userData
  saveData(); //save the user to the json file

  res.status(201).json(newUser);
});

//get all users
app.get("/", (req: Request, res: Response) => {
  res.status(200).json(userData);
});

//get single user
app.get("/:userId", (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const user = userData.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }
  res.status(200).json(user);
});

//update user
app.patch("/:userId", (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  
  const userIndex = userData.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ msg: "user not found" });
  }

  const user = userData[userIndex];
  const { username, email } = req.body;

  if (!username && !email) {
    res
      .status(400)
      .json({ msg: "please provide either updated username or email" });
  }
  if (username) {
    user.username = username;
  }
  if (email) {
    user.email = email;
  }

  userData[userIndex] = user;
  saveData();

  res.status(200).json(user);
});

//delete user
app.delete("/:userId", (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const userIndex = userData.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ msg: "user not found" });
  }

  userData.splice(userIndex, 1);
  saveData();

  res.status(204).json({ msg: "user has been deleted" });
});

//port
const port = 7000;

//listen for requests
app.listen(port, () => {
  console.log(`listening for requests on localhost:${port}`);
});
