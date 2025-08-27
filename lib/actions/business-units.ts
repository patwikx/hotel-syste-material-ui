// lib/actions/business-units.ts
'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BusinessUnitData {
  id: string;
  name: string;
  displayName: string;
  city: string;
  state: string | null;
  country: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  slug: string;
  shortDescription: string | null;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  primaryColor: string | null;
  secondaryColor: string | null;
  logo: string | null;
  propertyType: string;
}

export async function getBusinessUnits(): Promise<BusinessUnitData[]> {
  try {
    const businessUnits = await prisma.businessUnit.findMany({
      where: {
        isActive: true,
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        city: true,
        state: true,
        country: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        slug: true,
        shortDescription: true,
        isActive: true,
        isPublished: true,
        isFeatured: true,
        sortOrder: true,
        primaryColor: true,
        secondaryColor: true,
        logo: true,
        propertyType: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return businessUnits;
  } catch (error) {
    console.error('Failed to fetch business units:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export async function getFeaturedBusinessUnits(): Promise<BusinessUnitData[]> {
  try {
    const businessUnits = await prisma.businessUnit.findMany({
      where: {
        isActive: true,
        isPublished: true,
        isFeatured: true,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        city: true,
        state: true,
        country: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        slug: true,
        shortDescription: true,
        isActive: true,
        isPublished: true,
        isFeatured: true,
        sortOrder: true,
        primaryColor: true,
        secondaryColor: true,
        logo: true,
        propertyType: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return businessUnits;
  } catch (error) {
    console.error('Failed to fetch featured business units:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}