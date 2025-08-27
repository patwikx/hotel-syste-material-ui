'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  Fade,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Hotel as HotelIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  ArrowForward,
} from '@mui/icons-material';
import Image from 'next/image';
import { BusinessUnitData } from '../lib/actions/business-units';


interface HeaderProps {
  businessUnits: BusinessUnitData[];
}

const Header: React.FC<HeaderProps> = ({ businessUnits }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const dropdownRef = useRef<HTMLDivElement>(null);
  const propertiesButtonRef = useRef<HTMLButtonElement>(null);

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        propertiesButtonRef.current &&
        !propertiesButtonRef.current.contains(event.target as Node)
      ) {
        setPropertiesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, propertiesButtonRef]);

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handlePropertiesToggle = () => {
    setPropertiesDropdownOpen(!propertiesDropdownOpen);
  };

  const handlePropertyClick = (slug: string) => {
    // Navigate to property page
    window.location.href = `/properties/${slug}`;
  };

  const handleViewAllProperties = () => {
    window.location.href = '/properties';
  };

  const navigationItems = [
    'Properties',
    'Restaurants',
    'Events',
    'Offers',
    'About',
    'Contact'
  ];

  const formatLocation = (businessUnit: BusinessUnitData): string => {
    const parts = [businessUnit.address, businessUnit.city];
    if (businessUnit.state) {
      parts.push(businessUnit.state);
    }
    return parts.filter(Boolean).join(', ');
  };

  const drawerContent = (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#111827',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 3,
        }}
      >
        <IconButton
          onClick={handleMobileDrawerToggle}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HotelIcon sx={{ color: 'white', mr: 2, fontSize: 30 }} />
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '1.8rem',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Tropicana
            <br />
            Worldwide
          </Typography>
        </Box>
        <Typography
          sx={{
            color: '#6b7280',
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Premium Hospitality
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: 4 }}>
        {navigationItems.map((item, index) => (
          <Box key={item}>
            <Button
              onClick={handleMobileDrawerToggle}
              sx={{
                width: '100%',
                textAlign: 'left',
                justifyContent: 'flex-start',
                py: 3,
                px: 0,
                color: 'white',
                fontSize: '2rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  transform: 'translateX(20px)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#6b7280',
                  mr: 3,
                  minWidth: '40px',
                  textAlign: 'right',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </Typography>
              {item}
            </Button>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 4 }}>
        <Button
          endIcon={<ArrowForward />}
          onClick={handleMobileDrawerToggle}
          sx={{
            width: '100%',
            backgroundColor: 'white',
            color: '#111827',
            py: 3,
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderRadius: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 24px rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Book Your Experience
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
<Toolbar
  sx={{
    justifyContent: 'space-between',
    py: 2,
    minHeight: '70px', // Or any fixed height you want
  }}
>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image 
                src="https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCV0y3FUvkBwoHGKNiCbEI9uWYstSRk5rXgMLfx" 
                height={60} 
                width={60} 
                alt="TWC Logo" 
                className='mr-4' 
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.4rem', md: '1.8rem' },
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    lineHeight: 0.9,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Tropicana
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.4rem', md: '1.8rem' },
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    lineHeight: 0.9,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Worldwide
                </Typography>
              </Box>
            </Box>

            {isMobile ? (
              <IconButton
                onClick={handleMobileDrawerToggle}
                sx={{
                  color: '#111827',
                  backgroundColor: 'rgba(17, 24, 39, 0.05)',
                  p: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(17, 24, 39, 0.1)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <MenuIcon sx={{ fontSize: 24 }} />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navigationItems.map((item) => (
                  <Box
                    key={item}
                    sx={{ position: 'relative' }}
                  >
                    <Button
                      ref={item === 'Properties' ? propertiesButtonRef : null}
                      onClick={item === 'Properties' ? handlePropertiesToggle : undefined}
                      sx={{
                        color: '#6b7280',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        px: 3,
                        py: 2,
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#111827',
                          backgroundColor: 'transparent',
                          transform: 'translateY(-2px)',
                          '&::after': {
                            width: '100%',
                            opacity: 1,
                          },
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: '2px',
                          backgroundColor: '#111827',
                          transition: 'all 0.3s ease',
                          opacity: 0,
                        },
                      }}
                    >
                      {item}
                    </Button>

                    {item === 'Properties' && (
                      <Fade in={propertiesDropdownOpen} timeout={300}>
                        <Paper
                          ref={dropdownRef}
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            mt: 1,
                            width: '800px',
                            backgroundColor: 'white',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                            borderRadius: 0,
                            overflow: 'hidden',
                            zIndex: 1300,
                            border: '1px solid rgba(107, 114, 128, 0.1)',
                            opacity: propertiesDropdownOpen ? 1 : 0,
                            visibility: propertiesDropdownOpen ? 'visible' : 'hidden',
                          }}
                        >
                          <Box sx={{ p: 4 }}>
                            <Box sx={{ mb: 4 }}>
                              <Typography
                                sx={{
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: '#6b7280',
                                  textTransform: 'uppercase',
                                  letterSpacing: '2px',
                                  mb: 1,
                                }}
                              >
                                Our Properties
                              </Typography>
                              <Typography
                                sx={{
                                  fontWeight: 900,
                                  fontSize: '1.8rem',
                                  color: '#111827',
                                  textTransform: 'uppercase',
                                  letterSpacing: '-0.02em',
                                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                }}
                              >
                                Premium Hotels & Resorts
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 3,
                              }}
                            >
                              {businessUnits.map((property) => (
                                <Box
                                  key={property.id}
                                  onClick={() => handlePropertyClick(property.slug)}
                                  sx={{
                                    width: 'calc(50% - 12px)',
                                    cursor: 'pointer',
                                    p: 2,
                                    borderRadius: 1,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      backgroundColor: '#111827',
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                      '& .property-name': {
                                        color: 'white',
                                      },
                                      '& .property-location': {
                                        color: '#f8f9fa',
                                      },
                                    },
                                  }}
                                >
                                  <Typography
                                    className="property-name"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '1rem',
                                      color: '#6b7280',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      mb: 1,
                                      transition: 'color 0.3s ease',
                                    }}
                                  >
                                    {property.displayName}
                                  </Typography>
                                  <Typography
                                    className="property-location"
                                    sx={{
                                      fontSize: '0.875rem',
                                      color: '#9ca3af',
                                      fontWeight: 500,
                                      transition: 'color 0.3s ease',
                                    }}
                                  >
                                    {formatLocation(property)}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>

                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                              <Button
                                onClick={handleViewAllProperties}
                                sx={{
                                  backgroundColor: '#111827',
                                  color: 'white',
                                  px: 6,
                                  py: 2,
                                  fontSize: '0.875rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                  borderRadius: 0,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: '#1f2937',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 16px rgba(17, 24, 39, 0.25)',
                                  },
                                }}
                              >
                                View All Properties
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      </Fade>
                    )}
                  </Box>
                ))}

                <Button
                  endIcon={<PhoneIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    ml: 4,
                    backgroundColor: '#111827',
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRadius: 0,
                    minWidth: '140px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#1f2937',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(17, 24, 39, 0.25)',
                    },
                  }}
                >
                  Book Now
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="top"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;