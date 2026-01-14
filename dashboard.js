// ===================================
// Dashboard JavaScript
// ===================================

// User data (simulated - will come from backend)
let userData = {
    balance: 675.00,
    todayProfit: 35.00,
    activeTrades: 12,
    availableBalance: 175.00,
    plan: {
        name: 'Professional Plan',
        investment: 500.00,
        dailyReturn: 7,
        daysActive: 5,
        totalEarned: 175.00,
        targetReturn: 500.00
    }
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    initProfitChart();
    startLiveTradingSimulation();
    updateTransactions();
    
    // Update stats every 10 seconds
    setInterval(updateDashboardStats, 10000);
});

// Update Dashboard Statistics
function updateDashboardStats() {
    // Simulate small profit increases
    userData.todayProfit += (Math.random() * 2);
    userData.balance += (Math.random() * 2);
    
    // Update DOM elements
    document.getElementById('totalBalance').textContent = `$${userData.balance.toFixed(2)}`;
    document.getElementById('todayProfit').textContent = `+$${userData.todayProfit.toFixed(2)}`;
    document.getElementById('activeTrades').textContent = userData.activeTrades;
    document.getElementById('availableBalance').textContent = `$${userData.availableBalance.toFixed(2)}`;
    
    // Update changes
    const balanceChange = ((userData.todayProfit / userData.balance) * 100).toFixed(2);
    document.getElementById('balanceChange').textContent = `+${balanceChange}%`;
    
    const profitChange = (Math.random() * 5 + 3).toFixed(2);
    document.getElementById('profitChange').textContent = `+${profitChange}%`;
    
    // Update plan info
    updatePlanInfo();
}

// Update Plan Information
function updatePlanInfo() {
    const roiProgress = (userData.plan.totalEarned / userData.plan.targetReturn * 100).toFixed(0);
    document.querySelector('.progress-fill').style.width = `${roiProgress}%`;
    document.querySelector('.progress-percent').textContent = `${roiProgress}%`;
    document.querySelector('.progress-stats span:first-child').textContent = `Earned: $${userData.plan.totalEarned.toFixed(2)}`;
}

// Initialize Profit Chart
function initProfitChart() {
    const ctx = document.getElementById('profitChart');
    if (!ctx) return;
    
    // Generate data for last 7 days
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push((userData.plan.dailyReturn / 100 * userData.plan.investment) * (7 - i) + Math.random() * 10);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Profit',
                data: data,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Profit: $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

// Live Trading Simulation
const tradingPairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT'];
const icons = ['fa-bitcoin', 'fa-ethereum', 'fa-coins', 'fa-coins', 'fa-coins'];

function startLiveTradingSimulation() {
    const tradingList = document.getElementById('tradingList');
    if (!tradingList) return;
    
    // Add new trade every 5-15 seconds
    setInterval(() => {
        addNewTrade();
    }, Math.random() * 10000 + 5000);
    
    // Update trades count
    setInterval(() => {
        const count = parseInt(document.getElementById('tradesCount').textContent);
        document.getElementById('tradesCount').textContent = count + 1;
    }, 30000);
}

function addNewTrade() {
    const tradingList = document.getElementById('tradingList');
    const existingTrades = tradingList.querySelectorAll('.trade-row');
    
    // Remove oldest if more than 5
    if (existingTrades.length >= 5) {
        existingTrades[existingTrades.length - 1].remove();
    }
    
    // Generate random trade
    const pairIndex = Math.floor(Math.random() * tradingPairs.length);
    const pair = tradingPairs[pairIndex];
    const icon = icons[pairIndex];
    const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const amount = (Math.random() * 300 + 100).toFixed(2);
    const profit = (Math.random() * 10 + 1).toFixed(2);
    
    const tradeRow = document.createElement('div');
    tradeRow.className = 'trade-row';
    tradeRow.style.opacity = '0';
    tradeRow.innerHTML = `
        <div class="trade-info">
            <div class="trade-pair">
                <i class="fab ${icon}"></i>
                ${pair}
            </div>
            <div class="trade-time">Just now</div>
        </div>
        <div class="trade-details">
            <div class="trade-type ${type.toLowerCase()}">${type}</div>
            <div class="trade-amount">$${amount}</div>
        </div>
        <div class="trade-profit success">+$${profit}</div>
    `;
    
    // Insert at beginning
    tradingList.insertBefore(tradeRow, tradingList.firstChild);
    
    // Fade in animation
    setTimeout(() => {
        tradeRow.style.transition = 'opacity 0.5s';
        tradeRow.style.opacity = '1';
    }, 100);
    
    // Update time for existing trades
    updateTradesTimes();
}

function updateTradesTimes() {
    const times = ['Just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago'];
    document.querySelectorAll('.trade-time').forEach((el, index) => {
        if (times[index]) {
            el.textContent = times[index];
        }
    });
}

// Update Transactions
function updateTransactions() {
    // This will be populated from backend
    // For now, using static data from HTML
}

// Chart Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // In real implementation, this would reload chart data
        const period = this.dataset.period;
        console.log('Filter changed to:', period);
    });
});

// Quick Actions
document.querySelectorAll('.quick-btn[data-amount]').forEach(btn => {
    btn.addEventListener('click', function() {
        const amount = this.dataset.amount;
        // This would be used in deposit/withdraw pages
        console.log('Quick amount selected:', amount);
    });
});