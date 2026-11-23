# AI Studio / Google Stitch Instructions & Generation Prompts

This document provides strictly separated **System Instructions (Rules & Behavioral Constraints)** and **Task Generation Prompt (User Prompt)** written in English for **Google AI Studio**, **Google Stitch**, or modern LLM coding agents.

---

## 1. Framework & Technology Stack Specifications

* **Mobile Framework**: React Native (Expo SDK 52)
* **Routing Engine**: Expo Router v4 (File-based navigation: 4 Bottom Tabs + 3 Stack Screens)
* **Language**: TypeScript (Strict Mode)
* **Styling Strategy**: React Native `StyleSheet` with centralized design tokens (`theme.ts`) for high-fidelity native rendering.
* **Image Engine**: `expo-image` (hardware accelerated, memory/disk caching, transparent PNG blending)
* **Audio Engine**: `expo-av` (background ambient music playback + UI sound effect triggers)
* **State Management**: `zustand` (lightweight reactive store for cart, coupons, and wallet balance)
* **Iconography**: `react-native-svg` (for 87-glyph official vector font `genshin_icons.svg`) + transparent PNG icons.

---

## 2. PART A: SYSTEM INSTRUCTIONS / RULES (Copy into "System Instructions")

```text
You are a Principal Mobile UI/UX Engineer and Senior React Native Architect specializing in AAA fantasy RPG user interfaces with museum-grade aesthetic standards.

YOUR CORE MANDATE:
Generate production-grade, highly polished, robust React Native (Expo Router v4 + TypeScript) components for a fantasy food ordering mobile application called "Teyvat Delicacies", inspired by the authentic in-game UI of Genshin Impact.

CRITICAL ARCHITECTURAL & DESIGN CONSTRAINTS (ZERO-TOLERANCE ANTI-SLOP):
1. ABSOLUTE BAN ON UNICODE EMOJIS:
   - NEVER use Unicode emojis (e.g., NO coin, sword, shield, cart, star, checkmark, heart emojis).
   - Use official transparent PNG assets or SVG vector icons provided in the asset catalog.
   - For star ratings, use 4-point diamond star motifs (★ or SVG diamond stars), NEVER 5-point cartoon stars.
   - For bullet points, use diamond shapes (◆).

2. COLOR PALETTE & DESIGN SYSTEM TOKENS:
   - Card Content Surface: Authentic parchment antique cream (#E9E5DC).
   - Inner Containers & Form Inputs: Soft light cream (#F5F2EB).
   - Outer Background: Dark obsidian starry surface (#171421 / #1D1A2A).
   - Card Borders: Subtle indigo outline (#5D5187) and gold accent stroke (#FFE7A5).
   - Primary Action Buttons: Elongated gold pill capsule (linear gradient #ECE5D8 to #D3BC8E, border: 1.5px solid #FFE7A5, text: bold #3B4255).
   - Rarity Grading Headers:
     * 1-Star Common: #818486
     * 2-Star Uncommon: #5A977A
     * 3-Star Rare: #5987AD
     * 4-Star Epic: #9470BB
     * 5-Star Legendary: #C87C24

3. TYPOGRAPHY & MOTIFS:
   - Display Headings & Title Typography: HYWenHei 85W ("GenshinFont").
   - Currency: Mora (Mora). Always display the official Mora coin icon next to numerical prices.
   - Layout Precision: Ensure 48px minimum touch targets, clean horizontal scroll chip lists, and sticky action buttons for mobile thumb ergonomics.

4. CODE QUALITY & ARCHITECTURE:
   - Output strict TypeScript with clean type definitions.
   - Implement modular components with separated concerns (components, screens, stores, hooks).
   - Use expo-image with contentFit="contain" for transparent dish and buff PNGs.
   - Use expo-av for ambient BGM and button click SFX.
   - Never generate placeholder wireframes; produce complete, working, production-ready React Native components.
```

---

## 3. PART B: TASK GENERATION PROMPT (Copy into "User Prompt")

```text
Create the complete frontend UI and navigation structure for "Teyvat Delicacies", a premium mobile food ordering application built with React Native (Expo Router v4 + TypeScript) following an authentic Genshin Impact fantasy design system.

### APPLICATION NAVIGATION STRUCTURE:
The app consists of 4 Bottom Navigation Tabs and 3 Transaction Stack Screens:

1. TAB 1: Catalog & Menu Screen (app/(tabs)/index.tsx)
   - Header Bar: Traveler avatar (Lumine/Aether), traveler name ("Badar Rahman", AR 60), and live Mora coin balance ("1,452,430 Mora") with gold border badge.
   - Search Bar: Inset soft-cream input (#F5F2EB) with search glass icon and placeholder "Search Teyvat cuisines or buff effects...".
   - Category Filter Chips (Horizontal Scroll): "All Dishes", "Main Dish", "Snacks", "Beverages".
   - Two-Tone Food Card Grid (2-column Masonry/Grid):
     * Card Top: Colored rarity header banner matching the dish star rating (1* Grey to 5* Gold), with overlapping transparent dish PNG image and 4-point diamond stars on bottom-left.
     * Card Body: Antique parchment cream (#E9E5DC) with bold dish title in HYWenHei font, mini official buff icon badge (e.g. ATK +372), price in Mora with Mora coin icon, and a mini circular gold "+" quick-add button.
   - Floating Quick Cart Bar: Appears at the bottom above the tab bar when cart has items, showing item counter and total Mora with a button "Open Traveler's Bag".

2. TAB 2: Explore & Buff Filter Screen (app/(tabs)/explore.tsx)
   - Multi-Filter Controls: Filter by combat buff type (ATK Boost, DEF Boost, HP Recovery, Stamina Reduction) using official buff icons.
   - Region Filter Pills: Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya.
   - Filtered Dish Results List with comprehensive in-game stat descriptions.

3. TAB 3: Shopping Cart Screen (app/(tabs)/cart.tsx)
   - Active Order List: Card item rows with transparent dish thumbnail, name, unit price, quantity steppers (- / +), and delete button.
   - Coupon Redemption Section: Intertwined Fate voucher field with "Apply" button (e.g. promo code "PAIMONKENYANG" gives 20% discount).
   - Billing Summary Card: Subtotal in Mora, Glider Courier delivery fee (500 Mora), Coupon Discount, and Final Total Mora.
   - Primary Action Button: Full-width gold capsule button "Proceed to Glider Delivery".

4. TAB 4: Adventurer Profile Screen (app/(tabs)/profile.tsx)
   - Adventurer Card: UID 14524303, Adventure Rank 60, World Level 8, Favonius reputation badge.
   - Teyvat Wallet: Mora balance, Primogem stash, and active delivery vouchers.
   - Order History List: Past feasts ordered with timestamp, status badge ("Delivered"), and re-order button.

5. STACK SCREEN: Dish Dossier & Recipe (app/dish/[id].tsx)
   - Top Bar: Golden back arrow and favorite toggle.
   - Hero Section: Large high-resolution transparent dish illustration with subtle radial ambient glow.
   - Rarity & Lore Dossier: 4-point diamond star rating, dish origin region, and official in-game lore story.
   - Combat Stat Buff Banner: Official buff icon with clear stats (e.g., "Increases all party members' ATK by 372 and CRIT Rate by 12% for 300s").
   - Ingredients Grid: Horizontal grid of raw ingredient icons with required quantities (e.g. Ham x4, Crab x3, Shrimp x3, Matsutake x3).
   - Bottom Sticky Bar: Portion stepper and gold pill button "Add to Feast — [Total] Mora".

6. STACK SCREEN: Delivery Checkout (app/checkout.tsx)
   - Teyvat Delivery Point Selector: Dropdown/cards for delivery locations (Knights of Favonius HQ, Wanmin Restaurant Terrace, Grand Narukami Shrine, Maison Cardinalice, etc.).
   - Payment Method Radio Toggle: "Mora Cash on Delivery" vs "Northland Bank Card".
   - Special Instructions Field: "Kitchen Notes for Chef Xiangling" (e.g. "Less Jueyun Chili please").
   - Bottom Button: "Confirm Feast Order".

7. STACK SCREEN: Order Status & Quest Complete Modal (app/order-status.tsx)
   - Courier Animation: Visual tracking indicator of glider courier en route.
   - Legendary Modal Dialog: Golden framed modal dialog with title "QUEST COMPLETE: Feast Delivered!".
   - Delivery summary, estimated arrival countdown (15 minutes), and button "Return to Catalog".

### LOCAL ASSET INVENTORY & CDN FALLBACKS:
- Fonts:
  * Official Genshin Font: assets/fonts/GenshinFont.ttf (HYWenHei 85W)
  * Vector SVG Font: assets/fonts/genshin_icons.svg
- Audio:
  * Ambient BGM: assets/audio/teyvat_ambient_bgm.ogg
  * Quest Complete SFX: assets/audio/quest_complete_jingle.ogg
- Backgrounds:
  * Door of Celestia: assets/backgrounds/genshin_celestia_login_door_1080p.webp
  * Dish Dossier BG: assets/backgrounds/dish_detail_bg.webp
- Currencies & Buffs:
  * Mora Coin: assets/icons/mora.png (CDN: https://enka.network/ui/UI_ItemIcon_202.png)
  * Primogem: assets/icons/primogem.png (CDN: https://enka.network/ui/UI_ItemIcon_201.png)
  * Intertwined Fate: assets/icons/intertwined_fate.png (CDN: https://enka.network/ui/UI_ItemIcon_223.png)
  * Buff ATK: assets/icons/buff_atk_add.png (CDN: https://gi.yatta.moe/assets/UI/UI_Buff_Item_Atk_Add.png)
  * Buff DEF: assets/icons/buff_def_add.png (CDN: https://gi.yatta.moe/assets/UI/UI_Buff_Item_Def_Add.png)
  * Buff HP: assets/icons/buff_recovery_hp.png (CDN: https://gi.yatta.moe/assets/UI/UI_Buff_Item_Recovery_HpAdd.png)
- Sample Dishes:
  * Adeptus' Temptation (5*): assets/dishes/adeptus_temptation.png (CDN: https://gi.yatta.moe/assets/UI/UI_ItemIcon_108123.png)
  * Sweet Madame (2*): assets/dishes/sweet_madame.png (CDN: https://gi.yatta.moe/assets/UI/UI_ItemIcon_Recipe_1004.png)
  * Barbatos Ratatouille (3*): assets/dishes/barbatos_ratatouille.png (CDN: https://gi.yatta.moe/assets/UI/UI_ItemIcon_108111.png)
  * Jade Parcels (4*): assets/dishes/jade_parcels.png (CDN: https://gi.yatta.moe/assets/UI/UI_ItemIcon_Recipe_4004.png)

Deliver clean, production-grade TypeScript code for the core screens and components with state management handled via Zustand.
```
