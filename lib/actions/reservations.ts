'use server';

import { prisma } from '../prisma';
import { cache } from 'react';
import { ReservationStatus, ReservationSource, PaymentStatus, PaymentMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Adjusted to match the actual schema fields
export interface ReservationData {
  id: string;
  confirmationNumber: string;
  status: ReservationStatus;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number; // Changed from numberOfNights
  adults: number; // Changed from numberOfAdults
  children: number; // Changed from numberOfChildren
  totalAmount: Decimal;
  currency: string;
  specialRequests: string | null;
  internalNotes: string | null; // Changed from notes
  source: ReservationSource; // Changed from string
  paymentStatus: PaymentStatus; // Replaced isPaid and isConfirmed
  createdAt: Date;
  updatedAt: Date;
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    country: string | null;
  };
  businessUnit: {
    id: string;
    name: string;
    displayName: string;
    city: string;
    country: string;
  };
  rooms: Array<{
    id: string;
    room?: { // The room itself is optional
      id: string;
      roomNumber: string;
      roomType: {
        id: string;
        name: string;
        description: string | null;
      };
    };
    baseRate: Decimal; // Changed from ratePerNight
    totalAmount: Decimal;
  }>;
  payments: Array<{
    id: string;
    amount: Decimal;
    currency: string;
    status: PaymentStatus; // Changed from string
    method: PaymentMethod; // Changed from paymentMethod: string | null
    createdAt: Date;
  }>;
}

export const getAllReservations = cache(async (
  businessUnitId?: string,
  status?: ReservationStatus,
  limit?: number
): Promise<ReservationData[]> => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        ...(businessUnitId && { businessUnitId }),
        ...(status && { status }),
      },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            country: true,
          },
        },
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
            city: true,
            country: true,
          },
        },
        rooms: {
          include: {
            room: { // Correctly include the `room` model to access its properties
              select: {
                id: true,
                roomNumber: true,
                roomType: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            method: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
      ...(limit && { take: limit }),
    });

    // Data mapping to match the ReservationData interface
    return reservations.map(reservation => ({
      id: reservation.id,
      confirmationNumber: reservation.confirmationNumber,
      status: reservation.status,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      nights: reservation.nights,
      adults: reservation.adults,
      children: reservation.children,
      totalAmount: reservation.totalAmount,
      currency: reservation.currency,
      specialRequests: reservation.specialRequests,
      internalNotes: reservation.internalNotes, // Mapped to correct field
      source: reservation.source,
      paymentStatus: reservation.paymentStatus, // Mapped to correct field
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      guest: reservation.guest,
      businessUnit: reservation.businessUnit,
      rooms: reservation.rooms.map(room => ({
        id: room.id, // ID is from ReservationRoom
        room: room.room ? {
          id: room.room.id,
          roomNumber: room.room.roomNumber,
          roomType: room.room.roomType,
        } : undefined,
        baseRate: room.baseRate,
        totalAmount: room.totalAmount,
      })),
      payments: reservation.payments,
    }));
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    return [];
  }
});

export const getReservationById = cache(async (id: string): Promise<ReservationData | null> => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            country: true,
          },
        },
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
            city: true,
            country: true,
          },
        },
        rooms: {
          include: {
            room: {
              select: {
                id: true,
                roomNumber: true,
                roomType: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            method: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!reservation) return null;

    // Data mapping to match the ReservationData interface
    return {
      id: reservation.id,
      confirmationNumber: reservation.confirmationNumber,
      status: reservation.status,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      nights: reservation.nights,
      adults: reservation.adults,
      children: reservation.children,
      totalAmount: reservation.totalAmount,
      currency: reservation.currency,
      specialRequests: reservation.specialRequests,
      internalNotes: reservation.internalNotes, // Mapped to correct field
      source: reservation.source,
      paymentStatus: reservation.paymentStatus, // Mapped to correct field
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      guest: reservation.guest,
      businessUnit: reservation.businessUnit,
      rooms: reservation.rooms.map(room => ({
        id: room.id,
        room: room.room ? {
          id: room.room.id,
          roomNumber: room.room.roomNumber,
          roomType: room.room.roomType,
        } : undefined,
        baseRate: room.baseRate,
        totalAmount: room.totalAmount,
      })),
      payments: reservation.payments,
    };
  } catch (error) {
    console.error('Error fetching reservation by ID:', error);
    return null;
  }
});

export const getRecentReservations = cache(async (limit: number = 10): Promise<ReservationData[]> => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            country: true,
          },
        },
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
            city: true,
            country: true,
          },
        },
        rooms: {
          include: {
            room: {
              select: {
                id: true,
                roomNumber: true,
                roomType: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            method: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Data mapping to match the ReservationData interface
    return reservations.map(reservation => ({
      id: reservation.id,
      confirmationNumber: reservation.confirmationNumber,
      status: reservation.status,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      nights: reservation.nights,
      adults: reservation.adults,
      children: reservation.children,
      totalAmount: reservation.totalAmount,
      currency: reservation.currency,
      specialRequests: reservation.specialRequests,
      internalNotes: reservation.internalNotes, // Mapped to correct field
      source: reservation.source,
      paymentStatus: reservation.paymentStatus, // Mapped to correct field
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      guest: reservation.guest,
      businessUnit: reservation.businessUnit,
      rooms: reservation.rooms.map(room => ({
        id: room.id,
        room: room.room ? {
          id: room.room.id,
          roomNumber: room.room.roomNumber,
          roomType: room.room.roomType,
        } : undefined,
        baseRate: room.baseRate,
        totalAmount: room.totalAmount,
      })),
      payments: reservation.payments,
    }));
  } catch (error) {
    console.error('Error fetching recent reservations:', error);
    return [];
  }
});