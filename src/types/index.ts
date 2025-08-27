export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  adress?: {
    state: string;
    city: string;
    area: string;
    address: string;
  };
  password?: string;
  role: UserRole;
  isBlocked: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  auths: IAuthProvider[];
  parcels: string[];
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
  DISPATCHED = "DISPATCHED",
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
  area: string;
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
  pickupAddress: AddressInfo & {
    phone: string;
    name: string;
  };
  deliveryAddress: AddressInfo & {
    phone: string;
    name: string;
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
  type: "DOCUMENT" | "PHYSICAL";
}

export interface IParcel extends Document {
  _id: string;
  trackingId: string;
  status: ParcelStatus;
  weight: number;
  sender: string | IUser;
  receiver: string | IUser;
  deliveryInfo: DeliveryInfo;
  packageDetails: packageDetails;
  paymentInfo: IParcelPayment;
  statusLogs: IStatusLog[];
  isBlocked: boolean;
  isCanceled: boolean;
  isDeleted: boolean;
  reviews: string[];
  createdAt: Date;
  updatedAt: Date;
  initiatedBy: string;
  deliveryAttempt: number;
}

export interface IStatusLog {
  _id: string;
  status: ParcelStatus;
  timestamp: Date;
  location?: string;
  updatedBy: {
    _id: string;
    name: string;
  };
  note?: string;
}

export interface ICity {
  id: string;
  state_id: string;
  name: string;
}
export interface IArea {
  id: string;
  city_id: string;
  name: string;
}

export interface IUserStat {
  totalUsers: number;
  activeUsers: number;
  last7daysUsers: number;
  last30daysUsers: number;
  usersByRole: {
    [K in keyof typeof UserRole]: number;
  };
  blockedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

export interface IParcelStat {
  allParcel: number;
  parcelByStatus: {
    [K in keyof typeof ParcelStatus]: number;
  };
  parcelByPaymentMethod: {
    [K in keyof IParcelPayment["method"]]: number;
  };
  parcelByPaymentStatus: {
    [K in keyof IParcelPayment["status"]]: number;
  };
  blockedParcels: number;
  deletedParcels: number;
  mostSender: any;
  mostReceiver: any;
  totalRevinue: number;
  monthlyRevenue: number;
}

export interface IMonthlyReport {
  month: string;
  parcels: number;
  revenue: number;
  users: number;
}
