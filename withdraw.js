// ===================================
// Withdraw Page JavaScript
// ===================================

// Simulated user balance
let userBalance = {
    available: 175.00,
    totalProfits: 175.00,
    locked: 500.00
};

// Withdrawal fees
const WITHDRAWAL_FEE_PERCENT = 2;
const MAX_FEE = 5;
const MIN_WITHDRAWAL = 10;

// Current selections
let selectedCrypto = 'bitcoin';
let withdrawAmount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceDisplay();
    initCryptoSelection();
    initWithdrawForm();
    initQuickAmounts();
    updateWithdrawalSummary();
});

// Update Balance Display
function updateBalanceDisplay() {
    document.getElementById('availableBalance').textContent = `$${userBalance.available.toFixed(2)}`;
    document.getElementById('totalProfits').textContent = `$${userBalance.totalProfits.toFixed(2)}`;
    document.getElementById('lockedBalance').textContent = `$${userBalance.locked.toFixed(2)}`;
    
    // Update max amount in input
    document.getElementById('withdrawAmount').max = userBalance.available;
}

// Crypto Selection
function initCryptoSelection() {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                selectedCrypto = radio.value;
                updateWithdrawalSummary();
            }
        });
    });
}

// Withdraw Form
function initWithdrawForm() {
    const form = document.getElementById('withdrawForm');
    const amountInput = document.getElementById('withdrawAmount');
    
    // Amount input change
    amountInput.addEventListener('input', function() {
        withdrawAmount = parseFloat(this.value) || 0;
        updateWithdrawalSummary();
    });
    
    // Form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate
        const walletAddress = document.getElementById('walletAddress').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        if (!walletAddress) {
            alert('Please enter your wallet address');
            return;
        }
        
        if (withdrawAmount < MIN_WITHDRAWAL) {
            alert(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
            return;
        }
        
        if (withdrawAmount > userBalance.available) {
            alert(`Insufficient balance. Available: $${userBalance.available.toFixed(2)}`);
            return;
        }
        
        if (!agreeTerms) {
            alert('Please confirm that the wallet address is correct');
            return;
        }
        
        // Submit withdrawal request
        submitWithdrawal(walletAddress);
    });
}

// Quick Amount Buttons
function initQuickAmounts() {
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseFloat(this.dataset.amount);
            
            // "All" button
            if (amount >= userBalance.available) {
                withdrawAmount = userBalance.available;
            } else {
                withdrawAmount = amount;
            }
            
            document.getElementById('withdrawAmount').value = withdrawAmount.toFixed(2);
            updateWithdrawalSummary();
        });
    });
}

// Update Withdrawal Summary
function updateWithdrawalSummary() {
    // Calculate fee
    let fee = withdrawAmount * (WITHDRAWAL_FEE_PERCENT / 100);
    if (fee > MAX_FEE) fee = MAX_FEE;
    
    // Calculate total
    const total = withdrawAmount - fee;
    
    // Update display
    document.getElementById('summaryAmount').textContent = `$${withdrawAmount.toFixed(2)}`;
    document.getElementById('summaryFee').textContent = `$${fee.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
    
    // Calculate estimated crypto
    const cryptoPrices = {
        bitcoin: 43250,
        ethereum: 2280,
        usdt: 1
    };
    
    const symbols = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        usdt: 'USDT'
    };
    
    const cryptoAmount = (total / cryptoPrices[selectedCrypto]).toFixed(6);
    document.getElementById('summaryCrypto').textContent = `${cryptoAmount} ${symbols[selectedCrypto]}`;
}

// Submit Withdrawal
function submitWithdrawal(walletAddress) {
    // Calculate final amounts
    let fee = withdrawAmount * (WITHDRAWAL_FEE_PERCENT / 100);
    if (fee > MAX_FEE) fee = MAX_FEE;
    const total = withdrawAmount - fee;
    
    // Create withdrawal object
    const withdrawal = {
        amount: withdrawAmount,
        fee: fee,
        total: total,
        crypto: selectedCrypto,
        walletAddress: walletAddress,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    console.log('Withdrawal request:', withdrawal);
    
    // In real implementation, send to backend
    // For now, show success message and add to history
    
    // Show success notification
    showSuccessMessage();
    
    // Add to history
    addToWithdrawalHistory(withdrawal);
    
    // Reset form
    document.getElementById('withdrawForm').reset();
    withdrawAmount = 0;
    updateWithdrawalSummary();
    
    // Update balance (simulated)
    userBalance.available -= withdrawAmount;
    updateBalanceDisplay();
}

// Show Success Message
function showSuccessMessage() {
    // Create modal/notification
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Withdrawal Request Submitted!</h3>
            <p>Your withdrawal request has been received and is being processed.</p>
            <p class="modal-note">You will receive your funds within 24 hours.</p>
            <button class="btn btn-primary" onclick="this.closest('.success-modal').remove()">
                OK
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        modal.remove();
    }, 5000);
}

// Add to Withdrawal History
function addToWithdrawalHistory(withdrawal) {
    const tbody = document.getElementById('withdrawalsHistory');
    const emptyState = document.getElementById('emptyState');
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    const cryptoSymbols = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        usdt: 'USDT'
    };
    
    const cryptoIcons = {
        bitcoin: 'fa-bitcoin',
        ethereum: 'fa-ethereum',
        usdt: 'fa-dollar-sign'
    };
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${new Date().toLocaleString()}</td>
        <td class="amount">$${withdrawal.amount.toFixed(2)}</td>
        <td>
            <span class="crypto-badge">
                <i class="fab ${cryptoIcons[withdrawal.crypto]}"></i>
                ${cryptoSymbols[withdrawal.crypto]}
            </span>
        </td>
        <td><span class="status-badge pending">Pending</span></td>
        <td class="tx-id">
            <span>Processing...</span>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

// Copy transaction ID
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
        const txId = e.target.closest('.tx-id').querySelector('span').textContent;
        
        navigator.clipboard.writeText(txId).then(() => {
            const btn = e.target.closest('.copy-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    }
});

// Add CSS for success modal
const style = document.createElement('style');
style.textContent = `
.success-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    max-width: 400px;
    text-align: center;
    animation: slideUp 0.3s ease;
}

.success-icon {
    font-size: 4rem;
    color: var(--success);
    margin-bottom: var(--spacing-md);
}

.modal-content h3 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-sm);
}

.modal-content p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
}

.modal-note {
    font-size: 0.9rem;
    color: var(--accent-gold);
    margin-bottom: var(--spacing-lg);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
`;
document.head.appendChild(style);