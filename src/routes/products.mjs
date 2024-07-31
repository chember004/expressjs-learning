import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log(request.signedCookies);
  if (
    request.signedCookies.cookie &&
    request.signedCookies.cookie === "cookie monster"
  )
    response.send([{ id: 1, name: "chicken thigh", price: 12.69 }]);

  response.send({ msg: "You need the right cookie." });
});

export default router;
