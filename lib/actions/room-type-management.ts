'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { Decimal } from '@prisma/client/runtime/library';

export interface ActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export interface RoomTypeData {
  id: string;
  businessUnitId: string;
  name: string;
  displayName: string;
  description: string | null;
  type: 'STANDARD' | 'DELUXE' | 'SUITE' | 'VILLA' | 'PENTHOUSE' | 'FAMILY' | 'ACCESSIBLE';
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  maxInfants: number;
  bedConfiguration: string | null;
  roomSize: number | null;
  hasBalcony: boolean;
  hasOceanView: boolean;
  hasPoolView: boolean;
  hasKitchenette: boolean;
  hasLivingArea: boolean;
  smokingAllowed: boolean;
  petFriendly: boolean;
  isAccessible: boolean;
  baseRate: string; // Stored as a string for API, converted from Decimal
  extraPersonRate: string | null;
  extraChildRate: string | null;
  floorPlan: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  businessUnit: {
    id: string;
    name: string;
    displayName: string;
  };
  _count: {
    rooms: number;
  };
}

export interface CreateRoomTypeData {
  name: string;
  displayName: string;
  description: string | null;
  type: 'STANDARD' | 'DELUXE' | 'SUITE' | 'VILLA' | 'PENTHOUSE' | 'FAMILY' | 'ACCESSIBLE';
  baseRate: number;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  maxInfants: number;
  bedConfiguration: string | null;
  roomSize: number | null;
  hasBalcony: boolean;
  hasOceanView: boolean;
  hasPoolView: boolean;
  hasKitchenette: boolean;
  hasLivingArea: boolean;
  smokingAllowed: boolean;
  petFriendly: boolean;
  isAccessible: boolean;
  extraPersonRate: number | null;
  extraChildRate: number | null;
  floorPlan: string | null;
  isActive: boolean;
  sortOrder: number;
  businessUnitId: string;
}

export interface UpdateRoomTypeData extends CreateRoomTypeData {
  id: string;
}

export async function getRoomTypes(businessUnitId?: string): Promise<RoomTypeData[]> {
  try {
    const roomTypes = await prisma.roomType_Model.findMany({
      where: {
        ...(businessUnitId && { businessUnitId }),
      },
      include: {
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            rooms: true,
          },
        },
      },
      orderBy: [
        { businessUnitId: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return roomTypes.map(roomType => ({
      ...roomType,
      baseRate: roomType.baseRate.toString(),
      extraPersonRate: roomType.extraPersonRate?.toString() ?? null,
      extraChildRate: roomType.extraChildRate?.toString() ?? null,
      roomSize: roomType.roomSize?.toNumber() ?? null,
      // You may need to handle the `type` enum based on your `RoomType` enum
      type: roomType.type as RoomTypeData['type'], // Explicitly cast the type
    }));
  } catch (error) {
    console.error('Error fetching room types:', error);
    return [];
  }
}

export async function getRoomTypeById(id: string): Promise<RoomTypeData | null> {
  try {
    const roomType = await prisma.roomType_Model.findUnique({
      where: { id },
      include: {
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    });

    if (!roomType) return null;

    return {
      ...roomType,
      baseRate: roomType.baseRate.toString(),
      extraPersonRate: roomType.extraPersonRate?.toString() ?? null,
      extraChildRate: roomType.extraChildRate?.toString() ?? null,
      roomSize: roomType.roomSize?.toNumber() ?? null,
      // Explicitly cast the type
      type: roomType.type as RoomTypeData['type'],
    };
  } catch (error) {
    console.error('Error fetching room type by ID:', error);
    return null;
  }
}

export async function createRoomType(data: CreateRoomTypeData): Promise<ActionResult> {
  try {
    await prisma.roomType_Model.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        type: data.type,
        baseRate: new Decimal(data.baseRate),
        maxOccupancy: data.maxOccupancy,
        maxAdults: data.maxAdults,
        maxChildren: data.maxChildren,
        maxInfants: data.maxInfants,
        bedConfiguration: data.bedConfiguration,
        roomSize: data.roomSize,
        hasBalcony: data.hasBalcony,
        hasOceanView: data.hasOceanView,
        hasPoolView: data.hasPoolView,
        hasKitchenette: data.hasKitchenette,
        hasLivingArea: data.hasLivingArea,
        smokingAllowed: data.smokingAllowed,
        petFriendly: data.petFriendly,
        isAccessible: data.isAccessible,
        extraPersonRate: data.extraPersonRate,
        extraChildRate: data.extraChildRate,
        floorPlan: data.floorPlan,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        businessUnitId: data.businessUnitId,
      }
    });

    revalidatePath('/admin/operations/room-types');

    return {
      success: true,
      message: 'Room type created successfully'
    };
  } catch (error) {
    console.error('Error creating room type:', error);
    return {
      success: false,
      message: 'Failed to create room type'
    };
  }
}

export async function updateRoomType(data: UpdateRoomTypeData): Promise<ActionResult> {
  try {
    await prisma.roomType_Model.update({
      where: { id: data.id },
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        type: data.type,
        baseRate: new Decimal(data.baseRate),
        maxOccupancy: data.maxOccupancy,
        maxAdults: data.maxAdults,
        maxChildren: data.maxChildren,
        maxInfants: data.maxInfants,
        bedConfiguration: data.bedConfiguration,
        roomSize: data.roomSize,
        hasBalcony: data.hasBalcony,
        hasOceanView: data.hasOceanView,
        hasPoolView: data.hasPoolView,
        hasKitchenette: data.hasKitchenette,
        hasLivingArea: data.hasLivingArea,
        smokingAllowed: data.smokingAllowed,
        petFriendly: data.petFriendly,
        isAccessible: data.isAccessible,
        extraPersonRate: data.extraPersonRate,
        extraChildRate: data.extraChildRate,
        floorPlan: data.floorPlan,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        businessUnitId: data.businessUnitId,
        updatedAt: new Date(),
      }
    });

    revalidatePath('/admin/operations/room-types');

    return {
      success: true,
      message: 'Room type updated successfully'
    };
  } catch (error) {
    console.error('Error updating room type:', error);
    return {
      success: false,
      message: 'Failed to update room type'
    };
  }
}

export async function deleteRoomType(id: string): Promise<ActionResult> {
  try {
    await prisma.roomType_Model.delete({
      where: { id }
    });

    revalidatePath('/admin/operations/room-types');

    return {
      success: true,
      message: 'Room type deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting room type:', error);
    return {
      success: false,
      message: 'Failed to delete room type'
    };
  }
}

export async function toggleRoomTypeStatus(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    await prisma.roomType_Model.update({
      where: { id },
      data: { 
        isActive,
        updatedAt: new Date()
      }
    });

    revalidatePath('/admin/operations/room-types');

    return {
      success: true,
      message: `Room type ${isActive ? 'activated' : 'deactivated'} successfully`
    };
  } catch (error) {
    console.error('Error toggling room type status:', error);
    return {
      success: false,
      message: 'Failed to update room type status'
    };
  }
}