const http = require("http");
const uuid = require("uuid");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { read, write } = require("../utils/utils");
const bodyParser = require("../utils/bodyParser");

dotenv.config();

const port = process.env.PORT || 8080;

http
  .createServer(async (request, response) => {
    const ID = request.url.split("/")[2];
    response.writeHead(200, {
      "Content-Type": "Application/json",
      "Access-Control-Allow-Origin": "*",
    });

    if (request.method === "GET") {
      // ---------------------- USERS --------------------- //
      if (request.url === "/users") {
        const readUsers = await read("users");
        response.end(JSON.stringify(readUsers));

        const loggedUserID = request.headers.headers;

        const oneID = read("users").filter((el) => el.userID === loggedUserID);

        response.end(
          JSON.stringify(oneID, {
            message: "OK",
          })
        );
      }

      if (request.url === `/users/${ID}`) {
        const getInfo = read("users").find((el) => el.id === ID);
        if (!getInfo) return response.end("User not found!.");
        response.end(JSON.stringify(getInfo));
      }
      // ---------------------- FRUITS -------------------- //
      if (request.url === "/fruits") {
        const readFruits = await read("fruits");
        response.end(JSON.stringify(readFruits));
      }

      if (request.url === `/fruits/${ID}`) {
        const getInfo = read("fruits").find((el) => el.id === ID);
        if (!getInfo) return response.end("fruit not found!.");
        response.end(JSON.stringify(getInfo));
      }
      // ---------------------- ANIMALS -------------------- //
      if (request.url === "/animals") {
        const readAnimals = await read("animals");
        response.end(JSON.stringify(readAnimals));
      }

      if (request.url === `/animals/${ID}`) {
        const getInfo = read("animals").find((el) => el.id === ID);
        if (!getInfo) return response.end("animal not found!.");
        response.end(JSON.stringify(getInfo));
      }
      // ---------------------- CARS --------------------- //
      if (request.url === "/cars") {
        const readCars = await read("cars");
        response.end(JSON.stringify(readCars));
      }

      if (request.url === `/cars/${ID}`) {
        const getInfo = read("cars").find((el) => el.id === ID);
        if (!getInfo) return response.end("Car not found!.");
        response.end(JSON.stringify(getInfo));
      }
    } else if (request.method === "POST") {
      // ---------------------- REGISTRATION USERS --------------------- //
      if (request.url === "/register") {
        const { userName, email, password } = await bodyParser(request);

        const readRegUsers = read("regUsers");
        const foundedUser = readRegUsers.find((el) => el.email === email);
        if (foundedUser)
          return response.end(
            JSON.stringify({
              message: "Email already exists !!!.",
            })
          );

        const hashedPwd = await bcrypt.hash(password, 12);

        readRegUsers.push({
          id: uuid.v4(),
          userName,
          email,
          password: hashedPwd,
        });

        write("regUsers", readRegUsers);
        response.end(
          JSON.stringify({ message: "Successfully Registrated !." })
        );
      }
      // --------------------- LOGIN USERS ---------------------- //
      if (request.url === "/login") {
        const { userName, password } = await bodyParser(request);
        const readRegUsers = read("regUsers");
        const foundedUser = readRegUsers.find(
          (el) => el.userName === userName || el.email === userName
        );

        if (!foundedUser)
          return response.end(
            JSON.stringify({
              message: "User not found !.",
            })
          );
        const isLogged = await bcrypt.compare(password, foundedUser.password);

        if (!isLogged)
          return response.end(
            JSON.stringify({
              message: "Password error !!!.",
            })
          );

        delete foundedUser.password;
        response.end(
          JSON.stringify({
            message: "Successfully Logged",
            data: foundedUser,
          })
        );
      }

      // ---------------------- USERS --------------------- //
      if (request.url === "/add/users") {
        const newUser = await bodyParser(request);
        const readUsers = await read("users");
        readUsers.push({
          id: uuid.v4(),
          ...newUser,
        });
        write("users", readUsers);
        response.end(
          JSON.stringify({ message: "Successfully Added new User." })
        );
      }
      // ---------------------- FRUITS -------------------- //
      if (request.url === "/add/fruit") {
        const newFruit = await bodyParser(request);
        const readFruits = await read("fruits");
        readFruits.push({
          id: uuid.v4(),
          ...newFruit,
        });
        write("fruits", readFruits);
        response.end(
          JSON.stringify({ message: "Successfully Added new Fruit." })
        );
      }
      // ---------------------- ANIMALS -------------------- //
      if (request.url === "/add/animals") {
        const newAnimal = await bodyParser(request);
        const readAnimals = await read("animals");
        readAnimals.push({
          id: uuid.v4(),
          ...newAnimal,
        });
        write("animals", readAnimals);
        response.end(
          JSON.stringify({ message: "Successfully Added new Animal." })
        );
      }
      // ---------------------- CARS -------------------- //
      if (request.url === "/add/car") {
        const newCar = await bodyParser(request);
        const readCars = await read("cars");
        readCars.push({
          id: uuid.v4(),
          ...newCar,
        });
        write("cars", readCars);
        response.end(
          JSON.stringify({ message: "Successfully Added new Car." })
        );
      }
    } else if (request.method === "DELETE") {
      // ---------------------- USERS --------------------- //
      if (request.url === `/users/${ID}`) {
        const readUsers = await read("users");

        const getInfo = readUsers.find((el) => el.id === ID);
        if (!getInfo) return response.end("User not found!.");

        readUsers.forEach((el, index) => {
          if (el.id === ID) {
            readUsers.splice(index, 1);
          }
        });

        write("users", readUsers);
        response.end(JSON.stringify({ message: "Successfully Deleted!." }));
      }
      // ---------------------- FRUITS -------------------- //
      if (request.url === `/fruits/${ID}`) {
        const readFruits = await read("fruits");

        const getInfo = readFruits.find((el) => el.id === ID);
        if (!getInfo) return response.end("Fruit not found!.");

        readFruits.forEach((el, index) => {
          if (el.id === ID) {
            readFruits.splice(index, 1);
          }
        });

        write("fruits", readFruits);
        response.end(JSON.stringify({ message: "Successfully Deleted!." }));
      }
      // ---------------------- ANIMALS -------------------- //
      if (request.url === `/animals/${ID}`) {
        const readAnimals = await read("animals");

        const getInfo = readAnimals.find((el) => el.id === ID);
        if (!getInfo) return response.end("Animals not found!.");

        readAnimals.forEach((el, index) => {
          if (el.id === ID) {
            readAnimals.splice(index, 1);
          }
        });

        write("animals", readAnimals);
        response.end(JSON.stringify({ message: "Successfully Deleted!." }));
      }
      // ---------------------- CARS -------------------- //
      if (request.url === `/cars/${ID}`) {
        const readCars = await read("cars");

        const getInfo = readCars.find((el) => el.id === ID);
        if (!getInfo) return response.end("Car not found!.");

        readCars.forEach((el, index) => {
          if (el.id === ID) {
            readCars.splice(index, 1);
          }
        });

        write("cars", readCars);
        response.end(JSON.stringify({ message: "Successfully Deleted!." }));
      }
    } else if (request.method === "PUT") {
      // ---------------------- USERS --------------------- //
      if (request.url === `/users/${ID}`) {
        const updatedUser = await bodyParser(request);
        const readUsers = await read("users");
        const getInfo = readUsers.find((el) => el.id === ID);
        if (!getInfo) return response.end("User not found!.");
        readUsers.forEach((el, idx) => {
          if (el.id === ID) {
            (el.user = updatedUser.user),
              (el.age = updatedUser.age),
              (el.gender = updatedUser.gender),
              (el.Education = updatedUser.Education);
          }
        });

        write("users", readUsers);
        response.end(JSON.stringify({ message: "Successfully Updated!." }));
      }
      // ---------------------- FRUITS -------------------- //
      if (request.url === `/fruits/${ID}`) {
        const updatedFruit = await bodyParser(request);
        const readFruits = await read("fruits");
        const getInfo = readFruits.find((el) => el.id === ID);
        if (!getInfo) return response.end("fruit not found!.");
        readFruits.forEach((el, idx) => {
          if (el.id === ID) {
            (el.name = updatedFruit.name),
              (el.kilo = updatedFruit.kilo),
              (el.price = updatedFruit.price);
          }
        });

        write("fruits", readFruits);
        response.end(JSON.stringify({ message: "Successfully Updated!." }));
      }
      // ---------------------- ANIMALS -------------------- //
      if (request.url === `/animals/${ID}`) {
        const updatedAnimal = await bodyParser(request);
        const readAnimals = await read("animals");
        const getInfo = readAnimals.find((el) => el.id === ID);
        if (!getInfo) return response.end("Animal not found!.");
        readAnimals.forEach((el, idx) => {
          if (el.id === ID) {
            (el.name = updatedAnimal.name),
              (el.type = updatedAnimal.type),
              (el.color = updatedAnimal.color),
              (el.foot = updatedAnimal.foot);
          }
        });

        write("animals", readAnimals);
        response.end(JSON.stringify({ message: "Successfully Updated!." }));
      }
      // ---------------------- CARS -------------------- //
      if (request.url === `/cars/${ID}`) {
        const updatedCar = await bodyParser(request);
        const readCars = await read("cars");
        const getInfo = readCars.find((el) => el.id === ID);
        if (!getInfo) return response.end("Car not found!.");
        readCars.forEach((el, idx) => {
          if (el.id === ID) {
            (el.name = updatedCar.name),
              (el.color = updatedCar.color),
              (el.price = updatedCar.price),
              (el.type = updatedCar.type);
          }
        });

        write("cars", readCars);
        response.end(JSON.stringify({ message: "Successfully Updated!." }));
      }
    }
  })
  .listen(7007, () => {
    console.log(`Server is running on the ${port} port.`);
  });
