export interface ContactDetail {
  id: string;
  no: number;
  name: string;
}

export interface ContactDetailsTableProps {
  data: ContactDetail[];
  onRemoveGuest: (id: string) => void;
  onUpdateGuest: (id: string, name: string) => void;
}

export interface BookingDetail {
  id: string;
  hotelName: string;
  roomType: string;
  rating: number;
  imageSrc: string;
  checkIn: Date;
  checkOut: Date;
  checkInTime: string;
  checkOutTime: string;
  cancellationPeriod: Date;
  rooms: RoomDetail[];
  additionalServices: AdditionalService[];
  totalPrice: number;
}

export interface RoomDetail {
  id: string;
  name: string;
  quantity: number;
  price: number;
  includes: string[];
  features: string[];
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
}
