import ContactUsForm from "@/components/contact-us/contact-us-form";

const ContactUsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) => {
  // Get bookingId from search params
  const params = await searchParams;
  const urlBookingId = params.bookingId;

  return (
    <div>
      <ContactUsForm urlBookingId={urlBookingId} />
    </div>
  );
};

export default ContactUsPage;
