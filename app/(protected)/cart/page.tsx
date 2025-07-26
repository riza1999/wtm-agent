import BookingDetailsSection from "@/components/cart/booking-details-section";
import { ContactDetailsSection } from "@/components/cart/contact-details-section";
import { getBookingDetails, getContactDetails } from "./fetch";

const CartPage = async () => {
  // Fetch data in parallel
  const [initialGuests, bookingDetails] = await Promise.all([
    getContactDetails(),
    getBookingDetails(),
  ]);

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="grid gap-6">
        <ContactDetailsSection initialGuests={initialGuests} />
        <BookingDetailsSection bookingDetailsList={bookingDetails} />
      </div>
    </div>
  );
};

export default CartPage;
