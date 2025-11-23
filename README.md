# 🛒 Sparky Shopper

**A polished, allergen-aware grocery shopping app with real-time ingredient analysis and personalized recommendations.**

![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![Framework](https://img.shields.io/badge/Framework-React%20Native%20Expo-black)

---

## ✨ Features

### 🧬 Smart Allergy Detection
- **Real-time ingredient analysis** with severity-based safety badges (Safe/Caution/Hardstop)
- **Allergen highlighting** in ingredient lists
- **Safety alerts** when products contain your allergens
- **Synonym matching** (milk → dairy, wheat → gluten)

### 🎯 Personalized Experience
- **Multi-step onboarding** with diet and allergen selection
- **Top-9 allergen tracking** (milk, eggs, peanuts, tree nuts, soy, wheat, fish, shellfish, sesame)
- **Diet support** (vegan, vegetarian, halal, kosher)
- **Persistent preferences** with Zustand state management

### 🛍️ Product Browsing
- **65+ products** with real images from Loremflickr
- **Safety filters** (all, safe, caution, hardstop)
- **Product details** with brand, category, aisle location
- **Ingredient lists** with allergen highlighting

### 🍽️ Recipe Features
- **Dish-to-Cart**: Select from 15 recipes, adjust servings, add all ingredients
- **YouTube Parser**: Paste video descriptions, extract ingredients, add to cart
- **Recipe database** with substitution suggestions

### 🛒 Smart Shopping Cart
- **Aisle grouping** for efficient shopping
- **Quantity controls** (+/- buttons)
- **Total price calculation**
- **Safety badges** on cart items
- **Empty state** with friendly messaging

### 🗺️ Indoor Navigation (Placeholder)
- **Store map** placeholder with feature cards
- **A* pathfinding** algorithm implemented
- **Route optimization** with 2-opt algorithm
- Ready for SVG map rendering

---

## 🏗️ Tech Stack

- **Frontend**: React Native + Expo (managed workflow) + TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **UI**: React Native Paper (Material 3) + Custom Theme
- **State**: Zustand (user preferences, shopping cart)
- **Allergy Engine**: Custom normalization + conflict detection
- **Backend**: Firebase (Auth, Firestore, Functions) - configured but not deployed

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd hackathon_app
npm install
npx expo start --tunnel
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

---

## 📱 App Flow

```
Onboarding (Diet + Allergies)
    ↓
Home Screen (Search + Quick Actions + Products)
    ├─→ Browse (Filter by safety level)
    ├─→ Product Detail (Allergy alerts + Add to cart)
    ├─→ Dish (Recipe picker + Add ingredients)
    ├─→ YouTube (Parse ingredients + Add to cart)
    ├─→ Settings (View/clear preferences)
    ├─→ Map (Store navigation placeholder)
    └─→ Cart (Grouped by aisle + Checkout)
```

---

## 🎨 Design System

### Colors

- **Primary**: `#6750A4` (Purple) - Main brand color
- **Secondary**: `#006874` (Teal) - Accents
- **Tertiary**: `#7D5260` (Rose) - Highlights
- **Success**: `#0F9D58` (Green) - Safe products
- **Caution**: `#F9AB00` (Amber) - Avoid ingredients
- **Critical**: `#D93025` (Red) - Hardstop allergens

### Safety Badges

- ✅ **Safe**: Green - Product is safe for you
- 🟠 **Caution**: Amber - Contains ingredients to avoid
- ⛔ **Hardstop**: Red - Contains your allergens

---

## 🧬 Allergy Engine

### How It Works

1. **Normalization**: Ingredients are tokenized and normalized
   ```typescript
   "Wheat Flour, Milk, Eggs" → ['wheat', 'gluten', 'milk', 'dairy', 'egg', 'flour']
   ```

2. **Synonym Matching**: Allergens are matched with synonyms
   ```typescript
   milk → dairy, casein, whey, butter, cheese, yogurt
   wheat → gluten, flour, semolina, malt
   ```

3. **Conflict Detection**: Checks against user preferences
   ```typescript
   const result = checkConflicts(preferences, tokens);
   // result.level: 'safe' | 'caution' | 'hardstop'
   // result.matches: ['milk'] (if user allergic to milk)
   // result.suggestions: ['almond milk', 'oat milk']
   ```

### Example Usage

```typescript
import { checkConflicts } from './modules/allergyEngine';
import { useUserStore } from './lib/stores/userStore';

const { preferences } = useUserStore();
const tokens = ['milk', 'wheat', 'egg'];
const result = checkConflicts(preferences, tokens);

if (result.level === 'hardstop') {
  // Show warning alert
  console.log(`⚠️ ${result.reason}`);
  console.log(`Contains: ${result.matches.join(', ')}`);
}
```

---

## 📦 Project Structure

```
hackathon_app/
├── components/           # Reusable UI components
│   ├── SafetyBadge.tsx          # Animated safety indicators
│   ├── ProductCardPro.tsx       # Product cards with images
│   ├── IngredientChip.tsx       # Ingredient chips
│   └── ...
├── screens/              # Screen components
│   ├── OnboardingScreen.tsx     # Multi-step onboarding
│   ├── HomeScreen.tsx           # Search + Quick Actions
│   ├── BrowseScreen.tsx         # Product grid with filters
│   ├── ProductDetailScreen.tsx  # Product details + alerts
│   ├── CartScreen.tsx           # Shopping cart
│   ├── DishScreen.tsx           # Recipe picker
│   ├── YouTubeScreen.tsx        # Ingredient parser
│   ├── MapScreen.tsx            # Store navigation
│   └── SettingsScreen.tsx       # Preferences
├── modules/
│   ├── allergyEngine/    # Allergy detection
│   ├── nav/              # A* pathfinding
│   └── navigation/       # React Navigation setup
├── lib/stores/           # Zustand state management
│   ├── userStore.ts             # User preferences
│   └── cartStore.ts             # Shopping cart
├── data/                 # JSON data files
│   ├── products.json            # 65 products
│   ├── recipes.json             # 15 recipes
│   ├── synonyms.json            # Allergen synonyms
│   └── storeGraph.json          # Navigation graph
└── theme/                # Design system
    ├── tokens.ts                # Colors, spacing
    └── paperTheme.ts            # Material 3 theme
```

---

## 🎯 Current Status

### ✅ Completed (MVP)

- ✅ All core screens implemented
- ✅ Real-time allergy detection
- ✅ Product images (Loremflickr)
- ✅ Shopping cart functionality
- ✅ Recipe-to-cart
- ✅ YouTube parsing
- ✅ Settings management
- ✅ Complete navigation flow

### 🚧 Future Enhancements

- Search functionality
- SVG map rendering
- Swap suggestions display
- Performance optimization
- Accessibility improvements
- Unit & E2E testing
- Real product images
- Firebase deployment

---

## 📊 Data

### Products (65 SKUs)
- Dairy & alternatives
- Bakery items
- Spreads
- Pasta & noodles
- Seafood
- Meat & poultry
- Protein alternatives
- Condiments
- Snacks
- Grains & more

### Recipes (15 Dishes)
- Pasta Carbonara
- Chicken Tikka Masala
- Pad Thai
- Caesar Salad
- Beef Tacos
- Sushi Rolls
- Greek Salad
- Pancakes
- Chocolate Chip Cookies
- And more...

---

## 🛠️ Development

### Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler
```

### Testing the App

1. **Onboarding**: Select allergies (e.g., milk, peanuts)
2. **Browse**: See different safety badges on products
3. **Product Detail**: Open a product with your allergen → see warning
4. **Filters**: Use Browse filters (safe/caution/hardstop)
5. **Cart**: Add items, adjust quantities, see total
6. **Dish**: Select a recipe, add all ingredients
7. **YouTube**: Paste description, parse ingredients

---

## 📝 Key Files

- **Allergy Detection**: `modules/allergyEngine/checkConflicts.ts`
- **User Preferences**: `lib/stores/userStore.ts`
- **Shopping Cart**: `lib/stores/cartStore.ts`
- **Product Data**: `data/products.json`
- **Recipe Data**: `data/recipes.json`

---

## 🤝 Contributing

To extend this project:

1. Review `PROJECT_CONTEXT.md` for complete project state
2. Check `task.md` for remaining tasks
3. Follow established patterns for components and state
4. Test on both iOS and Android

---

## 📄 License

MIT License - feel free to use as a foundation for your own apps!

---

**Built with ❤️ for allergen-aware shopping**

*Last Updated: 2025-11-22*
