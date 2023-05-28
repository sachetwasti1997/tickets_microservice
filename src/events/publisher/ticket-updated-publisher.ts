import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketingplatform/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
