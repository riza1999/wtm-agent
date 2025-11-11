"use client";

import { submitContactUs } from "@/app/(protected)/contact-us/actions";
import {
  fetchUserBookings,
  fetchUserSubBookings,
} from "@/app/(protected)/contact-us/fetch";
import {
  ContactUsSchema,
  contactUsSchema,
} from "@/app/(protected)/contact-us/types";
import { fetchAccountProfile } from "@/app/(protected)/settings/fetch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ContactUsFormProps {
  urlBookingId?: string;
}

const ContactUsForm = ({ urlBookingId }: ContactUsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: dataProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchAccountProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const form = useForm<ContactUsSchema>({
    resolver: zodResolver(contactUsSchema),
    values: {
      name: dataProfile?.data.full_name || "",
      email: dataProfile?.data.email || "",
      subject: "",
      type: urlBookingId ? "booking" : "general",
      message: "",
      booking_code: urlBookingId || "",
      sub_booking_code: "",
    },
  });

  const type = form.watch("type");

  const {
    data: dataBooking,
    isLoading: isLoadingBooking,
    isError: isErrorBooking,
  } = useQuery({
    queryKey: ["booking"],
    queryFn: fetchUserBookings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: type === "booking",
  });

  const booking_code = form.watch("booking_code");

  const {
    data: dataSubBookings,
    isLoading: isLoadingSubBookings,
    isError: isErrorSubBookings,
  } = useQuery({
    queryKey: ["subBookings", booking_code],
    queryFn: () => fetchUserSubBookings(booking_code || ""),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: !!booking_code,
  });

  // Clear booking fields when inquiry type changes to general
  useEffect(() => {
    if (type === "general") {
      form.setValue("booking_code", "");
      form.setValue("sub_booking_code", "");
    }
  }, [type, form]);

  async function onSubmit(values: ContactUsSchema) {
    setIsLoading(true);

    try {
      const result = await submitContactUs(values);

      if (result.success) {
        toast.success(result.message);
        form.reset({
          name: dataProfile?.data.full_name,
          email: dataProfile?.data.email,
          subject: "",
          type: "general",
          message: "",
          booking_code: "",
          sub_booking_code: "",
        });
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to submit your inquiry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Contact Us</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 1st Row: Name and Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      className="bg-muted"
                      placeholder="Your full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      className="bg-muted"
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 2nd Row: Subject */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">
                    Subject
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Brief description of your inquiry"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">
                    Inquiry Type
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="booking">Booking Related</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 4th Row: Booking Fields (Conditional) */}
          {type === "booking" && dataBooking && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="booking_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-0">
                      Select Booking <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Choose your booking" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataBooking.map((booking) => (
                          <SelectItem key={booking.value} value={booking.value}>
                            {booking.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {booking_code && dataSubBookings && (
                <FormField
                  control={form.control}
                  name="sub_booking_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Booking Item (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="w-full bg-white"
                            value={field.value}
                            onReset={() => form.resetField("sub_booking_code")}
                          >
                            <SelectValue placeholder="Choose specific item (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* <button
                            onClick={() => form.resetField("subBookingId")}
                            className="focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
                          >
                            Clear
                          </button>
                          <SelectSeparator /> */}
                          {dataSubBookings.map((subBooking) => (
                            <SelectItem
                              key={subBooking.value}
                              value={subBooking.value}
                            >
                              {subBooking.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {/* 5th Row: Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-0">
                  Message
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Please describe your inquiry in detail. Include any relevant information that will help us assist you better."
                    className="min-h-[120px] resize-none bg-white"
                  />
                </FormControl>
                <FormDescription>
                  Minimum 10 characters. Be as detailed as possible to help us
                  provide better assistance.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactUsForm;
