import { Router } from "express";
import {
  body,
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Should not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    console.log("user session id ", request.session.id);
    request.sessionStore.get(request.session.id, (error, sessionData) => {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log("user session ", sessionData);
    });
    const result = validationResult(request);
    console.log("request", result);
    const {
      query: { filter, value },
    } = request;
    if (!filter && !value) return response.send(mockUsers);

    if (filter && value)
      response
        .status(200)
        .send(mockUsers.filter((user) => user[filter].includes(value)));
  }
);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  createUserHandler
);

// router.post(
//   `/api/users`,
//   checkSchema(createUserValidationSchema),
//   (request, response) => {
//     const result = validationResult(request);

//     if (!result.isEmpty())
//       return response.status(400).send({ errors: result.array() });

//     const data = matchedData(request);
//     console.log("data", data);
//     const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
//     mockUsers.push(newUser);
//     return response.status(201).send(newUser);
//   }
// );

router.get(`/api/users/:id`, resolveIndexByUserId, getUserByIdHandler);

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/uses/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
