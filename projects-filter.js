// Project Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('#all-projects-grid .project-card');
    const filterTagsContainer = document.getElementById('filter-tags');
    const activeFiltersContainer = document.getElementById('active-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const projectCountEl = document.getElementById('project-count');
    const noResultsEl = document.getElementById('no-results');
    
    let activeFilters = new Set();
    let allTags = new Set();

    // Extract all unique tags from projects
    projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags').split(',');
        tags.forEach(tag => allTags.add(tag.trim()));
    });

    // Create filter buttons
    const sortedTags = Array.from(allTags).sort();
    sortedTags.forEach(tag => {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-tag-btn';
        filterBtn.textContent = tag;
        filterBtn.dataset.tag = tag;
        
        filterBtn.addEventListener('click', () => {
            toggleFilter(tag);
        });
        
        filterTagsContainer.appendChild(filterBtn);
    });

    // Toggle filter on/off
    function toggleFilter(tag) {
        if (activeFilters.has(tag)) {
            activeFilters.delete(tag);
        } else {
            activeFilters.add(tag);
        }
        updateUI();
        filterProjects();
    }

    // Update UI to show active filters
    function updateUI() {
        // Update filter button states
        document.querySelectorAll('.filter-tag-btn').forEach(btn => {
            if (activeFilters.has(btn.dataset.tag)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update active filters display
        activeFiltersContainer.innerHTML = '';
        if (activeFilters.size > 0) {
            activeFilters.forEach(tag => {
                const badge = document.createElement('span');
                badge.className = 'active-filter-badge';
                badge.innerHTML = `
                    ${tag}
                    <button class="remove-filter" data-tag="${tag}" aria-label="Remove ${tag} filter">
                        <i class='bx bx-x'></i>
                    </button>
                `;
                
                badge.querySelector('.remove-filter').addEventListener('click', () => {
                    toggleFilter(tag);
                });
                
                activeFiltersContainer.appendChild(badge);
            });
            activeFiltersContainer.style.display = 'flex';
            clearFiltersBtn.style.display = 'inline-block';
        } else {
            activeFiltersContainer.style.display = 'none';
            clearFiltersBtn.style.display = 'none';
        }
    }

    // Filter projects based on active filters
    function filterProjects() {
        let visibleCount = 0;

        projectCards.forEach(card => {
            if (activeFilters.size === 0) {
                // No filters active - show all
                card.style.display = 'block';
                visibleCount++;
            } else {
                // Check if card has all active filter tags
                const cardTags = card.getAttribute('data-tags').split(',').map(t => t.trim());
                const hasAllTags = Array.from(activeFilters).every(filter => 
                    cardTags.includes(filter)
                );

                if (hasAllTags) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });

        // Update count
        projectCountEl.textContent = visibleCount;

        // Show/hide no results message
        if (visibleCount === 0) {
            noResultsEl.style.display = 'flex';
        } else {
            noResultsEl.style.display = 'none';
        }
    }

    // Clear all filters
    clearFiltersBtn.addEventListener('click', () => {
        activeFilters.clear();
        updateUI();
        filterProjects();
    });

    // Initialize
    updateUI();
    filterProjects();

    // Animate filter tags on load
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const filterBtns = document.querySelectorAll('.filter-tag-btn');
                filterBtns.forEach((btn, index) => {
                    setTimeout(() => {
                        btn.classList.add('visible');
                    }, index * 30);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (filterTagsContainer) {
        observer.observe(filterTagsContainer);
    }
});
