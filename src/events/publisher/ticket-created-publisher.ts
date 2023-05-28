import { Publisher, TicketCreatedEvent, Subjects } from "@ticketingplatform/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> { 
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}