

document.addEventListener('DOMContentLoaded', () => {
    // Principal Interface References
    const scrollArrow = document.getElementById('scrollArrow');
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    
    const sections = document.querySelectorAll('main, section');
    const navLinks = document.querySelectorAll('.tab-link');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const profileImg = document.querySelector('.profile-img');

    // =========================================================================
    // STATIC PARAMETRIC FILTER SYSTEM
    // =========================================================================
    const categoryContainer = document.getElementById('bubbleContainer'); // Kept ID for HTML mapping
    const showcaseContainer = document.querySelector('.project-data-showcase');
    
    if (categoryContainer && showcaseContainer) {
        // Structured Data Models
        const categories = [
            { "name": "#Data-Analatics" },
            { "name": "#Data-Science" },
            { "name": "#CFD" },
            { "name": "#Structural-Analysis" },
            { "name": "#AI/ML" },
            { "name": "#Automation" },
            { "name": "#Financal-Engg." },
            { "name": "#Mechanical-Design" },
            { "name": "#DFM" },
            { "name": "#Productivity" },
            { "name": "#OS" },
            { "name": "#Robotics+IoT" },
            { "name": "#System-Engineering" },
            { "name": "#Dynamic-Systems" },
            { "name": "#Mechatronics" },
            { "name": "#Mathathematics" },
            { "name": "#Reversed-Engineering" },
            { "name": "#Propulsion" },
            { "name": "#Software" }
        ];

        const projectItems = [
            { 
                "label_name": "Project A", 
                "hyperlink": "./maintenance/maintenance.html",
                "tags": ["#AI/ML", "#Automation"] 
            },
            { 
                "label_name": "Project B", 
                "hyperlink": "./maintenance/maintenance.html",
                "tags": ["#AI/ML", "#Automation"] 
            },
            { 
                "label_name": "Project C", 
                "hyperlink": "./maintenance/maintenance.html",
                "tags": ["#AI/ML", "#Automation"] 
            },
            {
                "label_name": "Project D",
                "hyperlink": "./maintenance/maintenance.html",
                "tags": ["#AI/ML", "#Automation"] 
            },
            { 
                "label_name": "Project E", 
                "hyperlink": "./maintenance/maintenance.html",
                "tags": ["#AI/ML", "#Automation"] 
            },
            { 
                "label_name": "Project F", 
                "hyperlink": "./maintenance/maintenance.html",
                "tags": ["#AI/ML", "#Automation"] 
            },
            {
                "label_name": "Project G",
                "hyperlink": "./maintenance/maintenance.html",
                "tags": ["#AI/ML", "#Automation"] 
            }
        ];

        let selectedTags = new Set();

        /**
         * Renders the filtered project list based on active filter tags.
         */
        const updateProjectShowcase = () => {
            showcaseContainer.innerHTML = '';
            
            if (selectedTags.size === 0) {
                showcaseContainer.innerHTML = '<p class="showcase-placeholder">Select categories above to filter the project registry.</p>';
                return;
            }

            const filteredProjects = projectItems.filter(project => {
                return Array.from(selectedTags).every(requiredTag => project.tags.includes(requiredTag));
            });

            if (filteredProjects.length === 0) {
                showcaseContainer.innerHTML = '<p class="showcase-empty-alert">No projects match all selected criteria.</p>';
                return;
            }

            const listFragment = document.createDocumentFragment();
            filteredProjects.forEach(proj => {
                const card = document.createElement('a');
                card.href = proj.hyperlink;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                card.className = 'project-link-card';
                
                const textSpan = document.createElement('span');
                textSpan.className = 'project-link-text';
                textSpan.textContent = proj.label_name;

                card.appendChild(textSpan);
                listFragment.appendChild(card);
            });
            showcaseContainer.appendChild(listFragment);
        };

        // Initialize Filter Buttons in a clean grid layout framework
        categoryContainer.className = 'bubble-container'; // Mapped back to premium CSS class definition
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'mono-filter-btn'; // Restored base theme design class token
            btn.textContent = cat.name;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (selectedTags.has(cat.name)) {
                    selectedTags.delete(cat.name);
                    btn.classList.remove('active');
                } else {
                    selectedTags.add(cat.name);
                    btn.classList.add('active');
                }
                updateProjectShowcase();
            });
            categoryContainer.appendChild(btn);
        });

        updateProjectShowcase();
    }
    
    // =========================================================================
    // STANDARD WINDOW UTILITIES (NAVIGATION & SCROLL)
    // =========================================================================
    if (profileImg) {
        if (profileImg.complete) profileImg.classList.add('loaded');
        profileImg.addEventListener('load', () => profileImg.classList.add('loaded'));
    }

    if (scrollArrow) {
        scrollArrow.addEventListener('click', (e) => {
            e.preventDefault();
            const currentScroll = window.scrollY;
            let targetSection = sections[0];

            for (let section of sections) {
                if (section.offsetTop > currentScroll + 50) {
                    targetSection = section;
                    break;
                }
            }
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const toggleDrawer = () => {
        if (window.innerWidth >= 1025) return;
        [menuToggle, mobileDrawer, drawerOverlay].forEach(el => el?.classList.toggle('open'));
    };

    if (menuToggle && mobileDrawer && drawerOverlay) {
        [menuToggle, drawerOverlay].forEach(el => el.addEventListener('click', toggleDrawer));
        drawerLinks.forEach(link => link.addEventListener('click', toggleDrawer));
    }

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const currentScrollY = window.scrollY;
        
        sections.forEach(section => {
            if (currentScrollY >= section.offsetTop - 150) currentSectionId = section.getAttribute('id');
        });

        [navLinks, drawerLinks].forEach(linkSet => {
            linkSet.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.toggle('active', href && href.includes(currentSectionId));
            });
        });
    }, { passive: true });
});
