import React from 'react';
import RoomTypeListPage from './components/room-types-list-page';
import { getRoomTypes } from '../../../../../lib/actions/room-type-management';


const RoomTypesPage: React.FC = async () => {
  const roomTypes = await getRoomTypes();

  return <RoomTypeListPage initialRoomTypes={roomTypes} />;
};