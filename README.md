# Interactive Portfolio Website

A customizable and interactive portfolio website template designed to showcase your projects and skills. This template is ready to be hosted on GitHub Pages.

## Features

- **Responsive Design**: Looks great on all devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Interactive Elements**: Smooth scrolling, animations, and project filtering
- **Customizable**: Easy to personalize with your own information
- **Contact Form**: Ready-to-use contact form (requires backend integration for actual submission)
- **Project Showcase**: Filterable project cards to highlight your work
- **Skills Section**: Visual representation of your skills with progress bars
- **Mobile-Friendly Navigation**: Hamburger menu for smaller screens

## Getting Started

### Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- A GitHub account (for hosting on GitHub Pages)
- A code editor (VS Code, Sublime Text, etc.)

### Customization

1. **Personal Information**:
   - Update your name, title, and description in the `index.html` file
   - Replace placeholder text in the About section with your own information
   - Update contact information in the Contact section

2. **Projects**:
   - Add your own projects by duplicating the project card structure in the Projects section
   - Update project titles, descriptions, tags, and links
   - Add your own project images to the `assets/images` directory

3. **Skills**:
   - Update the skills in the Skills section to reflect your own expertise
   - Adjust the progress bars to represent your proficiency levels

4. **Styling**:
   - Customize colors by modifying the CSS variables in the `:root` selector in `css/style.css`
   - Change fonts, spacing, or other styling elements as desired

5. **Profile Image**:
   - Replace the profile image placeholder with your own photo by adding it to `assets/images` and updating the image path in the HTML

### Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Push your customized portfolio code to the repository
3. Go to the repository settings
4. Scroll down to the GitHub Pages section
5. Select the branch you want to deploy (usually `main` or `master`)
6. Your site will be published at `https://yourusername.github.io/repository-name/`

## File Structure

```
portfolio/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── script.js           # JavaScript functionality
├── assets/
│   └── images/             # Directory for images
│       └── ...             # Your images go here
└── README.md               # This file
```

## Customization Tips

### Changing the Color Scheme

To change the color scheme, modify the CSS variables in the `:root` selector in `css/style.css`:

```css
:root {
    --primary-color: #4a6cf7;      /* Change this to your preferred primary color */
    --secondary-color: #6c757d;    /* Change this to your preferred secondary color */
    /* ... other color variables ... */
}
```

### Adding More Projects

To add more projects, duplicate the project card structure in the Projects section:

```html
<div class="project-card" data-category="your-category">
    <div class="project-img">
        <img src="assets/images/your-project-image.jpg" alt="Project Title">
    </div>
    <div class="project-info">
        <h3>Your Project Title</h3>
        <p>Your project description goes here.</p>
        <div class="project-tags">
            <span>Tag 1</span>
            <span>Tag 2</span>
            <span>Tag 3</span>
        </div>
        <div class="project-links">
            <a href="#" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>
            <a href="#" target="_blank" class="project-link"><i class="fab fa-github"></i> Source Code</a>
        </div>
    </div>
</div>
```

### Adding New Sections

To add a new section, follow the structure of existing sections:

1. Create a new section element with an ID and class
2. Add a container div
3. Add a section header with a title and underline
4. Add your content
5. Style the new section in the CSS file
6. Add a navigation link in the header

### Modifying the Typed Text

To change the typing animation text, modify the `textArray` in `js/script.js`:

```javascript
const textArray = ['Web Developer', 'Designer', 'Your Text Here', 'Another Text'];
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Font Awesome for the icons
- Google Fonts for the typography
- Inspiration from various portfolio designs across the web
