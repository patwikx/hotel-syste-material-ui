'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import { LocationOn, Phone, Email, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { businessUnits } from '../data/businessUnits';

// Create motion variants for the animations
const cardVariants = {
  hiddenLeft: {
    opacity: 0,
    x: -1200, // Start from far left (fixed value)
    scale: 0.9
  },
  hiddenRight: {
    opacity: 0,
    x: 1200, // Start from far right (fixed value)
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1
  }
};

const Maps: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateMapUrl = (lat: number, lng: number, name: string): string => {
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaQzuU17R8&q=${encodeURIComponent(name)}&center=${lat},${lng}&zoom=15`;
  };

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
            Global Locations
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
            FIND OUR
            <br />
            PROPERTIES
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
            Discover our luxurious properties across prime locations. Each destination offers
            unique experiences and world-class amenities.
          </Typography>
        </Box>

        {/* Properties List */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 6, md: 8 },
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {businessUnits.map((property, index) => {
            const isEven = index % 2 === 0;
            
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
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      '& .map-overlay': {
                        opacity: 0.7,
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
                      minHeight: { xs: 'auto', md: '450px' },
                    }}
                  >
                    {/* Map Section */}
                    <Box 
                      sx={{ 
                        flex: { xs: '1', md: '0 0 50%' },
                        position: 'relative',
                        overflow: 'hidden',
                        height: { xs: '320px', md: '450px' },
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${property.coordinates.lat},${property.coordinates.lng}&zoom=13&size=600x450&markers=color:red%7C${property.coordinates.lat},${property.coordinates.lng}&key=YOUR_API_KEY)`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#1f2937',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Map Overlay */}
                        <Box
                          className="map-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(17, 24, 39, 0.4)',
                            transition: 'opacity 0.3s ease',
                          }}
                        />
                        
                        {/* Location Indicator */}
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: 2,
                            backgroundColor: 'white',
                            color: '#111827',
                            p: 4,
                            textAlign: 'center',
                            maxWidth: '300px',
                          }}
                        >
                          <LocationOn sx={{ fontSize: 40, mb: 2, color: '#111827' }} />
                          <Typography 
                            sx={{ 
                              fontWeight: 700,
                              fontSize: '1.25rem',
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                            }}
                          >
                            {property.name}
                          </Typography>
                          <Typography sx={{ color: '#6b7280', fontWeight: 500 }}>
                            {property.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Content Section */}
                    <Box 
                      sx={{ 
                        flex: { xs: '1', md: '0 0 50%' },
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardContent 
                        sx={{ 
                          p: { xs: 4, md: 6 },
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                        }}
                      >
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
                          }}
                        >
                          {property.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          sx={{
                            color: '#6b7280',
                            fontSize: { xs: '1.1rem', md: '1.2rem' },
                            lineHeight: 1.6,
                            mb: 5,
                            fontWeight: 400,
                            maxWidth: '400px',
                            mx: { xs: 'auto', md: isEven ? '0' : 'auto' },
                            ml: { md: isEven ? '0' : 'auto' },
                          }}
                        >
                          {property.description}
                        </Typography>

                        {/* Amenities */}
                        <Box sx={{ mb: 5 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#111827',
                              mb: 3,
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                            }}
                          >
                            Key Amenities
                          </Typography>
                          <Stack 
                            direction="row" 
                            spacing={2} 
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
                              <Chip
                                key={amenity}
                                label={amenity}
                                sx={{
                                  backgroundColor: '#111827',
                                  color: 'white',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  borderRadius: 0,
                                  height: 32,
                                  '&:hover': {
                                    backgroundColor: '#1f2937',
                                  },
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>

                        {/* Contact Info */}
                        <Box sx={{ mb: 6 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#111827',
                              mb: 3,
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                            }}
                          >
                            Contact Information
                          </Typography>
                          <Stack 
                            spacing={2}
                            sx={{
                              alignItems: { 
                                xs: 'center', 
                                md: isEven ? 'flex-start' : 'flex-end' 
                              },
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              flexDirection: { xs: 'row', md: isEven ? 'row' : 'row-reverse' },
                            }}>
                              <LocationOn sx={{ 
                                color: '#6b7280',
                                fontSize: 20,
                                mx: 1,
                              }} />
                              <Typography 
                                sx={{ 
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                }}
                              >
                                {property.location}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              flexDirection: { xs: 'row', md: isEven ? 'row' : 'row-reverse' },
                            }}>
                              <Phone sx={{ 
                                color: '#6b7280',
                                fontSize: 20,
                                mx: 1,
                              }} />
                              <Typography 
                                sx={{ 
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                }}
                              >
                                +1 (555) 123-4567
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              flexDirection: { xs: 'row', md: isEven ? 'row' : 'row-reverse' },
                            }}>
                              <Email sx={{ 
                                color: '#6b7280',
                                fontSize: 20,
                                mx: 1,
                              }} />
                              <Typography 
                                sx={{ 
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                }}
                              >
                                info@{property.name.toLowerCase().replace(/\s+/g, '')}.com
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        {/* Get Directions Button */}
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
                            Get Directions
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
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: { xs: 12, md: 20 },
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
            Ready to visit
            <br />
            our locations?
          </Typography>
          
          <Button
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
            Plan Your Visit
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Maps;