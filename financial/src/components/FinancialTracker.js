import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, Hash, Search, ChevronDown, Settings, Lock, User, Mail } from 'lucide-react';

const CATEGORIES = {
  FOOD: { icon: '🍔', label: 'Food' },
  TRANSPORT: { icon: '🚗', label: 'Transport' },
  SHOPPING: { icon: '🥦', label: 'Groceries' },
  BILLS: { icon: '💼', label: 'Business' },
  RENT: { icon: '🏠', label: 'Rent' },
  TRAVEL: { icon: '✈️', label: 'Travel' },
  ENTERTAINMENT: { icon: '🎬', label: 'Entertainment' },
  HEALTH: { icon: '⚕️', label: 'Healthcare' },
  OTHER: { icon: '📌', label: 'Other' },
};

const AuthPage = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (email === 'test@example.com' && password === 'password') {
      onSignIn({ email, username: 'TestUser' });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
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

  const handleBackspace = () => {
    setCurrentAmount(currentAmount.slice(0, -1) || '0');
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
      type: note || CATEGORIES[selectedCategory].label,
      category: selectedCategory,
      amount: transactionType === 'EXPENSE' ? -parseFloat(currentAmount) : parseFloat(currentAmount),
      date: new Date(),
      note: note.trim(),
    };

    onAddTransaction(newTransaction);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {transactionType === 'EXPENSE' ? 'Add Expense' : 'Add Income'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex mb-4">
          <button
            onClick={() => setTransactionType('EXPENSE')}
            className={`w-1/2 py-2 ${
              transactionType === 'EXPENSE' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setTransactionType('INCOME')}
            className={`w-1/2 py-2 ${
              transactionType === 'INCOME' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            Income
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold">
            ₹ {currentAmount}
          </div>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note"
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="relative mb-4">
          <button 
            onClick={() => setShowCategories(!showCategories)}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 flex justify-between items-center"
          >
            {selectedCategory 
              ? `${CATEGORIES[selectedCategory].icon} ${CATEGORIES[selectedCategory].label}` 
              : 'Select Category'}
            <ChevronDown size={20} />
          </button>

          {showCategories && (
            <div className="absolute z-10 w-full bg-gray-700 rounded-lg mt-1 max-h-64 overflow-y-auto">
              {Object.entries(CATEGORIES).map(([key, { icon, label }]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setShowCategories(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center"
                >
                  <span className="mr-2">{icon}</span> {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map((num) => (
            <button
              key={num}
              onClick={() => 
                num === 'C' 
                  ? handleBackspace() 
                  : handleNumberInput(num)
              }
              className="bg-gray-700 py-3 rounded-lg text-xl hover:bg-gray-600"
            >
              {num}
            </button>
          ))}
        </div>

        <button 
          onClick={handleAddTransaction}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
        >
          Add Transaction
        </button>
      </div>
    </div>
  );
};

const FinancialTracker = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'Indigo Refund',
      category: 'TRAVEL',
      amount: 3000,
      date: new Date('2024-02-15T04:42:00'),
      note: '',
    },
    {
      id: 2,
      type: 'Flight Booking',
      category: 'TRANSPORT',
      amount: -6414,
      date: new Date('2024-02-15T04:42:00'),
      note: '',
    },
    {
      id: 3,
      type: 'Rent',
      category: 'RENT',
      amount: -22000,
      date: new Date('2024-02-15T04:42:00'),
      note: '',
    },
    {
      id: 4,
      type: 'Taxplore Payment',
      category: 'BILLS',
      amount: -7000,
      date: new Date('2024-02-15T04:42:00'),
      note: '',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const handleSignIn = (userData) => {
    setUser(userData);
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Check for login credentials
  if (!user) {
    return <AuthPage onSignIn={handleSignIn} />;
  }

  const filteredTransactions = transactions.filter((t) => 
    (searchQuery === '' || 
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.note.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filter === 'ALL' || 
      (filter === 'INCOME' && t.amount > 0) ||
      (filter === 'EXPENSE' && t.amount < 0))
  );

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wider">PIGGYBANK</div>
        <div className="flex items-center gap-4">
          <div className="text-gray-300 mr-4">
            Welcome, {user.username}
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
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

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <div className="p-6">
        <div className="bg-gray-800 rounded-2xl p-6">
          <div>
            <div className="text-gray-400 text-sm mb-1">Net Total</div>
            <div className="text-2xl font-bold">₹ {totalBalance.toLocaleString()}</div>
          </div>
          
          <div className="flex gap-2 mt-4">
            {['ALL', 'INCOME', 'EXPENSE'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === filterType ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex justify-between items-center bg-gray-800 rounded-lg p-4 mb-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {CATEGORIES[transaction.category]?.icon || '📌'}
                </span>
                <div>
                  <div className="font-medium">{transaction.type}</div>
                  {transaction.note && <div className="text-xs text-gray-400">{transaction.note}</div>}
                  <div className="text-xs text-gray-400">
                    {transaction.date.toLocaleDateString()} | {transaction.date.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₹ {Math.abs(transaction.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialTracker;