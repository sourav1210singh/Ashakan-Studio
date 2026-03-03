# Ashkan Studios WordPress Theme

A custom WordPress theme for Ashkan Studios - Full-Service Production Studio.

## Theme Information

- **Theme Name:** Ashkan Studios
- **Version:** 1.0.0
- **Author:** Ashkan Studios
- **License:** GPL v2 or later

## Features

- Custom Post Types: Portfolio, Services, Storytime, Press
- Responsive Design
- Custom Menu Overlay
- Smooth Animations
- SEO Friendly Structure
- ACF Integration

## Installation

### Method 1: WordPress Admin

1. Download the theme ZIP file
2. Go to **Appearance > Themes** in WordPress admin
3. Click **Add New** > **Upload Theme**
4. Upload the ZIP file and click **Install Now**
5. Click **Activate**

### Method 2: FTP/SFTP

1. Extract the theme ZIP file
2. Upload the `ashkan-studios-wp-theme` folder to `/wp-content/themes/`
3. Go to **Appearance > Themes** in WordPress admin
4. Find "Ashkan Studios" and click **Activate**

## Required Plugins

- **Advanced Custom Fields (ACF)** - For theme options and custom fields
- **Classic Editor** (optional) - If you prefer classic editor over Gutenberg

## Theme Setup

### 1. Create Required Pages

Create the following pages with these slugs:

- **Home** (slug: `home`) - Set as Front Page
- **About** (slug: `about`)
- **Contact** (slug: `contact`)
- **Studio** (slug: `studio`)

### 2. Configure Reading Settings

1. Go to **Settings > Reading**
2. Set "Your homepage displays" to "A static page"
3. Select "Home" as Homepage
4. Save changes

### 3. Configure Theme Settings (ACF)

Go to **Theme Settings** in the admin sidebar and configure:

#### General Settings
- Logo
- Favicon
- Email Address
- Phone Number
- Address

#### Social Links
- Instagram URL
- LinkedIn URL
- TikTok URL

#### Hero Section
- Hero Headline
- Hero Description
- Hero Cutout Images (3 floating images)

#### Clients
- Add client logos

#### Services Section
- Background Image
- Headline
- Description

#### About Section
- Headline
- Paragraphs
- Featured Image

### 4. Create Menu

1. Go to **Appearance > Menus**
2. Create a new menu named "Primary Menu"
3. Add pages: Work, What We Do, The Studio, About, Contact, Storytime
4. Set display location to "Primary Menu"
5. Save menu

### 5. Set Up Custom Post Types

#### Portfolio
1. Go to **Portfolio > Add New**
2. Add portfolio items with featured images
3. Assign categories (Photography, Videography, Campaigns)

#### Services
1. Go to **Services > Add New**
2. Add services: Photographers, Cinematographers, Directors, etc.

#### Storytime
1. Go to **Storytime > Add New**
2. Add blog posts/stories

#### Press
1. Go to **Press > Add New**
2. Add press items

## File Structure

```
ashkan-studios-wp-theme/
├── css/
│   └── (additional styles if needed)
├── js/
│   └── main.js
├── images/
│   └── (theme images)
├── template-parts/
│   └── (template parts if needed)
├── inc/
│   └── (additional PHP includes)
├── style.css
├── functions.php
├── header.php
├── footer.php
├── index.php
├── page.php
├── single.php
├── archive.php
├── single-portfolio.php
└── README.md
```

## Customization

### Colors
Edit CSS variables in `style.css`:

```css
:root {
    --black: #1a1a1a;
    --white: #ffffff;
    --accent: #c9a962;
    --bg-primary: #faf8f5;
    --bg-dark: #1a1a1a;
}
```

### Fonts
The theme uses Google Fonts (Anton for headings, Inter for body text). To change:

1. Edit `functions.php` enqueue section
2. Update font URLs
3. Update CSS font-family declarations

## Support

For theme support, contact: hello@ashkanstudios.com

## Changelog

### 1.0.0
- Initial release
- Custom post types: Portfolio, Services, Storytime, Press
- Responsive design
- Menu overlay
- Smooth animations
