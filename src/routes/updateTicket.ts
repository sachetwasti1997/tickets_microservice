import {
  NotFoundError,
  UnAuthorisedError,
  authorisedCheck,
  validateRequest,
} from "@ticketingplatform/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    ticket.set({
      title: req.body.title,
      price: req.body.price
    })
    await ticket.save()
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
