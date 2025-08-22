export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export enum UserRole {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  GITHUB = "GITHUB",
  CREDENTIALS = "CREDENTIALS",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  picture?: string;
  adress?: string;
  password?: string;
  role: UserRole;
  isBlocked: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  auths: IAuthProvider[];
  orders: string[];
}

export interface IParcelPayment {
  method: "COD" | "ONLINE";
  status: "PAID" | "UNPAID";
  amount: number;
  deleveryFee: number;
  transactionId?: string;
}

export enum DeliveryType {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
}

export enum ParcelStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PICK_UP_REQUESTED = "PICK_UP_REQUESTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  AT_HUB = "AT_HUB",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERY_ATTEMPTED = "DELIVERY_ATTEMPTED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
  RETURNED_INITIATED = "RETURNED_INITIATED",
  RETURNED_IN_TRANSIT = "RETURNED_IN_TRANSIT",
  RETURNED = "RETURNED",
  ON_HOLD = "ON_HOLD",
  BLOCKED = "BLOCKED",
}

export interface AddressInfo {
  city: string;
  address: string;
  village?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface DeliveryInfo {
  pickupDate: Date;
  expectedDeliveryDate: Date;
  deliveryType: DeliveryType;
  currentLocation?: {
    type: string;
    coordinates: number[];
    address: string;
  };
  pickupAddress: AddressInfo;
  deliveryAddress: AddressInfo & {
    phone: string;
  };
  senderNote?: string;
}

export interface packageDetails {
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  images?: string[];
  items?: {
    name: string;
    quantity: number;
  }[];
}

export interface IParcel extends Document {
  trackingId: string;
  status: ParcelStatus;
  weight: number;
  sender: string;
  receiver: string;
  deliveryInfo: DeliveryInfo;
  packageDetails: packageDetails;
  paymentInfo: IParcelPayment;
  statusLogs: IStatusLog[];
  isBlocked: boolean;
  isCanceled: boolean;
  isDeleted: boolean;
  reviews: string[];
  createdAt?: Date;
  updatedAt?: Date;
  initiatedBy: string;
  deliveryAttempt: number;
}

export interface IStatusLog {
  status: ParcelStatus;
  timestamp: Date;
  location?: string;
  updatedBy: string;
  note?: string;
}
