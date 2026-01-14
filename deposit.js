// ===================================
// Deposit Page JavaScript
// ===================================

// Default admin wallet addresses (REPLACE WITH YOUR REAL ADDRESSES)
const WALLET_ADDRESSES = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    usdt: 'TRXvpjd9QWNvGKmGzKyYqYH5VvH4cH2qBJ',
    bnb: 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfj8h3wl'
};

// Plan details
const PLANS = {
    basic: {
        name: 'Basic Plan',
        minAmount: 100,
        percent: 5,
        icon: 'fa-seedling'
    },
    professional: {
        name: 'Professional Plan',
        minAmount: 500,
        percent: 7,
        icon: 'fa-gem'
    },
    elite: {
        name: 'Elite Plan',
        minAmount: 1000,
        percent: 10,
        icon: 'fa-crown'
    }
};

// Current selection
let selectedPlan = 'professional';
let selectedPayment = 'bitcoin';
let depositAmount = 500;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initPlanSelection();
    initAmountInput();
    initPaymentMethods();
    initContinueButton();
    updateCalculator();
    
    // Check URL params for plan
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam && PLANS[planParam]) {
        selectPlan(planParam);
    }
});

// Plan Selection
function initPlanSelection() {
    document.querySelectorAll('.plan-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            selectedPlan = radio.value;
            
            // Update amount if below minimum
            const plan = PLANS[selectedPlan];
            if (depositAmount < plan.minAmount) {
                depositAmount = plan.minAmount;
                document.getElementById('depositAmount').value = depositAmount;
            }
            
            updateCalculator();
        });
    });
}

function selectPlan(planName) {
    const radio = document.querySelector(`input[value="${planName}"]`);
    if (radio) {
        radio.checked = true;
        selectedPlan = planName;
        const plan = PLANS[selectedPlan];
        depositAmount = plan.minAmount;
        document.getElementById('depositAmount').value = depositAmount;
        updateCalculator();
    }
}

// Amount Input
function initAmountInput() {
    const amountInput = document.getElementById('depositAmount');
    
    amountInput.addEventListener('input', function() {
        depositAmount = parseFloat(this.value) || 0;
        updateCalculator();
    });
    
    // Quick amount buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            depositAmount = parseFloat(this.dataset.amount);
            amountInput.value = depositAmount;
            updateCalculator();
        });
    });
}

// Update Profit Calculator
function updateCalculator() {
    const plan = PLANS[selectedPlan];
    const dailyProfit = depositAmount * (plan.percent / 100);
    const weeklyProfit = dailyProfit * 7;
    const monthlyProfit = dailyProfit * 30;
    
    document.getElementById('dailyProfit').textContent = `$${dailyProfit.toFixed(2)}`;
    document.getElementById('weeklyProfit').textContent = `$${weeklyProfit.toFixed(2)}`;
    document.getElementById('monthlyProfit').textContent = `$${monthlyProfit.toFixed(2)}`;
}

// Payment Methods
function initPaymentMethods() {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            selectedPayment = radio.value;
        });
    });
}

// Continue Button
function initContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    const paymentInstructions = document.getElementById('paymentInstructions');
    
    continueBtn.addEventListener('click', function() {
        // Validate amount
        const plan = PLANS[selectedPlan];
        if (depositAmount < plan.minAmount) {
            alert(`Minimum amount for ${plan.name} is $${plan.minAmount}`);
            return;
        }
        
        // Show payment instructions
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'none';
        paymentInstructions.style.display = 'block';
        
        // Update payment details
        updatePaymentInstructions();
        
        // Scroll to instructions
        paymentInstructions.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            paymentInstructions.style.display = 'none';
            document.getElementById('step1').style.display = 'block';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('step3').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Update Payment Instructions
function updatePaymentInstructions() {
    const plan = PLANS[selectedPlan];
    const walletAddress = WALLET_ADDRESSES[selectedPayment];
    
    // Update summary
    document.getElementById('selectedPlan').textContent = plan.name;
    document.getElementById('selectedAmount').textContent = `$${depositAmount.toFixed(2)}`;
    document.getElementById('selectedPercent').textContent = `${plan.percent}%`;
    
    const paymentNames = {
        bitcoin: 'Bitcoin (BTC)',
        ethereum: 'Ethereum (ETH)',
        usdt: 'USDT (TRC20)',
        bnb: 'BNB (BSC)'
    };
    document.getElementById('selectedMethod').textContent = paymentNames[selectedPayment];
    
    // Update wallet address
    document.getElementById('walletAddress').textContent = walletAddress;
    
    // Update crypto symbol
    const symbols = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        usdt: 'USDT',
        bnb: 'BNB'
    };
    document.getElementById('cryptoSymbol').textContent = symbols[selectedPayment];
    
    // Calculate crypto amount (simplified - use real exchange rates)
    const cryptoPrices = {
        bitcoin: 43250,
        ethereum: 2280,
        usdt: 1,
        bnb: 315
    };
    const cryptoAmount = (depositAmount / cryptoPrices[selectedPayment]).toFixed(6);
    document.getElementById('cryptoAmount').textContent = `${cryptoAmount} ${symbols[selectedPayment]}`;
    
    // Update QR code
    const qrCode = document.getElementById('qrCode');
    qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`;
}

// Copy Address Button
document.addEventListener('click', function(e) {
    if (e.target.id === 'copyAddressBtn' || e.target.closest('#copyAddressBtn')) {
        const address = document.getElementById('walletAddress').textContent;
        
        navigator.clipboard.writeText(address).then(() => {
            const successMsg = document.getElementById('copySuccess');
            successMsg.classList.add('show');
            
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 2000);
        }).catch(err => {
            alert('Failed to copy address');
        });
    }
});