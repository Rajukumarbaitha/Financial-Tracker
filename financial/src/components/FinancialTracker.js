import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Clock, Hash, Search, ChevronDown, Settings } from 'lucide-react';

const CATEGORIES = {
  FOOD: { icon: '🍔', label: 'Food & Dining' },
  TRANSPORT: { icon: '🚗', label: 'Transport' },
  SHOPPING: { icon: '🛍️', label: 'Shopping' },
  BILLS: { icon: '📃', label: 'Bills' },
  RENT: { icon: '🏠', label: 'Rent' },
  TRAVEL: { icon: '✈️', label: 'Travel' },
  ENTERTAINMENT: { icon: '🎬', label: 'Entertainment' },
  HEALTH: { icon: '⚕️', label: 'Healthcare' },
  OTHER: { icon: '📌', label: 'Other' }
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
        <div key={date}>
          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <div>{date}</div>
            <div>
              ₹ {Math.abs(dateTransactions.reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
            </div>
          </div>
          
          {dateTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between mb-4 opacity-100 transition-opacity duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center text-xl">
                  {CATEGORIES[transaction.category]?.icon || transaction.icon}
                </div>
                <div>
                  <div className="font-medium">{transaction.name}</div>
                  <div className="text-sm text-gray-400">
                    {transaction.time} • {transaction.note}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={transaction.amount > 0 ? 'text-green-500' : 'text-white'}>
                  {transaction.amount > 0 ? '+' : '-'}₹ {Math.abs(transaction.amount).toLocaleString()}
                </div>
                <button 
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete transaction"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const TransactionModal = ({ isOpen, onClose, onAddTransaction }) => {
  const [currentAmount, setCurrentAmount] = useState('0');
  const [transactionType, setTransactionType] = useState('EXPENSE');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const handleNumberInput = (num) => {
    if (num === '.' && currentAmount.includes('.')) return;
    if (currentAmount === '0' && num !== '.') {
      setCurrentAmount(num.toString());
    } else {
      setCurrentAmount(currentAmount + num);
    }
  };

  const handleAddTransaction = () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    if (isNaN(parseFloat(currentAmount)) || parseFloat(currentAmount) === 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase(),
      name: CATEGORIES[selectedCategory].label,
      amount: transactionType === 'EXPENSE' ? -parseFloat(currentAmount) : parseFloat(currentAmount),
      type: transactionType.toLowerCase(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      category: selectedCategory,
      note: note.trim() || 'No note',
      icon: CATEGORIES[selectedCategory].icon
    };

    onAddTransaction(newTransaction);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCurrentAmount('0');
    setSelectedCategory(null);
    setNote('');
    setTransactionType('EXPENSE');
    setShowCategories(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => onClose()}>
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <button 
              onClick={() => setTransactionType('EXPENSE')}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                transactionType === 'EXPENSE' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              EXPENSE
            </button>
            <button 
              onClick={() => setTransactionType('INCOME')}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                transactionType === 'INCOME' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              INCOME
            </button>
          </div>
          <button 
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-gray-400 text-sm mb-2">
            Adding {transactionType.toLowerCase()}
          </div>
          <div className="text-4xl font-bold mb-3">₹ {currentAmount}</div>
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="text-gray-400">
              {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </span>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-expanded={showCategories}
              aria-haspopup="true"
            >
              <Hash size={16} />
              <span>{selectedCategory ? CATEGORIES[selectedCategory].label : 'Select Category'}</span>
              <ChevronDown size={16} className={`transform transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </button>
            {showCategories && (
              <div 
                className="absolute top-full mt-2 w-48 bg-gray-700 rounded-xl shadow-lg p-2 z-10"
                role="listbox"
              >
                {Object.entries(CATEGORIES).map(([key, { icon, label }]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key);
                      setShowCategories(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-600 rounded-lg transition-colors"
                    role="option"
                    aria-selected={selectedCategory === key}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num.toString())}
              className="bg-gray-700 h-12 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleAddTransaction}
            className="bg-green-500 h-12 rounded-xl hover:bg-green-600 transition-colors"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
};

const FinancialTracker = () => {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const monthlyIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wider">PIGGYBANK</div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="bg-gray-800 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} /> Add New
          </button>
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}

      <div className="p-6">
        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <div className="text-gray-400 text-sm mb-1">Net Total</div>
              <div className="text-2xl font-bold">₹ {totalBalance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Monthly Income</div>
              <div className="text-2xl font-bold text-green-500">
                ₹ {monthlyIncome.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Monthly Expense</div>
              <div className="text-2xl font-bold text-red-500">
                ₹ {monthlyExpense.toLocaleString()}
              </div>
            </div>
          </div>

          <TransactionList 
            transactions={filteredTransactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialTracker;