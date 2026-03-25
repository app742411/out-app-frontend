import React from "react";
import * as Icons from "lucide-react";

// 🚀 FULL AMENITIES ICON LIST (100+)
const iconList = [
  // Basic
  "Home", "Building", "DoorOpen", "KeyRound", "Lock", "Shield", "Bell",
  "Search", "Info", "User", "Users", "UserRound",

  // Connectivity
  "Wifi", "WifiHigh", "Network", "Router", "Smartphone", "Laptop",
  "Computer", "Tv", "Radio",

  // Parking & Transport
  "Car", "ParkingCircle", "ParkingMeter", "Bike", "BusFront",
  "TrainFront", "Ship", "Plane", "TramFront",

  // Comfort
  "Fan", "Wind", "AirVent", "Snowflake", "Sun", "Thermometer",
  "BatteryCharging", "Bolt", "Droplet", "DropletSlash",

  // Bedroom & Furniture
  "Bed", "Lamp", "Armchair", "Sofa", "Bath", "ShowerHead", "Toilet",
  "Table", "Fridge", "WashingMachine",

  // Kitchen
  "Utensils", "CookingPot", "Microwave", "Blender", "Salad",

  // Entertainment
  "Gamepad2", "MonitorPlay", "Library", "BookOpenText", "Guitar",
  "Music", "Film", "Camera", "CameraOff",

  // Sports & Fitness
  "Dumbbell", "Trophy", "Basketball", "Volleyball", "Footprints",
  "Mountain", "Tent", "PalmTree", "Sailboat",

  // Outdoor & Safety
  "TreePine", "Trees", "Flower2", "FireExtinguisher", "AlarmSmoke",
  "BellDot", "MapPin", "Map", "Globe",

  // Water & Pool
  "Droplet", "Waves", "LifeBuoy",

  // Pet Friendly
  "Dog", "PawPrint", "Bone",

  // Workspaces
  "Briefcase", "ClipboardList", "NotebookPen", "Calendar", "Clock3",
  "Phone",

  // Luxury
  "Diamond", "Gem", "Crown",

  // Shopping Nearby
  "ShoppingCart", "Store", "BadgeCheck",

  // Eco & Cleanliness
  "Leaf", "Recycle", "Sparkles", "Bug",

  // Security
  "ShieldCheck", "ShieldAlert", "Eye", "Fingerprint",

  // Others
  "Flag", "Gift", "Heart", "Star",
];

const IconPicker = ({ onSelect }) => {
  return (
    <div
      className="
        grid grid-cols-5 gap-1 p-4 
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        rounded-lg shadow-xl
        w-72 max-h-80 overflow-y-auto
        animate-fadeIn
      "
    >
      {iconList.map((iconName) => {
        const IconComponent = Icons[iconName];

        // If icon doesn't exist in lucide-react skip it
        if (!IconComponent) return null;

        return (
          <button
            key={iconName}
            onClick={() => onSelect(iconName)}
            className="
              p-2 rounded-lg flex flex-col items-center justify-center
              hover:bg-gray-100 dark:hover:bg-gray-700 
              transition
            "
          >
            <IconComponent
              size={22}
              className="text-gray-700 dark:text-gray-300"
            />
            
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;
