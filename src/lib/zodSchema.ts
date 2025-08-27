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

export const registerUserSchema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .min(2, "Min 2 characters")
      .max(32, "Max 32 characters"),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1, "Required"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    role: z.enum(["SENDER", "RECEIVER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error message will appear at confirmPassword
  });

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z
    .string({ message: "Confirm Password is required" })
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
  token: z
    .string({ message: "Token is required" })
    .regex(
      /^([0-9a-zA-Z\-_=]{2,})\.([0-9a-zA-Z\-_=]{2,})\.([0-9a-zA-Z\-_=]*)$/,
      "Invalid token"
    )
    .optional()
    .or(z.literal("")),
  id: z
    .string({ message: "Id is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id")
    .optional()
    .or(z.literal("")),
});
