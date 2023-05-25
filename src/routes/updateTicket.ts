import {
  NotFoundError,
  UnAuthorisedError,
  authorisedCheck,
  validateRequest,
} from "@ticketingplatform/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  authorisedCheck,
  [
    body("title").notEmpty().withMessage("Title cannot be null or empty!"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0!"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new NotFoundError());
    }

    if (ticket.userId != req.currentUser!.id) {
      return next(new UnAuthorisedError());
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
