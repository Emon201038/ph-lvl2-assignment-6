import z from "zod";

export const parcelSchema = z.object({
  receiverEmail: z
    .string({ message: "Receiver Email is required" })
    .email({ message: "Enter valid email" }),
  packageDetails: z.object({
    weight: z.coerce
      .number({ error: "Weight is required" })
      .positive()
      .min(0.5, "Weight must be at least 0.5kg")
      .max(50, "Weight must be less than 50kg"),
    dimensions: z.object({
      length: z.coerce
        .number({ error: "Length is required" })
        .positive()
        .min(1, "Length must be at least 1cm")
        .max(100, "Length must be less than 100cm")
        .optional(),
      width: z.coerce
        .number({ error: "Width is required" })
        .positive()
        .min(1, "Width must be at least 1cm")
        .max(100, "Width must be less than 100cm")
        .optional(),
      height: z.coerce
        .number({ error: "Height is required" })
        .positive()
        .min(1, "Height must be at least 1cm")
        .max(100, "Height must be less than 100cm")
        .optional(),
    }),
    type: z.enum(["DOCUMENT", "PHYSICAL"]).default("PHYSICAL"),
    description: z.string().optional(),
  }),
  deliveryInfo: z.object({
    deliveryAddress: z.object({
      state: z
        .string({ message: " state is required" })
        .min(1, "Select a state"),
      city: z.string({ message: " city is required" }).min(1, "Select a city"),
      area: z.string({ message: " area is required" }).min(1, "Select a area"),
      address: z
        .string({ message: "Full Address is required" })
        .min(1, "Enter full address"),
      phone: z
        .string({ message: "Phone number is required" })
        .min(1, "Enter phone number"),
      name: z
        .string({ message: "Receiver name is requred" })
        .min(1, "Required")
        .max(32, "Max 32 characters"),
    }),
    pickupAddress: z.object({
      state: z
        .string({ message: " state is required" })
        .min(1, "Select a state"),
      city: z.string({ message: " city is required" }).min(1, "Select a city"),
      area: z.string({ message: " area is required" }).min(1, "Select a area"),
      address: z
        .string({ message: "Full Address is required" })
        .min(1, "Enter full address"),
      phone: z
        .string({ message: "Phone number is required" })
        .min(1, "Enter phone number"),
      name: z
        .string({ message: "Sender name is requred" })
        .min(1, "Required")
        .max(32, "Max 32 characters"),
    }),
    deliveryType: z.enum(["STANDARD", "EXPRESS"]).default("STANDARD"),
    senderNote: z.string().optional(),
  }),
  paymentInfo: z.object({
    method: z.enum(["COD", "ONLINE"], { error: "Payment method is required" }),
    status: z.enum(["UNPAID", "PAID"], { error: "Payment status is required" }),
    amount: z.coerce.number({ message: "Amount is required" }).positive(),
  }),
});

export type ParcelSchema = z.infer<typeof parcelSchema>;

export const userSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, "Required")
    .max(32, "Max 32 characters"),
  phone: z
    .string({ message: "Phone number is required" })
    .regex(
      /^(?:\+8801|01)\d{9}$/,
      "Phone number should be in the format +8801xxxxxxxxx or 01xxxxxxxxx"
    )
    .optional()
    .or(z.literal("")),
  adress: z
    .object({
      state: z.string({ message: " state is required" }).optional(),
      city: z.string({ message: " city is required" }).optional(),
      area: z.string({ message: " area is required" }).optional(),
      adress: z
        .string({ message: "Full Address is required" })
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
