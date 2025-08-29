import React from 'react';

import RoomListPage from './components/room-list-page';
import { getAllRooms } from '../../../../../lib/actions/room-management';

const RoomsPage: React.FC = async () => {
  const rooms = await getAllRooms();

  return <RoomListPage initialRooms={rooms} />;
};

export default RoomsPage;