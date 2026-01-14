export type TrainTicket = {
  id: string;
  from: string;
  to: string;
  time: string; 
  price: number; 
  seat: string;
  status: "confirmed" | "pending" | "cancelled";
};

export type Passenger = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

export const MOCK_TICKETS: TrainTicket[] = [
  {
    id: "TK-2025-0001",
    from: "Warszawa",
    to: "Kraków",
    time: "08:45",
    price: 79.99,
    seat: "Wagon 4, Miejsce 12A",
    status: "confirmed",
  },
  {
    id: "TK-2025-0002",
    from: "Gdańsk",
    to: "Poznań",
    time: "12:10",
    price: 64.5,
    seat: "Wagon 2, Miejsce 6B",
    status: "pending",
  },
  {
    id: "TK-2025-0003",
    from: "Wrocław",
    to: "Warszawa",
    time: "17:30",
    price: 89.0,
    seat: "Wagon 5, Miejsce 21C",
    status: "confirmed",
  },
];

export const MOCK_PASSENGERS: Passenger[] = [
  { id: "P-001", name: "Jan Kowalski", email: "jan.k@example.com" },
  { id: "P-002", name: "Anna Nowak", phone: "+48 600 100 200" },
  { id: "P-003", name: "Marek Zieliński", email: "marek.z@example.com", phone: "+48 501 234 567" },
];

export async function fetchTickets(): Promise<TrainTicket[]> {
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_TICKETS;
}

export async function fetchPassengers(): Promise<Passenger[]> {
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_PASSENGERS;
}
