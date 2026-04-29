# Progressive Beer - Copilot Instructions

## Project Overview
Progressive Beer is a Progressive Web App (PWA) that showcases beer styles from around the world. The app leverages modern web technologies including Service Workers, Cache API, and Web App Manifest to provide offline functionality and an app-like experience.

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Material Design Lite (MDL)
- **PWA Features**: Service Workers, Cache API, Web App Manifest
- **Data Sources**: 
  - BreweryDB (beer styles data)
  - Open Brewery DB API (brewery information)
- **Build Tools**: Grunt

## Design System & Branding

### Color Palette
- **Primary Brand Color**: `#FB8C00` (Orange)
- **Gradients**: 
  - Hero/Nav: `linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)`
  - Feature sections: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`
  - Footer: `linear-gradient(135deg, #2c3e50 0%, #34495e 100%)`
- **Text Colors**: 
  - Dark: `#333`
  - Medium: `#666`, `#555`
  - White: `#fff`

### SRM (Standard Reference Method) Color Gradients
Beer cards use accurate SRM color representations:
- **Pale Beer (SRM < 10)**: `linear-gradient(135deg, #F5E6B3 0%, #F4D03F 50%, #E8B923 100%)`
- **Amber Beer (SRM 10-20)**: `linear-gradient(135deg, #D4722B 0%, #C65D21 50%, #8B3A12 100%)`
- **Dark Beer (SRM > 20)**: `linear-gradient(135deg, #3D2817 0%, #251710 50%, #0D0805 100%)`

### Typography
- **Primary Font**: 'Open Sans' (body text)
- **Display Font**: 'Gabriela' (headings, brand name)
- **Icon Font**: Material Icons

## Architecture & File Structure

### Key Pages
1. **index.html** - Home page with beer styles grid
2. **style.html** - Individual beer style with list of beers
3. **beer.html** - Individual beer details
4. **about.html** - About the PWA with features and tech stack
5. **settings.html** - Offline storage settings

### JavaScript Files
- **index.js** - Handles beer styles display on home page
- **style.js** - Manages beer list for specific styles
- **beer.js** - Displays individual beer details and fetches brewery data from Open Brewery DB API
- **service-worker.js** - Handles caching and offline functionality

### CSS Files
- **site.css** - Main stylesheet with all custom styles
- **material.min.css** - Material Design Lite framework

## Modern Design Implementation

### Navigation & Hero
- **Clean Navigation**: White background with black text, orange hover states
- **Modern Hero Section**: Purple gradient with background image overlay
- **Hero Structure**: 
  - Index page: Full hero with large title and subtitle
  - Sub-pages: Smaller hero with page-specific content

### Component Patterns

#### Beer Cards (index.html)
- Simple clean design with SRM gradient backgrounds
- Beer style name in supporting text
- "Learn more" button
- CSS Grid layout (auto-fill, minmax(280px, 1fr))
- Hover effects: lift and shadow enhancement

#### Enhanced Beer Cards (style.html)
- All features from index cards PLUS:
- **Stat Badges**: ABV and IBU in top-right corner with glass-morphism effect
- **Beer Glass Indicator**: Animated glass with SRM-colored fill in top-left
- **Glass Shine Effect**: Diagonal gradient overlay for realism
- **Carbonation Effect**: Bubble animation on hover
- **Grain Texture**: Subtle texture overlay

#### Feature Cards
- White cards on gradient backgrounds
- Material Icons for visual interest
- Hover lift effects
- Used on index.html and about.html

#### Footer
- 4-column grid layout (responsive)
- Brand, Quick Links, Resources, Features
- Dark gradient background
- Orange accent colors for links

### Filter Chips (index.html)
- Emoji + text labels
- Orange active state
- Categories: Pale Ales, IPAs, Stouts, Wheat, Lagers, All Styles
- IPA filter matches both "India Pale Ale" and "IPA"

### Search Functionality
- Modern rounded search box
- Material Icons search icon
- Real-time filtering with list.js library

## Data Integration

### Beer Styles Data
- Source: BreweryDB
- Local JSON files: `./data/styles.json`, `./data/beers-style-{id}-page-{page}.json`
- Structure includes: name, description, SRM, ABV, IBU, etc.

### Brewery Data Enhancement
- **API**: Open Brewery DB (`https://api.openbrewerydb.org/v1/breweries/search?query={name}`)
- **Implementation**: beer.js fetches additional brewery data and displays:
  - Brewery type
  - Location (address, city, state, postal code, country)
  - Phone number
- **Error Handling**: Silently fails if API unavailable

## Service Worker & PWA Features

### Caching Strategy
- Cache-first approach for offline functionality
- Named caches: 'beer-data', 'brewery-api'
- Network timeout: 4 seconds
- Offline notification shown when cached content is available

### Manifest
- Theme color: `#FB8C00`
- Icons: 96px, 144px, 192px, 240px
- Display: standalone
- Installable as native app

## Development Guidelines

### Code Style
- Use ES6+ features (arrow functions, template literals, const/let)
- Async/await for API calls when possible
- Minimal comments (code should be self-explanatory)
- Error handling with try/catch or .catch() for promises

### CSS Approach
- Mobile-first responsive design
- CSS Grid for layouts (not flexbox for main grids)
- Smooth transitions (0.3s ease)
- Use CSS custom properties sparingly
- Media queries at 768px (mobile/tablet) and 1024px (tablet/desktop)

### JavaScript Patterns
- Vanilla JavaScript (no frameworks)
- DOM manipulation after data fetch
- Template string replacement for dynamic content
- Event delegation where appropriate

### Performance Considerations
- Lazy load images when possible
- Minimize DOM manipulation
- Use CSS animations over JavaScript
- Skeleton loaders for perceived performance
- Cache API responses

## Important Implementation Details

### Card Generation
- **Index.html**: Uses CSS Grid, cards generated in index.js without nested mdl-grid wrappers
- **Style.html**: Similar pattern, adds enhanced styling (badges, glass indicator)
- **Both**: Use SRM gradients when no beer label image available

### Hero Content
- **Index**: Static content in HTML
- **Style**: Dynamic `#styleName` populated by style.js
- **Beer**: Dynamic `#beerName` and `#tagline` populated by beer.js

### Brewery Data Flow
1. Beer page loads from local JSON
2. JavaScript extracts brewery name
3. Fetches from Open Brewery DB API
4. Enhances brewery details section if data found
5. Falls back gracefully if API fails

## Common Pitfalls to Avoid

1. **Don't add nested mdl-grid wrappers** - CSS Grid handles layout
2. **Don't apply enhanced card styles to index.html** - Keep it simple there
3. **Don't forget mobile responsiveness** - Test at 768px breakpoint
4. **Don't break the Service Worker** - Maintain caching patterns
5. **Don't use duplicate IDs** - Fixed in recent refactor
6. **Don't add features to all pages** - Each page has specific styling (e.g., beer glass only on style.html)

## Future Enhancement Ideas

- Add more brewery APIs for richer data
- Implement beer style comparison feature
- Add user favorites/bookmarking
- Beer style quiz/game
- Interactive beer color scale visualization
- Map integration for breweries
- Social sharing features

## Testing Checklist

When making changes, verify:
- [ ] Offline functionality still works
- [ ] Service Worker caches correctly
- [ ] Mobile responsive (320px, 768px, 1024px)
- [ ] SRM gradients display correctly
- [ ] API calls handle errors gracefully
- [ ] Navigation works across all pages
- [ ] Footer displays correctly
- [ ] Cards render properly in grid layout
- [ ] Filter chips work (especially IPA filter)
- [ ] Search functionality operates smoothly

## Key Files to Reference

- `src/css/site.css` - All custom styles (5000+ lines)
- `src/js/index.js` - Home page beer styles
- `src/js/style.js` - Beer list by style
- `src/js/beer.js` - Individual beer + brewery API
- `src/index.html` - Main landing page with modern design
- `src/about.html` - Redesigned about page with feature showcase

## Contact & Attribution

- **Creator**: Dean Hume (http://deanhume.com)
- **Data Sources**: BreweryDB, Open Brewery DB
- **Last Updated**: April 2026
- **License**: Check LICENSE file in repo

---

## Quick Reference Commands

```bash
# Run the app (if using a local server)
npm start

# Build for production (if grunt is set up)
grunt build

# Test Service Worker
# Open Chrome DevTools > Application > Service Workers
```

## Notes for Copilot

- Always maintain the modern, clean design aesthetic
- Keep orange (`#FB8C00`) as the primary accent color
- Preserve PWA functionality - don't break Service Worker
- Use Material Icons for consistency
- Follow the established card patterns
- Keep code minimal and clean
- Test responsive design at every change
- Maintain SRM color accuracy for beer representation
