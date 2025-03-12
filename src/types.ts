export type UserRole = 'buyer' | 'seller';
export type UserType = 'bride' | 'groom';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  type: UserType;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}