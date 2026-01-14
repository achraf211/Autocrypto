// ===================================
// AutoCrypto Online - Main JavaScript
// ===================================

// BTC Price API
async function updateBTCPrice() {
    try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const data = await response.json();
        const price = data.bpi.USD.rate_float;
        const change = (Math.random() * 10 - 5).toFixed(2); // Simulated change
        
        // Update price
        document.getElementById('btcPrice').textContent = `$${price.toLocaleString('en-US', {maximumFractionDigits: 2})}`;
        
        // Update change
        const changeElement = document.getElementById('btcChange');
        changeElement.textContent = `${change >= 0 ? '+' : ''}${change}%`;
        changeElement.classList.toggle('positive', change >= 0);
        changeElement.classList.toggle('negative', change < 0);
        
        // Update volume (simulated)
        const volume = (Math.random() * 50 + 20).toFixed(2);
        document.getElementById('btcVolume').textContent = `$${volume}B`;
        
        // Update active traders (simulated)
        const traders = Math.floor(Math.random() * 500 + 1000);
        document.getElementById('activeTraders').textContent = traders.toLocaleString();
    } catch (error) {
        console.error('Error fetching BTC price:', error);
        // Fallback values
        document.getElementById('btcPrice').textContent = '$43,250.00';
        document.getElementById('btcChange').textContent = '+2.5%';
        document.getElementById('btcVolume').textContent = '$35.2B';
        document.getElementById('activeTraders').textContent = '1,247';
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate numbers on scroll
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Update BTC price
    updateBTCPrice();
    // Refresh every 30 seconds
    setInterval(updateBTCPrice, 30000);
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Utility functions
const utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    formatNumber: (num) => {
        return num.toLocaleString('en-US', {maximumFractionDigits: 2});
    },
    
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },
    
    showNotification: (message, type = 'success') => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Export for use in other scripts
window.AutoCrypto = {
    utils,
    updateBTCPrice
};