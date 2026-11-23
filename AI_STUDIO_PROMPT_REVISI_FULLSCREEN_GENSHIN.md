# Unified Master Prompt for Google AI Studio / Stitch (English)

Copy and paste the exact prompt below directly into **Google AI Studio / Stitch**. It unifies the previous feature enhancements (Namecard showcase, Interactive Teyvat map modal, Celestia entrance) with the latest mobile fullscreen refinements, HoYoLAB Chronicle translucent aesthetics, glider tracking alignment, and official asset fixes.

---

```markdown
Please refine the visual identity, mobile screen architecture, and feature depth of "Teyvat Delicacies" to achieve full in-game Genshin Impact and official HoYoLAB Chronicle immersion, seamlessly integrating the newly added official assets in the repository:

1. TRUE EDGE-TO-EDGE FULLSCREEN MOBILE CANVAS (ELIMINATING THE "INSET BOX" TRAP):
   - Eliminate the restrictive outer inset container wrapper (remove outer horizontal margins like px-2.5 and rounded sheet corners that squeeze the main page into a floating card with dark borders on the left, right, and bottom).
   - On smartphone viewports, ensure the background canvas extends 100% full bleed from edge to edge and flows naturally from the status bar down to the bottom navigation bar.
   - Internal breathing room and gutters must be created naturally inside each content card and section (standard px-4), giving the app a native, expansive, and comfortable mobile feel.

2. ATMOSPHERIC TRANSLUCENCY & HOYOLAB CHRONICLE AESTHETICS (AVOIDING FLAT BLACK):
   - Replace oppressive solid pitch-black surfaces with an elegant, breathing Midnight Slate and Cosmic Indigo palette (#1A1F2C to #1E2333) featuring subtle ambient cosmic stardust.
   - Implement authentic glassmorphism for top traveler headers and bottom tab navigation: semi-transparent backdrops (rgba(28, 34, 52, 0.75) with backdrop-blur-md) bordered with delicate hairline gold trims (rgba(255, 231, 165, 0.25)).
   - Data cards (recipe cards, order summaries, wallet panels) must rest on luminous, clean Ivory Parchment surfaces (#F7F4EE to #ECE5D8) with soft gold borders (#D3BC8E), delivering pristine readability and a luxurious anime-RPG finish.

3. COLLECTIBLE NAMECARD SHOWCASE IN THE ADVENTURER PROFILE (`ProfileScreen.tsx`):
   - The repository provides 8 official Genshin Namecard assets in `assets/namecards/` (Natlan Saurians, Fontaine Glory, Zhongli Rex, Raiden Shogun, Nahida Dendro, Furina Fountain, Mondstadt Favonius, Liyue Harbor).
   - In the Adventurer License header, replace the plain card with an authentic horizontal Namecard banner (defaulting to `assets/namecards/natlan_saurian_bg.png` featuring the Natlan Saurians insignia).
   - Overlay the traveler avatar, UID, and adventure rank with translucent glass stat badges (inspired by the HoYoLAB Battle Chronicle profile layout).
   - Add a refined golden button "Ganti Namecard". Tapping it opens a modal displaying the collectible Namecard thumbnail grid (`_icon.png`). Selecting a card immediately updates the active profile banner and persists the selection in the store.

4. INTERACTIVE TEYVAT DELIVERY MAP IN CHECKOUT (`CheckoutScreen.tsx`):
   - The repository now features the latest comprehensive Teyvat world map at `assets/map/teyvat_world_map.webp` (Version 7.2 Natlan update, covering Natlan 5.x, Fontaine, Chenyu Vale, Sumeru, Inazuma, Liyue, and Mondstadt).
   - In the delivery destination section, add an interactive "Pilih Titik Antar di Peta Teyvat" button.
   - Tapping it opens a map modal showing Teyvat with interactive delivery waypoint pins for major regional hubs (Knights of Favonius HQ, Wanmin Restaurant Terrace, Grand Narukami Shrine, Court of Fontaine, Tequemecan Springs, etc.).
   - Selecting a waypoint marks the location and renders a golden flight trajectory line simulating the Glider Courier path.

5. PRECISE GLIDER COURIER PROGRESS TRACKING (`OrderStatusScreen.tsx`):
   - Redesign the flight progress bar into a balanced 3-point expedition waypoint path:
     * Node 1 (Start - 0%): Teyvat Kitchen (Wanmin Kitchen icon).
     * Node 2 (In Transit - 50%): Glider Courier Airborne, with the wind cursor icon perfectly centered on the gold flight line and pulsing with Anemo teal (#56E2B6) and gold glow (#FFE7A5).
     * Node 3 (Destination - 100%): Destination Waypoint (e.g., Grand Narukami Shrine, Inazuma), ensuring the golden progress fill touches 100% smoothly upon completion without awkward cutoff gaps.
   - Render the order receipt details below in an edge-to-edge ivory parchment card with clear breakdown and chef notes.

6. HIGH-FIDELITY DISH MAPPINGS & RARITY TRIQUETRA RINGS (`dishes.ts` & `CatalogScreen.tsx`):
   - Fix "Apple Cider" (3-Star Rare) to use the authentic Mondstadt glass bottle beverage asset (`/assets/dishes/apple_cider.png`), replacing the raw apple fruit.
   - Fix "Blazed Meat Stew" (4-Star Epic Natlan) to use the authentic fiery roasted meat asset (`/assets/dishes/magmic_ode.png`), replacing the placeholder ramen bowl.
   - Ensure 1-Star (Common) and 2-Star (Uncommon) food cards display their official watermark Triquetra rings (`/assets/icons/bg_1star.webp` and `/assets/icons/bg_2star.webp` with opacity 0.35 and mix-blend-mode: overlay) so all rarity tiers share a unified, authentic header depth.

7. CINEMATIC CELESTIA GATE ENTRANCE (`CelestiaGateScreen.tsx`):
   - Utilize the newly updated 1080p cinematic video assets (`/assets/video/celestia_door_open.mp4` and `.webm`) featuring an expansive daylight blue sky with floating clouds and ancient Celestia pillars.
   - When the traveler taps "Ketuk untuk Masuk ke Teyvat", play the smooth 3-second stone door opening sequence transitioning seamlessly into a radiant celestial whiteout bloom that dissolves into the main menu without any black letterboxing.

8. ABSOLUTE ANTI-SLOP & CODE CONSTRAINTS:
   - ZERO Unicode emojis. Use official SVG diamond stars (◆ / ★) and vector glyphs.
   - Display the official Mora coin icon (`/assets/icons/mora.png`) for all currency amounts with tabular monospace numbers (`tabular-nums`).
   - Use the authentic `GenshinFont` (`HYWenHei 85W`) for all titles, prices, tabs, and modals.

Please update the application files accordingly.
```
