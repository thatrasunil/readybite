export type LoadStatus = 'OPTIMIZED' | 'PEAK' | 'RISK';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  waitTime: number; // in minutes
  currentLoad: number; // 0 to 100
  location: string;
  cuisine: string;
  peakTimes: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  prepTime: number; // in minutes
  description: string;
  image: string;
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Paradise Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    rating: 4.5,
    waitTime: 15,
    currentLoad: 45,
    location: 'Tirupati Main Road',
    cuisine: 'Indian, Biryani',
    peakTimes: ['13:00', '20:00']
  },
  {
    id: '2',
    name: 'Barbeque Nation',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    rating: 4.2,
    waitTime: 25,
    currentLoad: 85,
    location: 'Town Center',
    cuisine: 'Barbeque, Buffet',
    peakTimes: ['19:30', '21:00']
  },
  {
    id: '3',
    name: 'The Vintage Cafe',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    rating: 4.8,
    waitTime: 5,
    currentLoad: 20,
    location: 'Temple St.',
    cuisine: 'Continental, Cafe',
    peakTimes: ['16:00']
  },
  {
    id: '4',
    name: 'Vivaha Bhojanambu',
    image: 'https://images.unsplash.com/photo-1589302168068-1c49947b4099?w=800&q=80',
    rating: 4.4,
    waitTime: 20,
    currentLoad: 65,
    location: 'Dr Mahal Rd',
    cuisine: 'Biryani, Telugu',
    peakTimes: ['13:30', '20:30']
  },
  {
    id: '5',
    name: 'Plantain Leaf Restaurant',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    rating: 4.8,
    waitTime: 10,
    currentLoad: 35,
    location: 'Near Kapila Theertam',
    cuisine: 'Vegetarian, South Indian',
    peakTimes: ['12:30', '19:30']
  },
  {
    id: '6',
    name: 'Blue Fox',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    rating: 4.6,
    waitTime: 18,
    currentLoad: 72,
    location: 'Renigunta Rd',
    cuisine: 'Multi-cuisine, Bar',
    peakTimes: ['20:00', '22:00']
  },
  {
    id: '7',
    name: 'Maa Aathidyam',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    rating: 4.7,
    waitTime: 12,
    currentLoad: 30,
    location: 'Chittoor Bypass Road',
    cuisine: 'Multi-cuisine',
    peakTimes: ['13:00', '20:00']
  },
  {
    id: '8',
    name: 'Gufha Restaurant',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80',
    rating: 4.6,
    waitTime: 30,
    currentLoad: 92,
    location: 'Tirumala Bypass Rd',
    cuisine: 'North Indian, Theme-based',
    peakTimes: ['19:00', '21:30']
  },
  {
    id: '9',
    name: 'THE PEACH DOOR',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    rating: 4.4,
    waitTime: 15,
    currentLoad: 55,
    location: 'Mango Market Road',
    cuisine: 'Modern Dine-in',
    peakTimes: ['18:30', '21:00']
  },
  {
    id: '10',
    name: 'Southern Spice',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    rating: 4.4,
    waitTime: 8,
    currentLoad: 25,
    location: 'By Pass Road',
    cuisine: 'South Indian, Quick-service',
    peakTimes: ['08:00', '13:00']
  },
  {
    id: '11',
    name: 'Perambur Srinivasa Sweets',
    image: 'https://images.unsplash.com/photo-1516714435131-44eb18ec2b63?w=800&q=80',
    rating: 4.3,
    waitTime: 10,
    currentLoad: 40,
    location: 'Tiruchanoor Rd',
    cuisine: 'Vegetarian, Sweets',
    peakTimes: ['17:00', '20:00']
  },
  {
    id: '12',
    name: 'Robo Diner',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80',
    rating: 4.5,
    waitTime: 22,
    currentLoad: 88,
    location: 'Air Bypass Rd',
    cuisine: 'Biryani, High-tech',
    peakTimes: ['13:00', '20:00']
  },
  {
    id: '13',
    name: 'The Paradise Family',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80',
    rating: 3.9,
    waitTime: 5,
    currentLoad: 15,
    location: 'Bairagipatteda Rd',
    cuisine: 'Family Restaurant',
    peakTimes: ['14:00', '20:00']
  },
  {
    id: '14',
    name: 'Taaza Kitchen',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80',
    rating: 4.1,
    waitTime: 7,
    currentLoad: 22,
    location: 'Nandini Bakery Road',
    cuisine: 'Andhra, Home-style',
    peakTimes: ['13:00', '19:30']
  },
  {
    id: '15',
    name: 'Subbayya Gari Hotel',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    rating: 4.3,
    waitTime: 25,
    currentLoad: 78,
    location: 'Tiruchanoor Rd',
    cuisine: 'Vegetarian, Traditional',
    peakTimes: ['12:30', '14:30']
  },
  {
    id: '16',
    name: 'Minerva Coffee Shop',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    rating: 4.7,
    waitTime: 12,
    currentLoad: 45,
    location: 'Renigunta Rd',
    cuisine: 'South Indian, Coffee',
    peakTimes: ['07:30', '16:30']
  },
  {
    id: '17',
    name: 'Lotus Cafe',
    image: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800&q=80',
    rating: 4.5,
    waitTime: 5,
    currentLoad: 18,
    location: 'Tirupati Highway',
    cuisine: 'Buffet, Multi-cuisine',
    peakTimes: ['13:30', '20:30']
  },
  {
    id: '18',
    name: 'DHABA HOUSE',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80',
    rating: 4.0,
    waitTime: 14,
    currentLoad: 52,
    location: 'Karakambadi Rd',
    cuisine: 'Dhaba, North Indian',
    peakTimes: ['21:00', '23:00']
  },
  {
    id: '19',
    name: 'Hotel Pai Viceroy',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80',
    rating: 4.3,
    waitTime: 20,
    currentLoad: 68,
    location: 'Tirumala Bypass Rd',
    cuisine: 'Premium Dine-in',
    peakTimes: ['13:00', '20:00']
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Hyderabadi Biryani',
    price: 250,
    category: 'Main Course',
    prepTime: 20,
    description: 'Authentic spice-infused rice with tender meat.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b17af4a4f9?w=400&q=80'
  },
  {
    id: 'm2',
    name: 'Paneer Butter Masala',
    price: 220,
    category: 'Main Course',
    prepTime: 15,
    description: 'Creamy tomato-based gravy with fresh paneer cubes.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80'
  },
  {
    id: 'm3',
    name: 'Virgin Mojito',
    price: 120,
    category: 'Beverages',
    prepTime: 5,
    description: 'Refreshing mint and lime cooler.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80'
  }
];

/**
 * Smart Logic: Predicts the health of the restaurant's supply chain based on current load
 */
export function getSupplyChainHealth(load: number): { status: LoadStatus; label: string; message: string } {
  if (load < 50) {
    return {
      status: 'OPTIMIZED',
      label: 'Optimized Flow',
      message: 'Resources are balanced. Zero wait time expected.'
    };
  } else if (load < 80) {
    return {
      status: 'PEAK',
      label: 'Peak Load',
      message: 'High demand detected. Efficiency maintained.'
    };
  } else {
    return {
      status: 'RISK',
      label: 'Disruption Risk',
      message: 'Kitchen overload probable. Potential delays detected.'
    };
  }
}

/**
 * Smart Logic: Suggests the best time slot to avoid disruptions
 */
export function getSmartSlotRecommendation(requestedTime: string, currentLoad: number): string | null {
  if (currentLoad > 75) {
    // Suggest 15 or 30 mins later/earlier to balance load
    const [hours, minutes] = requestedTime.split(':').map(Number);
    const newMinutes = (minutes + 30) % 60;
    const newHours = newMinutes === 0 ? hours + 1 : hours;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }
  return null;
}

/**
 * Smart Logic: Calculates when the kitchen should start preparation
 */
export function calculatePrepStartTime(arrivalTime: string, totalPrepTime: number): string {
  const [hours, minutes] = arrivalTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes;
  let startMinutes = totalMinutes - totalPrepTime;
  
  const startH = Math.floor(startMinutes / 60);
  const startM = startMinutes % 60;
  
  return `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
}
