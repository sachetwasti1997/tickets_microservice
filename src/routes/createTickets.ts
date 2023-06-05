import express, { Request, Response } from "express";
import { body } from "express-validator";
import { authorisedCheck, validateRequest } from "@ticketingplatform/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  authorisedCheck,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Title cannot be absent or empty!"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0!"),
    body("description").notEmpty().withMessage("Description cannot be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, description } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      userFullName: `${req.currentUser!.firstName} ${req.currentUser!.lastName}`,
      description
    });

    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
