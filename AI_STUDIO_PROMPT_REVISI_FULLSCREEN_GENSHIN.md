# Master Visual Direction Prompt for Google AI Studio (English)

Copy and paste the exact prompt below into **Google AI Studio**:

```markdown
Please refine the visual identity, atmospheric immersion, and UI flow of "Teyvat Delicacies" to achieve authentic in-game Genshin Impact aesthetic perfection, utilizing the updated official assets in the repository:

1. RESTORE AUTHENTIC WARM PARCHMENT CREAM PALETTE (ELIMINATING HEAVY DARK SLOP):
   - The entire visual experience must be anchored in the warm, luminous antique parchment cream palette of the official Genshin Impact menus and Adventurer Handbook (dominant warm ivory cream #ECE5D8 / #F8F5EE, brushed antique gold trims #C8A86B / #D3BC8E, and deep obsidian-slate ink #242735 for crisp typography).
   - Eliminate suffocating pitch-black container boxes and heavy dark-mode framing. Cards, modals, dialog sheets, and catalog sections should feel like illuminated parchment pages and authentic two-tone adventurer cards.
   - All screens must fill the mobile viewport edge-to-edge with natural margins inside the content cards, avoiding clumsy floating box letterboxing.

2. MINIMALIST & MAJESTIC CELESTIA ENTRANCE (`CelestiaGateScreen.tsx`):
   - Completely remove the video player element to prevent stutter and black letterbox artifacts.
   - Feature the high-definition static daylight Door of Celestia backdrop (`assets/backgrounds/genshin_celestia_login_door_1080p.webp`) with its endless sky and floating ancient pillars.
   - Strip away extraneous developer controls: remove the "Masuk tanpa musik latar" toggle, remove all audio choice toggles, and remove awkward developer subtitles.
   - Keep the entrance grand, minimal, and authentic to the game's iconic "CLICK TO BEGIN" screen: the golden "Teyvat Delicacies" emblem, a discrete traveler identity pill, and an elegant glowing button: "Ketuk untuk Memulai" / "CLICK TO BEGIN".
   - Tapping the button triggers a smooth radiant celestial whiteout bloom (godray flare) dissolving directly into the warm parchment catalog.

3. AUTHENTIC IN-GAME ADVENTURER PROFILE & NAMECARD SHOWCASE (`ProfileScreen.tsx`):
   - Redesign the Adventurer Profile to mirror the authentic Genshin Impact in-game Character Showcase & Namecard collection screens.
   - Remove all meta and conversational text (completely eliminate phrases like "HoYoLAB Battle Chronicle" or external website names; keep all copy 100% immersive in-universe).
   - In the Adventurer License header, ensure the active Namecard banner has clean, symmetrical rounded corners (remove the awkward asymmetric right-corner curve).
   - For the "Ganti Namecard" modal, display a rich, authentic grid of collectible Namecard thumbnail artworks using the official assets in `assets/namecards/` (Natlan Saurians, Fontaine Glory, Zhongli Rex, Raiden Shogun, Nahida Dendro, Furina Fountain, Mondstadt Favonius, Liyue Harbor).
   - Each card in the picker grid must display its illustrated visual art card (using `*_icon.png` or `*_bg.png`), not plain empty text buttons. Tapping a card immediately selects it, updates the traveler's active profile banner, and persists the choice.

4. SEAMLESS INTERACTIVE TEYVAT DELIVERY MAP (`CheckoutScreen.tsx`):
   - The repository now features the repaired, seamless high-resolution Teyvat world map at `assets/map/teyvat_world_map.webp` (all regions connected across continuous azure ocean waters, without tile slicing gaps or black bands).
   - In the Checkout modal, present the full continent of Teyvat covering its 8 renowned realms (Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, and Snezhnaya).
   - Provide interactive regional delivery waypoint pins. Selecting a landmark renders a continuous golden Anemo flight trajectory arc traveling from Chef Xiangling's Wanmin Kitchen in Liyue to the chosen landing destination.

5. CONTINUOUS ANEMO GLIDER FLIGHT TRAJECTORY (`OrderStatusScreen.tsx`):
   - In the Glider Courier Tracking section ("Pelacakan Kurir Glider"), replace static disconnected bullet points with a living, continuous flight trajectory slider.
   - The Anemo Glider cursor must smoothly glide horizontally along the glowing golden wind trajectory from Wanmin Kitchen to the destination point, reflecting the delivery progress with real-time ETA and wind trail aesthetics.
   - Below the flight path, present the order receipt on a crisp ivory parchment sheet with complete dish breakdowns and chef notes.

6. STRICT IN-UNIVERSE AESTHETICS & ANTI-SLOP INVARIANTS:
   - ZERO Unicode emojis. Use authentic diamond star indicators (◆ / ★) and official game icons.
   - Display the official Mora currency coin (`assets/icons/mora.png`) beside all prices with monospace numbers (`tabular-nums`).
   - Maintain the official Genshin typography (HYWenHei 85W / `font-genshin`) for all headings and gold accent buttons.
```
