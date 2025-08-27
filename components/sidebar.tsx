'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Badge,
  IconButton,
  alpha,
  SvgIcon,
} from '@mui/material';
import {
  Dashboard,
  Hotel,
  People,
  Person,
  Bed,
  EventSeat,
  Payment,
  Receipt,
  LocalOffer,
  Restaurant,
  RateReview,
  Settings,
  Security,
  Analytics,
  Notifications,
  ContactMail,
  Email,
  Help,
  Assignment,
  CleaningServices,
  Build,
  FeedbackOutlined,
  BusinessCenter,
  AccountBalance,
  CreditCard,
  MonetizationOn,
  TrendingUp,
  Groups,
  PersonAdd,
  BookOnline,
  CheckCircle,
  Schedule,
  RoomService,
  HomeWork,
  Category,
  Inventory,
  CampaignOutlined,
  LocalDining,
  CalendarMonth,
  Star,
  QuestionAnswer,
  Web,
  PublicOutlined,
  SearchOutlined,
  AnnouncementOutlined,
  KeyboardArrowLeft,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const DRAWER_WIDTH = 350;
const COLLAPSED_WIDTH = 80;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  // New props for dynamic counts
  totalReservationsBadge: number;
  checkInsBadge: number;
  checkOutsBadge: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: typeof SvgIcon;
  badge?: number;
  children?: MenuItem[];
  path?: string;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  activeSection = 'dashboard',
  onSectionChange,
  totalReservationsBadge,
  checkInsBadge,
  checkOutsBadge,
}) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([])
  );

  const toggleExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Menu sections now use the new props for badge counts
  const menuSections: MenuSection[] = [
    {
      id: 'overview',
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Dashboard,
          path: '/admin'
        },
      ]
    },
    {
      id: 'operations',
      title: 'OPERATIONS',
      items: [
        {
          id: 'properties',
          label: 'Properties & Rooms',
          icon: Hotel,
          children: [
            { id: 'business-units', label: 'Business Units', icon: BusinessCenter, path: '/admin/operations/properties' },
            { id: 'room-types', label: 'Room Types', icon: Category, path: '/admin/operations/room-types' },
            { id: 'rooms', label: 'Rooms', icon: Bed, path: '/admin/operations/rooms' },
            { id: 'amenities', label: 'Amenities', icon: EventSeat, path: '/admin/operations/amenities' },
          ]
        },
        {
          id: 'reservations',
          label: 'Reservations',
          icon: BookOnline,
          badge: totalReservationsBadge, // Dynamic count
          children: [
            { id: 'reservation-list', label: 'All Reservations', icon: Assignment, path: '/admin/operations/reservations' },
            { id: 'check-ins', label: 'Check-ins Today', icon: CheckCircle, badge: checkInsBadge, path: '/admin/operations/check-ins' }, // Dynamic count
            { id: 'check-outs', label: 'Check-outs Today', icon: Schedule, badge: checkOutsBadge, path: '/admin/operations/check-outs' }, // Dynamic count
            { id: 'stays', label: 'Current Stays', icon: HomeWork, path: '/admin/operations/stays' },
          ]
        },
        {
          id: 'guests',
          label: 'Guest Management',
          icon: People,
          children: [
            { id: 'guest-list', label: 'Guest Directory', icon: Person, path: '/admin/operations/guests' },
            { id: 'guest-interactions', label: 'Guest Interactions', icon: RateReview, path: '/admin/operations/guest-interactions' },
          ]
        },
        {
          id: 'payments',
          label: 'Payments & Billing',
          icon: Payment,
          children: [
            { id: 'payments-list', label: 'All Payments', icon: CreditCard, path: '/admin/operations/payments' },
            { id: 'payment-summaries', label: 'Payment Analytics', icon: TrendingUp, path: '/admin/operations/payment-analytics' },
            { id: 'incidental-charges', label: 'Incidental Charges', icon: Receipt, path: '/admin/operations/incidental-charges' },
            { id: 'paymongo-integration', label: 'PayMongo Integration', icon: AccountBalance, path: '/admin/operations/paymongo' },
            { id: 'charges-folios', label: 'Charges & Folios', icon: MonetizationOn, path: '/admin/operations/charges' },
          ]
        },
        {
          id: 'operations-hotel',
          label: 'Hotel Operations',
          icon: RoomService,
          children: [
            { id: 'service-requests', label: 'Service Requests', icon: Assignment, badge: 3, path: '/admin/operations/service-requests' },
            { id: 'tasks', label: 'Tasks & Assignments', icon: Assignment, path: '/admin/operations/tasks' },
            { id: 'housekeeping', label: 'Housekeeping', icon: CleaningServices, path: '/admin/operations/housekeeping' },
            { id: 'maintenance', label: 'Maintenance', icon: Build, path: '/admin/operations/maintenance' },
            { id: 'departments', label: 'Departments', icon: Groups, path: '/admin/operations/departments' },
          ]
        },
        {
          id: 'dining',
          label: 'Restaurants & Dining',
          icon: Restaurant,
          children: [
            { id: 'restaurants', label: 'Restaurants', icon: LocalDining, path: '/admin/operations/restaurants' },
            { id: 'menu-management', label: 'Menu Management', icon: Inventory, path: '/admin/operations/menus' },
            { id: 'restaurant-reservations', label: 'Dining Reservations', icon: EventSeat, path: '/admin/operations/dining-reservations' },
          ]
        },
      ]
    },
    {
      id: 'content',
      title: 'CONTENT & MARKETING',
      items: [
        {
          id: 'marketing',
          label: 'Marketing & Offers',
          icon: LocalOffer,
          children: [
            { id: 'event-bookings', label: 'Event Bookings', icon: BookOnline, path: '/admin/event-bookings' },
            { id: 'promos-vouchers', label: 'Promos & Vouchers', icon: CampaignOutlined, path: '/admin/promos' },
          ]
        },
        {
          id: 'cms',
          label: 'Content Management',
          icon: Web,
          children: [
            { id: 'heroes', label: 'Hero Sections', icon: PublicOutlined, path: '/admin/cms/hero' },
            { id: 'special-offers', label: 'Special Offers', icon: LocalOffer, path: '/admin/cms/special-offers' },
            { id: 'events-list', label: 'Events', icon: CalendarMonth, path: '/admin/cms/events' },
            { id: 'testimonials', label: 'Testimonials', icon: Star, path: '/admin/cms/testimonials' },
            { id: 'faqs', label: 'FAQs', icon: QuestionAnswer, path: '/admin/cms/faqs' },
            { id: 'seo-settings', label: 'SEO Settings', icon: SearchOutlined, path: '/admin/cms/seo' },
          ]
        },
        {
          id: 'communications',
          label: 'Communications',
          icon: ContactMail,
          children: [
            { id: 'contact-forms', label: 'Contact Forms', icon: ContactMail, badge: 2, path: '/admin/contact-forms' },
            { id: 'newsletter', label: 'Newsletter', icon: Email, path: '/admin/newsletter' },
            { id: 'notifications', label: 'Notifications', icon: Notifications, path: '/admin/notifications' },
            { id: 'email-templates', label: 'Email Templates', icon: Email, path: '/admin/email-templates' },
            { id: 'announcements', label: 'Announcements', icon: AnnouncementOutlined, path: '/admin/announcements' },
          ]
        },
      ]
    },
    {
      id: 'management',
      title: 'MANAGEMENT',
      items: [
        {
          id: 'user-management',
          label: 'User Management',
          icon: People,
          children: [
            { id: 'users', label: 'Users', icon: Person, path: '/admin/users' },
            { id: 'roles-permissions', label: 'Roles & Permissions', icon: Security, path: '/admin/roles' },
            { id: 'user-sessions', label: 'User Sessions', icon: PersonAdd, path: '/admin/sessions' },
          ]
        },
        {
          id: 'analytics',
          label: 'Analytics & Reports',
          icon: Analytics,
          children: [
            { id: 'page-analytics', label: 'Page Analytics', icon: TrendingUp, path: '/admin/page-analytics' },
            { id: 'search-analytics', label: 'Search Analytics', icon: SearchOutlined, path: '/admin/search-analytics' },
            { id: 'feedback', label: 'User Feedback', icon: FeedbackOutlined, path: '/admin/feedback' },
          ]
        },
        {
          id: 'system',
          label: 'System Settings',
          icon: Settings,
          children: [
            { id: 'website-config', label: 'Website Configuration', icon: Settings, path: '/admin/website-config' },
            { id: 'system-settings', label: 'System Settings', icon: Settings, path: '/admin/system-settings' },
            { id: 'audit-logs', label: 'Audit Logs', icon: Assignment, path: '/admin/audit-logs' },
            { id: 'help-support', label: 'Help & Support', icon: Help, path: '/admin/help' },
          ]
        },
      ]
    },
  ];

  const handleNavigation = (path: string, itemId: string) => {
    onSectionChange?.(itemId);
    router.push(path);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.has(item.id);
    const isActive = activeSection === item.id;
    const Icon = item.icon;

    const handleClick = () => {
      if (hasChildren) {
        toggleExpanded(item.id);
      } else if (item.path) {
        handleNavigation(item.path, item.id);
      } else {
        onSectionChange?.(item.id);
      }
    };

    return (
      <Box key={item.id}>
        <ListItem
          disablePadding
          sx={{
            pl: open ? level * 2 : 0,
            mb: 0.3,
          }}
        >
          <ListItemButton
            onClick={handleClick}
            sx={{
              borderRadius: '12px',
              mx: open ? 1.5 : 'auto',
              minHeight: 44,
              justifyContent: open ? 'initial' : 'center',
              backgroundColor: isActive ? '#e8f5e8' : 'transparent',
              '&:hover': {
                backgroundColor: isActive ? '#e8f5e8' : alpha('#000', 0.04),
              },
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? 36 : 'auto',
                color: isActive ? '#4ade80' : '#64748b',
                justifyContent: 'center',
                transition: 'color 0.2s ease',
              }}
            >
              <Badge
                badgeContent={item.badge}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    minWidth: '16px',
                    height: '16px',
                    fontWeight: 600,
                  }
                }}
              >
                <Icon fontSize="small" />
              </Badge>
            </ListItemIcon>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  style={{ flex: 1 }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.875rem',
                        color: isActive ? '#4ade80' : '#374151',
                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {hasChildren && open && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <KeyboardArrowLeft
                  sx={{
                    fontSize: '1.1rem',
                    color: '#94a3b8'
                  }}
                />
              </motion.div>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((childItem) => renderMenuItem(childItem, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const renderMenuSection = (section: MenuSection) => {
    return (
      <Box key={section.id} sx={{ mb: 3 }}>
        {open && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#9ca3af',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              px: 3,
              mb: 1.5,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {section.title}
          </Typography>
        )}

        <List component="div" disablePadding>
          {section.items.map((item) => renderMenuItem(item))}
        </List>
      </Box>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          minHeight: 72,
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1 }}
            >
              {/* Logo placeholder - you can replace with actual logo */}
              <div className='flex'>
                <Image src="https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCV0y3FUvkBwoHGKNiCbEI9uWYstSRk5rXgMLfx" height={32} width={32} alt="TWC Logo" />
                <span className='text-md font-black sans-serf ml-4 mt-1'>Dolores Hotels </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <IconButton
          onClick={onToggle}
          sx={{
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: alpha('#000', 0.04),
            },
            transition: 'all 0.2s ease',
            width: 32,
            height: 32,
          }}
        >
          <KeyboardArrowLeft
            sx={{
              fontSize: 20,
              color: '#64748b',
              transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </IconButton>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 2,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha('#cbd5e1', 0.3),
            borderRadius: '2px',
            '&:hover': {
              backgroundColor: alpha('#94a3b8', 0.5),
            },
          },
        }}
      >
        {menuSections.map((section) => renderMenuSection(section))}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: '1px solid #f1f5f9',
          boxShadow: 'none',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;