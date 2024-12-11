import { signify } from "react-signify";
import { getMenuItem } from '../MenuItem/services/menuItemService';
import { getItemType } from '../ItemType/services/itemTypeService';

export const sLoading = signify(false);
export const sMenuItems = signify([]);
export const sItemTypes = signify([]);

export const fetchMenuData = async () => {
  try {
    sLoading.set(true);
    const [menuData, typeData] = await Promise.all([
      getMenuItem(),
      getItemType()
    ]);
    sMenuItems.set(menuData);
    sItemTypes.set(typeData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
  } finally {
    sLoading.set(false);
  }
};
