// Global state
let caseData = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Fetch case data from API
        const response = await fetch('/api/case-data');
        caseData = await response.json();

        // Render all sections
        renderHeader();
        renderOverview();
        renderTimeline();
        renderEvidence();
        renderLegalClaims();
        renderImpact();

        // Initialize navigation
        initializeNavigation();

        // Initialize search
        initializeSearch();

        // Initialize back to top button
        initializeBackToTop();

        // Hide loading screen
        document.getElementById('loading').classList.add('hidden');

    } catch (error) {
        console.error('Error loading case data:', error);
        document.getElementById('loading').innerHTML = '<p>Error loading case data. Please refresh the page.</p>';
    }
}

function renderHeader() {
    document.getElementById('caseTitle').textContent = caseData.title;
    document.getElementById('caseSubtitle').textContent = caseData.subtitle;
    document.getElementById('lastUpdated').textContent = caseData.lastUpdated;
}

function renderOverview() {
    // Summary
    document.getElementById('overviewSummary').textContent = caseData.overview.summary;

    // Key points
    const keyPointsList = document.getElementById('keyPointsList');
    caseData.overview.keyPoints.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        keyPointsList.appendChild(li);
    });

    // Medical status
    const conditionsList = document.getElementById('medicalConditions');
    caseData.medicalStatus.conditions.forEach(condition => {
        const li = document.createElement('li');
        li.textContent = condition;
        conditionsList.appendChild(li);
    });

    document.getElementById('medicalImpact').textContent = caseData.medicalStatus.impact;
    document.getElementById('familyConflict').textContent = caseData.medicalStatus.familyConflict;
}

function renderTimeline() {
    const container = document.getElementById('timelineContainer');

    caseData.timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        // Add critical class for important events
        if (item.event.includes('CRITICAL') || item.event.includes('Mother Removes')) {
            timelineItem.classList.add('critical');
        }

        const date = document.createElement('div');
        date.className = 'timeline-date';
        date.textContent = item.date;

        const event = document.createElement('div');
        event.className = 'timeline-event';
        event.textContent = item.event;

        const details = document.createElement('div');
        details.className = 'timeline-details';
        details.textContent = item.details;

        const significance = document.createElement('div');
        significance.className = 'timeline-significance';
        significance.innerHTML = `<strong>Significance:</strong> ${item.significance}`;

        timelineItem.appendChild(date);
        timelineItem.appendChild(event);
        timelineItem.appendChild(details);
        timelineItem.appendChild(significance);

        container.appendChild(timelineItem);
    });
}

function renderEvidence() {
    const container = document.getElementById('evidenceContainer');

    caseData.evidence.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card evidence-item';

        let cardContent = `
            <div class="card-header">
                <span class="evidence-category">${item.category}</span>
                <h3>${item.title}</h3>
            </div>
            <div class="card-body">
                <p>${item.description}</p>
        `;

        if (item.quote) {
            cardContent += `<div class="quote">"${item.quote}"</div>`;
        }

        if (item.violations) {
            cardContent += '<h4>Violations:</h4><ul class="evidence-list">';
            item.violations.forEach(violation => {
                cardContent += `<li>${violation}</li>`;
            });
            cardContent += '</ul>';
        }

        if (item.evidence) {
            cardContent += '<h4>Evidence:</h4><ul class="evidence-list">';
            item.evidence.forEach(evid => {
                cardContent += `<li>${evid}</li>`;
            });
            cardContent += '</ul>';
        }

        if (item.shiftingRationales) {
            cardContent += '<h4>Shifting Rationales:</h4><ol class="evidence-list">';
            item.shiftingRationales.forEach(rationale => {
                cardContent += `<li>${rationale}</li>`;
            });
            cardContent += '</ol>';
        }

        if (item.problems) {
            cardContent += '<h4>Problems:</h4><ul class="evidence-list">';
            item.problems.forEach(problem => {
                cardContent += `<li>${problem}</li>`;
            });
            cardContent += '</ul>';
        }

        if (item.facts) {
            cardContent += '<h4>Facts:</h4><ul class="evidence-list">';
            item.facts.forEach(fact => {
                cardContent += `<li>${fact}</li>`;
            });
            cardContent += '</ul>';
        }

        if (item.questions) {
            cardContent += '<h4>Unanswered Questions:</h4><ul class="evidence-list">';
            item.questions.forEach(question => {
                cardContent += `<li>${question}</li>`;
            });
            cardContent += '</ul>';
        }

        if (item.doubleStandard) {
            cardContent += `<h4>Double Standard:</h4><p class="text-danger"><strong>${item.doubleStandard}</strong></p>`;
        }

        if (item.motherConflict) {
            cardContent += '<h4>Mother\'s Conflict of Interest:</h4><ul class="evidence-list">';
            item.motherConflict.forEach(conflict => {
                cardContent += `<li>${conflict}</li>`;
            });
            cardContent += '</ul>';
        }

        if (item.significance) {
            cardContent += `<div class="timeline-significance"><strong>Significance:</strong> ${item.significance}</div>`;
        }

        if (item.conclusion) {
            cardContent += `<div class="timeline-significance"><strong>Conclusion:</strong> ${item.conclusion}</div>`;
        }

        cardContent += '</div>';
        card.innerHTML = cardContent;
        container.appendChild(card);
    });

    // Render systematic bad faith
    const badFaithContainer = document.getElementById('systematicBadFaithContainer');
    caseData.systematicBadFaith.points.forEach(point => {
        const pointDiv = document.createElement('div');
        pointDiv.className = 'bad-faith-point';
        pointDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start;">
                <span class="bad-faith-number">${point.number}</span>
                <div style="flex: 1;">
                    <div class="bad-faith-title">${point.title}</div>
                    <p>${point.description}</p>
                    <div class="timeline-significance" style="margin-top: 0.5rem;">
                        <strong>Significance:</strong> ${point.significance}
                    </div>
                </div>
            </div>
        `;
        badFaithContainer.appendChild(pointDiv);
    });
}

function renderLegalClaims() {
    const container = document.getElementById('legalClaimsContainer');

    caseData.legalClaims.forEach(claim => {
        const card = document.createElement('div');
        card.className = 'card legal-claim';

        let cardContent = `
            <div class="card-header">
                <h3>${claim.title}</h3>
            </div>
            <div class="card-body">
                <p>${claim.description}</p>
        `;

        if (claim.violations) {
            cardContent += '<div class="violations-list"><h4>Specific Violations:</h4><ul class="evidence-list">';
            claim.violations.forEach(violation => {
                cardContent += `<li>${violation}</li>`;
            });
            cardContent += '</ul></div>';
        }

        if (claim.damages) {
            cardContent += `<div class="timeline-significance" style="margin-top: 1rem;"><strong>Damages:</strong> ${claim.damages}</div>`;
        }

        if (claim.significance) {
            cardContent += `<div class="timeline-significance" style="margin-top: 1rem;"><strong>Significance:</strong> ${claim.significance}</div>`;
        }

        cardContent += '</div>';
        card.innerHTML = cardContent;
        container.appendChild(card);
    });

    // Render damages
    const damagesContainer = document.getElementById('damagesContainer');
    const damageCategories = [
        { title: 'Economic Damages', items: caseData.damages.economic },
        { title: 'Statutory Damages', items: caseData.damages.statutory },
        { title: 'Punitive Damages', items: caseData.damages.punitive },
        { title: 'Personal Damages', items: caseData.damages.personal }
    ];

    damageCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'damage-category';
        let content = `<h4>${category.title}</h4><ul>`;
        category.items.forEach(item => {
            content += `<li>${item}</li>`;
        });
        content += '</ul>';
        categoryDiv.innerHTML = content;
        damagesContainer.appendChild(categoryDiv);
    });
}

function renderImpact() {
    const container = document.getElementById('impactContainer');

    const impactSections = [
        { title: 'Medical Impact', content: caseData.personalImpact.medical },
        { title: 'July 13, 2025 Accident & Wheelchair Confinement', content: caseData.personalImpact.july13Accident },
        { title: 'Family Conflict of Interest', content: caseData.personalImpact.familyConflict },
        { title: 'Daughter Madison - U.S. Marine Corps', content: caseData.personalImpact.daughterMadison },
        { title: 'Timeline of Suffering', content: caseData.personalImpact.timeline }
    ];

    impactSections.forEach(section => {
        const card = document.createElement('div');
        card.className = 'card impact-item';
        card.innerHTML = `
            <div class="card-header">
                <h3>${section.title}</h3>
            </div>
            <div class="card-body">
                <p>${section.content}</p>
            </div>
        `;
        container.appendChild(card);
    });

    // Add conclusion
    const conclusionCard = document.createElement('div');
    conclusionCard.className = 'card alert-danger';
    conclusionCard.innerHTML = `
        <div class="card-header">
            <h3>Conclusion</h3>
        </div>
        <div class="card-body">
            <p><strong>Case Evolution:</strong> ${caseData.conclusion.evolution}</p>
            <h4 style="margin-top: 1.5rem;">Progressive's Potential Exposure:</h4>
            <ul class="evidence-list">
                ${caseData.conclusion.progressiveExposure.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <div class="timeline-significance" style="margin-top: 1.5rem;">
                <strong>Case Strength:</strong> ${caseData.conclusion.caseStrength}
            </div>
        </div>
    `;
    container.appendChild(conclusionCard);
}

function initializeNavigation() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Close mobile menu if open
            document.querySelector('.nav-menu').classList.remove('active');
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const resultsContainer = document.getElementById('searchResults');

    if (!query) {
        resultsContainer.innerHTML = '<div class="no-results">Please enter a search term</div>';
        return;
    }

    resultsContainer.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.results.length === 0) {
            resultsContainer.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
            return;
        }

        let html = `<h3>Found ${data.results.length} results for "${query}"</h3>`;

        data.results.forEach(result => {
            const highlightedContent = highlightText(result.content, query);
            const highlightedContext = highlightText(result.context, query);

            html += `
                <div class="search-result">
                    <div class="search-result-document">${result.document}</div>
                    <div class="search-result-line">Line ${result.lineNumber}</div>
                    <div class="search-result-content">${highlightedContent}</div>
                    <div class="search-result-context">${highlightedContext}</div>
                </div>
            `;
        });

        resultsContainer.innerHTML = html;

    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<div class="no-results">Error performing search. Please try again.</div>';
    }
}

function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function downloadDocument(filename) {
    window.location.href = `/api/download/${filename}`;
}

function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
