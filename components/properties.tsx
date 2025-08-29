'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import {
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BusinessUnitData } from '../types/properties';


// Create motion variants for the animations
const cardVariants = {
  hiddenLeft: {
    opacity: 0,
    x: -1200,
    scale: 0.9
  },
  hiddenRight: {
    opacity: 0,
    x: 1200,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1
  }
};

interface PropertiesProps {
  properties: BusinessUnitData[];
}

const Properties: React.FC<PropertiesProps> = ({ properties }) => {
  // State to track current image index for each property
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  // Initialize image indices
  useEffect(() => {
    const initialIndices: { [key: string]: number } = {};
    properties.forEach((property) => {
      initialIndices[property.id] = 0;
    });
    setCurrentImageIndex(initialIndices);
  }, [properties]);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndices = { ...prev };
        properties.forEach((property) => {
          const imageCount = property.images?.length || 1;
          newIndices[property.id] = (newIndices[property.id] + 1) % imageCount;
        });
        return newIndices;
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [properties]);

  // Helper function to get property location
  const getPropertyLocation = (property: BusinessUnitData): string => {
    const parts = [property.city, property.state, property.country]
      .filter(part => part && part !== 'Philippines') // Don't show Philippines as it's default
      .filter(Boolean);
    return parts.join(', ');
  };

  // Helper function to get property images
  const getPropertyImages = (property: BusinessUnitData): string[] => {
    if (!property.images || property.images.length === 0) {
      return ['/images/default-property.jpg']; // Fallback image
    }
    return property.images.map(img => img.image.originalUrl);
  };

  if (!properties || properties.length === 0) {
    return (
      <Box sx={{ py: 16, textAlign: 'center' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" color="text.secondary">
            No properties available at the moment.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 16 },
        backgroundColor: '#f8f9fa',
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="overline"
            sx={{
              color: '#6b7280',
              fontWeight: 700,
              letterSpacing: 3,
              fontSize: '0.875rem',
              mb: 2,
              display: 'block',
              textTransform: 'uppercase',
            }}
          >
            Premium Properties
          </Typography>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.75rem', md: '4rem', lg: '5rem' },
              lineHeight: { xs: 0.9, md: 0.85 },
              color: '#111827',
              mb: 4,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            HOTEL & RESORTS
          </Typography>
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 400,
              mt: 3,
            }}
          >
            Discover world-class hotels and resorts, each offering unique experiences 
            tailored to create unforgettable memories.
          </Typography>
        </Box>
      </Container>

      {/* Properties List - Full Width */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
        }}
      >
        {properties.map((property, index) => {
          const isEven = index % 2 === 0;
          const propertyImages = getPropertyImages(property);
          const currentIndex = currentImageIndex[property.id] || 0;
          const location = getPropertyLocation(property);
          
          return (
            <motion.div
              key={property.id}
              initial={isEven ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                type: "tween"
              }}
            >
              <Card
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 0,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: 'none',
                  width: '100vw',
                  position: 'relative',
                  left: '50%',
                  right: '50%',
                  marginLeft: '-50vw',
                  marginRight: '-50vw',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    '& .property-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { 
                      xs: 'column', 
                      md: isEven ? 'row' : 'row-reverse' 
                    },
                    minHeight: { xs: 'auto', md: '500px' },
                    maxWidth: '100%',
                  }}
                >
                  {/* Image Section with Slideshow */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      position: 'relative',
                      overflow: 'hidden',
                      height: { xs: '350px', md: 'auto' },
                      minHeight: { md: '100%' },
                    }}
                  >
                    {/* Image Container */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={propertyImages[currentIndex]}
                        alt={property.images[currentIndex]?.image.altText || `${property.displayName || property.name} - Image ${currentIndex + 1}`}
                        className="property-image"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />

                      {/* Image Overlay for Better Text Visibility */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                        }}
                      />
                    </Box>

                    {/* Image Indicators */}
                    {propertyImages.length > 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: 1,
                          zIndex: 2,
                        }}
                      >
                        {propertyImages.map((_, imgIndex: number) => (
                          <Box
                            key={imgIndex}
                            onClick={() => setCurrentImageIndex(prev => ({
                              ...prev,
                              [property.id]: imgIndex
                            }))}
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: imgIndex === currentIndex 
                                ? 'white' 
                                : 'rgba(255, 255, 255, 0.5)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'white',
                                transform: 'scale(1.2)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {/* Property Type Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        [isEven ? 'right' : 'left']: 24,
                        backgroundColor: 'white',
                        px: 3,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 2,
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '0.875rem',
                          textTransform: 'capitalize',
                        }}
                      >
                        {property.propertyType.toLowerCase().replace('_', ' ')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content Section */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      display: 'flex',
                      flexDirection: 'column',
                      maxWidth: '100%',
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: { xs: 4, md: 8 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                        maxWidth: '100%',
                      }}
                    >
                      {/* Property Number */}
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#6b7280',
                          mb: 2,
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                        }}
                      >
                        Property {String(index + 1).padStart(2, '0')}
                      </Typography>

                      {/* Property Name */}
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                          color: '#111827',
                          mb: 3,
                          letterSpacing: '-0.02em',
                          lineHeight: 0.9,
                          textTransform: 'uppercase',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          wordBreak: 'break-word',
                        }}
                      >
                        {property.displayName || property.name}
                      </Typography>
                      
                      {/* Location */}
                      {location && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 4,
                          justifyContent: { 
                            xs: 'center', 
                            md: isEven ? 'flex-start' : 'flex-end' 
                          },
                        }}>
                          <LocationOn sx={{ 
                            color: '#6b7280',
                            mr: 1,
                            fontSize: 20,
                          }} />
                          <Typography 
                            sx={{ 
                              color: '#6b7280',
                              fontWeight: 600,
                              fontSize: '1rem',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                            }}
                          >
                            {location}
                          </Typography>
                        </Box>
                      )}

                      {/* Description */}
                      <Typography
                        sx={{
                          color: '#6b7280',
                          fontSize: { xs: '1.1rem', md: '1.2rem' },
                          lineHeight: 1.6,
                          mb: 5,
                          fontWeight: 400,
                          maxWidth: '500px',
                          mx: { xs: 'auto', md: isEven ? '0' : 'auto' },
                          ml: { md: isEven ? '0' : 'auto' },
                        }}
                      >
                        {property.shortDescription || property.description || 'Experience luxury and comfort in this exceptional property.'}
                      </Typography>

                      {/* Featured Amenities */}
                      {property.amenities && property.amenities.length > 0 && (
                        <Box sx={{ mb: 5 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#111827',
                              mb: 2,
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                            }}
                          >
                            Featured Amenities
                          </Typography>
                          <Stack 
                            direction="row" 
                            spacing={3} 
                            sx={{ 
                              flexWrap: 'wrap', 
                              gap: 2,
                              justifyContent: { 
                                xs: 'center', 
                                md: isEven ? 'flex-start' : 'flex-end' 
                              },
                            }}
                          >
                            {property.amenities.slice(0, 3).map((amenity) => (
                              <Typography
                                key={amenity.id}
                                sx={{
                                  fontSize: '0.95rem',
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  position: 'relative',
                                  '&::before': {
                                    content: '"•"',
                                    color: '#111827',
                                    fontWeight: 700,
                                    mr: 1,
                                  }
                                }}
                              >
                                {amenity.name}
                              </Typography>
                            ))}
                            {property.amenities.length > 3 && (
                              <Typography
                                sx={{
                                  fontSize: '0.95rem',
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  position: 'relative',
                                  '&::before': {
                                    content: '"•"',
                                    color: '#111827',
                                    fontWeight: 700,
                                    mr: 1,
                                  }
                                }}
                              >
                                +{property.amenities.length - 3} more
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      )}

                      {/* Property Stats */}
                      <Box sx={{ mb: 5 }}>
                        <Stack 
                          direction="row" 
                          spacing={4} 
                          sx={{ 
                            justifyContent: { 
                              xs: 'center', 
                              md: isEven ? 'flex-start' : 'flex-end' 
                            },
                          }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#111827' }}>
                              {property._count.rooms}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                              Rooms
                            </Typography>
                          </Box>
                          {property._count.restaurants > 0 && (
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#111827' }}>
                                {property._count.restaurants}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                                Restaurants
                              </Typography>
                            </Box>
                          )}
                          {property._count.specialOffers > 0 && (
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#111827' }}>
                                {property._count.specialOffers}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                                Offers
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      {/* Explore Button */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: { 
                            xs: 'center', 
                            md: isEven ? 'flex-start' : 'flex-end' 
                          },
                        }}
                      >
                        <Button
                          endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                          href={`/properties/${property.slug}`}
                          sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            px: 6,
                            py: 2.5,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            borderRadius: 0,
                            minWidth: '200px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#1f2937',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 12px 24px rgba(17, 24, 39, 0.3)',
                            },
                          }}
                        >
                          Explore Property
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      {/* Bottom Section */}
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: '#111827',
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
            }}
          >
            Ready for your next
            <br />
            luxury experience?
          </Typography>
          
          <Button
            href="/reservations"
            sx={{
              backgroundColor: '#111827',
              color: 'white',
              px: 10,
              py: 3.5,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: 0,
              mt: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#1f2937',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 24px rgba(17, 24, 39, 0.3)',
              },
            }}
          >
            Book Your Stay
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Properties;