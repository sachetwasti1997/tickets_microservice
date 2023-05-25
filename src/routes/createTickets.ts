import express, {Request, Response} from "express";
import { body } from "express-validator";
import { authorisedCheck, validateRequest } from "@ticketingplatform/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post('/api/tickets', authorisedCheck,[
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title cannot be absent or empty!'),
    body('price')
        .isFloat({gt:0})
        .withMessage('Price must be greater than 0!')
], validateRequest, async(req: Request, res: Response) => {
    const { title, price} = req.body;
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    })

    await ticket.save()

    res.status(201).send(ticket)
})

export {router as createTicketRouter}