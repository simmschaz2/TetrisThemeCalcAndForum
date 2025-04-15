// Math Forum JavaScript functionality

// DOM Elements
const postForm = document.getElementById('post-form');
const postsList = document.getElementById('posts-list');
const filterPosts = document.getElementById('filter-posts');
const usernameInput = document.getElementById('username');
const equationInput = document.getElementById('equation');
const contextInput = document.getElementById('context');

// Sample initial posts (for demonstration)
let posts = [
    {
        id: 1,
        author: 'MathStudent22',
        date: '2025-04-14',
        equation: '2x + 5 = 13',
        context: 'Need to solve for x. Steps would be helpful!',
        solved: true,
        solution: 'Step 1: Subtract 5 from both sides: 2x = 8\nStep 2: Divide both sides by 2: x = 4\nTherefore, x = 4'
    },
    {
        id: 2,
        author: 'Anonymous',
        date: '2025-04-15',
        equation: '∫(x^2 + 3x + 2) dx',
        context: 'Working on calculus homework. Need to find this indefinite integral.',
        solved: true,
        solution: 'Step 1: Integrate term by term\nStep 2: ∫x^2 dx = x^3/3\nStep 3: ∫3x dx = 3x^2/2\nStep 4: ∫2 dx = 2x\nTherefore, ∫(x^2 + 3x + 2) dx = x^3/3 + 3x^2/2 + 2x + C, where C is a constant of integration.'
    },
    {
        id: 3,
        author: 'GeometryLover',
        date: '2025-04-15',
        equation: 'Find the area of a circle with radius 5cm',
        context: '',
        solved: false,
        solution: ''
    }
];

// Load saved posts from localStorage if they exist
function loadSavedPosts() {
    const savedPosts = localStorage.getItem('mathBlogPosts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('mathBlogPosts', JSON.stringify(posts));
}

// Format date to display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Create HTML for a single post
function createPostHTML(post) {
    const postElement = document.createElement('div');
    postElement.className = `post-item ${post.solved ? 'solved' : 'unsolved'}`;
    postElement.dataset.id = post.id;
    
    postElement.innerHTML = `
        <div class="status-indicator ${post.solved ? 'solved' : 'unsolved'}"></div>
        <div class="post-header">
            <span class="post-author">${post.author}</span>
            <span class="post-date">${formatDate(post.date)}</span>
        </div>
        <div class="post-equation">${escapeHTML(post.equation)}</div>
        ${post.context ? `<div class="post-context">${escapeHTML(post.context)}</div>` : ''}
        
        ${post.solved ? 
            `<div class="solution-container">
                <div class="solution-header">SOLUTION:</div>
                <div class="solution-text">${formatSolution(post.solution)}</div>
             </div>` : 
            `<button class="solve-button" data-id="${post.id}">SOLVE THIS PROBLEM</button>
             <div class="solution-form" id="solution-form-${post.id}">
                <textarea class="solution-input" placeholder="Enter your solution here..."></textarea>
                <button class="submit-solution-button" data-id="${post.id}">SUBMIT SOLUTION</button>
             </div>`
        }
    `;
    
    return postElement;
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Format solution text with line breaks
function formatSolution(solution) {
    return solution.replace(/\n/g, '<br>');
}

// Display all posts based on filter
function displayPosts(filter = 'all') {
    postsList.innerHTML = '';
    
    let filteredPosts = [...posts];
    
    if (filter === 'solved') {
        filteredPosts = posts.filter(post => post.solved);
    } else if (filter === 'unsolved') {
        filteredPosts = posts.filter(post => !post.solved);
    }
    
    // Sort posts newest first
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredPosts.length === 0) {
        postsList.innerHTML = '<div class="no-posts">No math problems found. Be the first to post one!</div>';
        return;
    }
    
    filteredPosts.forEach(post => {
        postsList.appendChild(createPostHTML(post));
    });
    
    // Add event listeners to solve buttons
    document.querySelectorAll('.solve-button').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.id;
            const solutionForm = document.getElementById(`solution-form-${postId}`);
            solutionForm.classList.add('active');
            this.style.display = 'none';
        });
    });
    
    // Add event listeners to submit solution buttons
    document.querySelectorAll('.submit-solution-button').forEach(button => {
        button.addEventListener('click', function() {
            const postId = parseInt(this.dataset.id);
            const solutionInput = this.previousElementSibling;
            const solution = solutionInput.value.trim();
            
            if (solution) {
                // Find the post and update it
                const postIndex = posts.findIndex(post => post.id === postId);
                if (postIndex !== -1) {
                    posts[postIndex].solved = true;
                    posts[postIndex].solution = solution;
                    
                    // Save and redisplay posts
                    savePosts();
                    displayPosts(filterPosts.value);
                }
            }
        });
    });
}

// Add a new post
function addNewPost(author, equation, context) {
    const newPost = {
        id: Date.now(), // Use timestamp as ID
        author: author || 'Anonymous',
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        equation: equation,
        context: context,
        solved: false,
        solution: ''
    };
    
    posts.unshift(newPost);
    savePosts();
    displayPosts(filterPosts.value);
}

// Initialize the blog
function initMathBlog() {
    loadSavedPosts();
    displayPosts();
    
    // Handle form submission
    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const author = usernameInput.value.trim();
        const equation = equationInput.value.trim();
        const context = contextInput.value.trim();
        
        if (equation) {
            addNewPost(author, equation, context);
            
            // Clear form
            usernameInput.value = '';
            equationInput.value = '';
            contextInput.value = '';
        }
    });
    
    // Handle filter change
    filterPosts.addEventListener('change', function() {
        displayPosts(this.value);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMathBlog);