import express from "express";
import { Request, Response } from "express";

//express app
const app: express.Application = express();

//middleware
app.use(express.json());

//data
interface User {
  id: number;
  username: string;
  email: string;
}

const userData: User[] = [
  { id: 1, username: "john", email: "john@example.com" },
  { id: 2, username: "caleb", email: "caleb@example.com" },
  { id: 3, username: "nakamura", email: "nakamura@example.com" },
  { id: 4, username: "steve", email: "steve@example.com" },
  { id: 5, username: "kelcey", email: "kelcey@example.com" },
];

//routes

//create new user
app.post("/", (req: Request, res: Response) => {
  const { username, email } = req.body;

  //check if a user with the same email exists
  const existingUser = userData.find((user) => user.email === email);
  if (existingUser) {
    return res.status(209).json({ msg: "user is already in existence" });
  }

  //create user
  const newUser: User = {
    id: userData.length + 1,
    username,
    email,
  };
  userData.push(newUser);
  console.log(userData);

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
 const userIndex = userData.findIndex(user => user.id === userId);
 if (userIndex === -1) {
   return res.status(404).json({ msg: "user not found" });
 }

 const user = userData[userIndex];
 const { username, email } = req.body;
 if (username) {
   user.username = username;
 }
 if (email) {
   user.email = email;
 }

 userData[userIndex] = user;
 res.status(200).json(user);
});

//delete user
app.delete("/:userId", (req: Request, res: Response) => {
 const userId = parseInt(req.params.userId);
 const userIndex = userData.findIndex(user => user.id === userId);
 if (userIndex === -1) {
   return res.status(404).json({ msg: "user not found" });
 }

 userData.splice(userIndex, 1);
 res.sendStatus(204);
});

//port
const port = 7000;

//listen for requests
app.listen(port, () => {
  console.log(`listening for requests on localhost:${port}`);
});
