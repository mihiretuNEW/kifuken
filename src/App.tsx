/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Settings, 
  Info, 
  Phone, 
  Video, 
  MessageSquare, 
  MoreVertical, 
  Trash2,
  Delete, 
  Clock, 
  User, 
  Dot,
  Check,
  X,
  Bell,
  ArrowLeft,
  Plus,
  UserPlus,
  Mic,
  ArrowUp,
  FileText,
  ChevronDown,
  Hexagon,
  Volume2,
  MicOff,
  Pause,
  History
} from 'lucide-react';

// --- Types ---
interface RecentCall {
  id: string;
  name: string;
  number: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
  sim: 1 | 2;
  icon?: string;
}

// --- Mock Data ---
const INITIAL_RECENTS: RecentCall[] = [
  { id: '1', name: '+1 484-737-1678', number: '+14847371678', time: '10:27 PM', type: 'missed', sim: 2 },
  { id: '2', name: 'ጮጋ', number: '0987654321', time: '07:37 PM', type: 'incoming', sim: 1 },
  { id: '3', name: 'ሰላም 🐄', number: '0900112233', time: '01:09 PM', type: 'missed', sim: 2 },
  { id: '4', name: 'Dani Class', number: '0912345678', time: '08:43 AM', type: 'incoming', sim: 2 },
  { id: '5', name: 'Enat 💖💖', number: '0987111222', time: '08:21 AM', type: 'incoming', sim: 1 },
  { id: '6', name: 'Abush', number: '0922334455', time: 'Yesterday', type: 'outgoing', sim: 1 },
  { id: '7', name: 'Work 💼', number: '0911223344', time: 'Yesterday', type: 'missed', sim: 2 },
  { id: '8', name: 'Pizza Delivery', number: '8080', time: 'Monday', type: 'outgoing', sim: 1 },
  { id: '9', name: 'Landline', number: '0111223344', time: 'Sunday', type: 'incoming', sim: 1 },
  { id: '10', name: 'Emergency', number: '911', time: 'Sunday', type: 'missed', sim: 1 },
];

interface Contact {
  id: string;
  name: string;
  number: string;
  initial: string;
  color: string;
  isFavorite?: boolean;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Emų 🥰🥰', number: '0911223344', initial: 'E', color: 'bg-blue-400', isFavorite: true },
  { id: 'c2', name: 'Enat 💖💖', number: '0987111222', initial: 'E', color: 'bg-indigo-500', isFavorite: true },
  { id: 'c3', name: 'Ma Bro😎', number: '0912121212', initial: 'M', color: 'bg-slate-600', isFavorite: true },
  { id: 'c4', name: 'ጭሻ', number: '0933445566', initial: 'ጭ', color: 'bg-violet-400', isFavorite: true },
  { id: 'c5', name: 'Abdurahman', number: '0911000001', initial: 'A', color: 'bg-red-400' },
  { id: 'c6', name: 'Biniyam', number: '0911000002', initial: 'B', color: 'bg-green-500' },
  { id: 'c7', name: 'Chala', number: '0911000003', initial: 'C', color: 'bg-yellow-600' },
  { id: 'c8', name: 'Desta Tefera', number: '0911000004', initial: 'D', color: 'bg-orange-500' },
  { id: 'c9', name: 'Fasil', number: '0911000005', initial: 'F', color: 'bg-pink-400' },
  { id: 'c10', name: 'Girma', number: '0911000006', initial: 'G', color: 'bg-teal-500' },
  { id: 'c11', name: 'Hagos', number: '0911000007', initial: 'H', color: 'bg-cyan-600' },
  { id: 'c12', name: 'Ismael', number: '0911000008', initial: 'I', color: 'bg-blue-600' },
  { id: 'c13', name: 'Jemal', number: '0911000009', initial: 'J', color: 'bg-purple-500' },
  { id: 'c14', name: 'Kassa Hun', number: '0911000010', initial: 'K', color: 'bg-emerald-500' },
];

const INITIAL_MESSAGES = [
  { 
    id: '1', 
    text: "Dear Mihiret Kasaye Kedir You have successfully transferred ETB 1.61 from account 1*********0037 to account 1*********4455 (Wondimu Dargaso Koyira). Service charge of ETB 0.50 and VAT(15%) of ETB0.08 and Disaster Recovery(5%) of 0.03 with total of ETB1.61 .Your current balance is ETB82.74. Thanks for Banking with CBE.\nhttps://Mbreciept.cbe.com.et/FT26130MFRTL-89790037", 
    timestamp: Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000, 
    type: 'received',
    txId: 'FT26130MFRTL-89790037'
  },
  { 
    id: '2', 
    text: "Dear Mihiret Kasaye Kedir You have successfully transferred ETB 1.61 from account 1*********0037 to account 1*********4455 (Wondimu Dargaso Koyira). Service charge of ETB 0.50 and VAT(15%) of ETB0.08 and Disaster Recovery(5%) of 0.03 with total of ETB1.61 .Your current balance is ETB81.13. Thanks for Banking with CBE.\nhttps://Mbreciept.cbe.com.et/FT261300LR44-89790037", 
    timestamp: Date.now() - 24 * 60 * 60 * 1000 - 19 * 60 * 1000, 
    type: 'received',
    txId: 'FT261300LR44-89790037'
  }
];

// --- Components ---

const KeypadButton = ({ 
  digit, 
  sub, 
  onClick,
  theme
}: { 
  digit: string; 
  sub?: string; 
  onClick: (d: string) => void;
  theme?: 'dark' | 'light';
}) => (
  <button
    onClick={() => onClick(digit)}
    className={`flex flex-col items-center justify-center rounded-full transition-all duration-150 w-[72px] h-[72px] sm:w-[76px] sm:h-[76px] mx-auto select-none ${
      theme === 'light' 
        ? 'text-zinc-900 hover:bg-zinc-100/90 active:bg-zinc-200/80 active:scale-95' 
        : 'text-white hover:bg-white/[0.06] active:bg-white/[0.12] active:scale-95'
    }`}
    id={`btn-${digit}`}
  >
    <span className={`text-[30px] sm:text-[32px] font-normal leading-none ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{digit}</span>
    {sub ? (
      <span className={`text-[10px] sm:text-[10.5px] font-medium tracking-[0.14em] uppercase mt-1 leading-none ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>
        {sub}
      </span>
    ) : (
      <span className="h-[10px] mt-1" />
    )}
  </button>
);

export default function App() {
  const [dialedNumber, setDialedNumber] = useState('');
  const [isKeypadOpen, setIsKeypadOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'missed'>('all');
  const [ownerName, setOwnerName] = useState(() => localStorage.getItem('cbe_owner_name') || 'Mihiret Kasaye Kedir');
  const [showSettings, setShowSettings] = useState(false);
  const [tempOwnerName, setTempOwnerName] = useState('');
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>(() => {
    const saved = localStorage.getItem('cbe_recent_calls');
    return saved ? JSON.parse(saved) : INITIAL_RECENTS;
  });
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('cbe_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [ussdStep, setUssdStep] = useState<string>('IDLE');
  const [ussdInput, setUssdInput] = useState('');
  const [ussdSessionData, setUssdSessionData] = useState<any>({});
  const [ussdRunning, setUssdRunning] = useState<string | null>(null);
  const [ussdResult, setUssdResult] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [isShadeOpen, setIsShadeOpen] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('cbe_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [ussdTransactions, setUssdTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem('cbe_transactions');
    if (saved) return JSON.parse(saved);
    return [
       { id: 't1', amount: -30.61, date: '3/5', about: 'yes', from: 'Mihiret Kasaye Kedir', to: 'Ahlam Ahmed Ali', timestamp: '2026-05-03 17:52' },
       { id: 't2', amount: -5.0, date: '3/5', about: 'yes', from: 'Mihiret Kasaye Kedir', to: 'Desta Tefera', timestamp: '2026-05-03 12:10' },
       { id: 't3', amount: -75.61, date: '2/5', about: 'yes', from: 'Mihiret Kasaye Kedir', to: 'Aster ETB Saving Account', timestamp: '2026-05-02 09:45' },
       { id: 't4', amount: -5.0, date: '2/5', about: 'yes', from: 'Mihiret Kasaye Kedir', to: 'Kassa Hun', timestamp: '2026-05-02 11:30' },
       { id: 't5', amount: -6.0, date: '2/5', about: 'yes', from: 'Mihiret Kasaye Kedir', to: 'Gebre Tsadik', timestamp: '2026-05-02 15:20' },
    ];
  });
  const [ussdSelectedTransaction, setUssdSelectedTransaction] = useState<any>(null);
  const [availableBalance, setAvailableBalance] = useState(() => {
    const saved = localStorage.getItem('cbe_balance');
    return saved || '411.06';
  });
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isMsgDeleteMode, setIsMsgDeleteMode] = useState(false);
  const [currentView, setCurrentView] = useState<'dialer' | 'messages' | 'contacts' | 'search' | 'calling'>('dialer');
  const [callingNumber, setCallingNumber] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('cbe_theme') as 'dark' | 'light') || 'dark');
  const isClosingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const playNotificationSound = () => {
    try {
      if (!notificationAudioRef.current) {
        notificationAudioRef.current = new Audio('/Notification.mp3');
      }
      const audio = notificationAudioRef.current;
      audio.volume = 1.0;
      audio.currentTime = 0;
      audio.play().catch(e => {
        console.log('Audio notification blocked or file missing/empty. Ensure /Notification.mp3 is a valid audio file in your public folder.', e);
      });
    } catch (e) {
      console.error('Audio initialization error:', e);
    }
  };

  const stopNotificationSound = () => {
    if (notificationAudioRef.current) {
      notificationAudioRef.current.pause();
      notificationAudioRef.current.currentTime = 0;
    }
  };

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentView === 'messages') {
      scrollToBottom();
    }
  }, [messages, currentView]);

  useEffect(() => {
    // Detect keyboard by monitoring visualViewport resize
    const handleResize = () => {
      if (window.visualViewport) {
        // Threshold check: if viewport height drops significantly, keyboard is up
        const isKeyboardUp = window.visualViewport.height < window.innerHeight - 150;
        
        if (isKeyboardUp) {
          setIsInputFocused(true);
        } else {
          // Double check if any input is actually focused
          const activeEl = document.activeElement;
          if (!activeEl || activeEl.tagName !== 'INPUT') {
            setIsInputFocused(false);
          } else {
            // Check if window is full height (keyboard dismissed via back button)
            if (window.visualViewport.height >= window.innerHeight - 40) {
              setIsInputFocused(false);
            }
          }
        }
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Request notification permission on first user interaction for native push overlay
    const handleFirstGesture = () => {
      requestNotificationPermission();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (e) {
          console.warn('Notification permission error:', e);
        }
      }
    }
  };

  const triggerNativePushNotification = async (title: string, body: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    try {
      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
      }

      const notifOptions: any = {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'cbe-sms-' + Date.now(),
        renotify: true,
        vibrate: [250, 100, 250, 100, 250],
        data: { url: '/' }
      };

      // 1. Primary: Service Worker Registration (Required on Android Chrome & PWA for system overlay)
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration && typeof registration.showNotification === 'function') {
            await registration.showNotification(title, notifOptions);
            return;
          }
        } catch (swErr) {
          console.warn('ServiceWorker notification error, falling back:', swErr);
        }
      }

      // 2. Fallback: window Notification constructor (Desktop / macOS)
      try {
        const notif = new Notification(title, notifOptions);
        notif.onclick = () => {
          window.focus();
          setCurrentView('messages');
          notif.close();
        };
      } catch (notifErr) {
        console.warn('Notification constructor error:', notifErr);
      }
    } catch (e) {
      console.error('Trigger notification error:', e);
    }
  };

  // Persist data
  useEffect(() => {
    localStorage.setItem('cbe_recent_calls', JSON.stringify(recentCalls));
  }, [recentCalls]);

  useEffect(() => {
    localStorage.setItem('cbe_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('cbe_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cbe_transactions', JSON.stringify(ussdTransactions));
  }, [ussdTransactions]);

  useEffect(() => {
    localStorage.setItem('cbe_balance', availableBalance);
  }, [availableBalance]);

  useEffect(() => {
    if (showNotification) {
      setHasUnreadNotification(true);
      
      // Vibrate twice: vibrate 200ms, pause 100ms, vibrate 200ms
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      } catch (err) {
        console.warn("Vibration failed:", err);
      }

      const autoHide = setTimeout(() => {
        setShowNotification(false);
        setHasUnreadNotification(false);
      }, 3000); // 3 seconds display
      
      return () => {
        clearTimeout(autoHide);
        stopNotificationSound();
        // Stop vibration when notification is dismissed or autohides
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(0);
        }
      };
    }
  }, [showNotification]);

  // Time formatter helper
  const formatMsgTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const date = new Date(timestamp);
    
    if (diff < 60000) return 'Just now';
    
    const isToday = date.toDateString() === new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Today ${timeStr}`;
    if (isYesterday) return `Yesterday ${timeStr}`;
    return timeStr;
  };

  const [editingCall, setEditingCall] = useState<RecentCall | null>(null);

  // Notification content helper
  const getNotificationText = () => {
    if (messages.length > 0) return messages[messages.length - 1].text;
    
    const amount = Number(ussdSessionData.amount) || 0;
    const sender = ussdSessionData.senderName || 'Valued Customer';
    const receiver = ussdSessionData.receiverName || 'Recipient';
    const balance = ussdSessionData.balance || availableBalance;
    const txId = ussdSessionData.txId || 'FT0000000000RT';
    
    return `Dear ${sender}, You have transferred ETB ${amount.toFixed(2)} to ${receiver} on ${getTodayDate()} at ${new Date().toLocaleTimeString('en-GB', { hour12: false })} from your account 1**********0037. Your account has been debited with a S.charge of ETB 0.50 and VAT(15%) of ETB0.08 and Disaster Fund (5%) of ETB0.03, with a total of ETB ${(amount + 0.61).toFixed(2)}. Your Current Balance is ETB ${balance}. Thank you for Banking with CBE! https://apps.cbe.com.et:100/?id=${txId} For feedback click the link https://forms.gle/R1s9nkJ6qZVCxRVu9`;
  };

  const handleUpdateCall = (updated: RecentCall) => {
    setRecentCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditingCall(null);
  };

  const dialerRef = useRef<HTMLDivElement>(null);

  const handleDigitClick = (digit: string) => {
    requestNotificationPermission();
    setDialedNumber(prev => prev + digit);
  };

  const handleDelete = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleLongDelete = () => {
    setDialedNumber('');
  };

  const generateTxId = () => {
    const today = new Date();
    const datePart = today.getDate().toString().padStart(2, '0') + (today.getMonth() + 1).toString().padStart(2, '0');
    const randomPart = Math.floor(10000000 + Math.random() * 90000000);
    return `FT${datePart}${randomPart}RT`;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  const runUSSD = (code: string) => {
    if (!code) return;
    isClosingRef.current = false;
    
    // Standard Call check (doesn't start with * and doesn't end with # strictly like USSD)
    if (!code.startsWith('*') && !code.endsWith('#')) {
      setCallingNumber(code);
      setCurrentView('calling');
      return;
    }

    setUssdRunning(code);
    setDialedNumber('');
    
    if (code === '*889#') {
      setTimeout(() => {
        setUssdRunning(null);
        setUssdStep('CBE_LOGIN_PIN');
        setUssdResult('SHOW');
      }, 2500);
    } else if ((code.startsWith('*') || code.startsWith('#')) && code.endsWith('#')) {
      setTimeout(() => {
        setUssdRunning(null);
        setUssdStep('CBE_ERROR_MSG');
        setUssdResult('Service error. Please try again later.');
      }, 2500);
    } else {
      setTimeout(() => setUssdRunning(null), 1000);
    }
  };

  const endCall = () => {
    // Save to recents
    const newCall: RecentCall = {
      id: Math.random().toString(36).substr(2, 9),
      name: callingNumber,
      number: callingNumber,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'outgoing',
      sim: 1
    };
    setRecentCalls(prev => [newCall, ...prev]);
    setCurrentView('dialer');
    setCallingNumber('');
    setDialedNumber('');
    setIsKeypadOpen(false);
  };

  const handleUssdAction = () => {
    const input = ussdInput;
    setUssdInput(''); // Always clear input after send
    
    setUssdRunning('...loading');
    
    setTimeout(() => {
      setUssdRunning(null);
      
      if (ussdStep === 'CBE_LOGIN_PIN') {
        if (input === '1997') {
          setUssdStep('CBE_MAIN_MENU');
        } else {
          setUssdStep('CBE_ERROR_MSG');
          setUssdResult('Wrong pin try again');
        }
      } 
      else if (ussdStep === 'CBE_MAIN_MENU') {
        if (input === '1') { // My Account
          setUssdStep('CBE_MY_ACCOUNT_SELECT');
        } else if (input === '2') { // Transfer to CBE
          setUssdStep('CBE_RECEIVER_NAME');
        } else {
          closeDialog();
        }
      }
      else if (ussdStep === 'CBE_MY_ACCOUNT_SELECT') {
        if (input === '1') {
          setUssdStep('CBE_ACCOUNT_SUMMARY');
        } else if (input === '2') {
          setUssdStep('CBE_MAIN_MENU');
        } else {
          closeDialog();
        }
      }
      else if (ussdStep === 'CBE_ACCOUNT_SUMMARY') {
        if (input === '6') {
          setUssdStep('CBE_MY_ACCOUNT_SELECT');
        } else {
          const idx = parseInt(input) - 1;
          if (idx >= 0 && idx < ussdTransactions.length) {
            setUssdSelectedTransaction(ussdTransactions[idx]);
            setUssdStep('CBE_TRANSACTION_DETAIL');
          } else {
             // Stay or show help?
          }
        }
      }
      else if (ussdStep === 'CBE_TRANSACTION_DETAIL') {
        if (input === '1') {
          setUssdStep('CBE_ACCOUNT_SUMMARY');
        } else {
          closeDialog();
        }
      }
      else if (ussdStep === 'CBE_RECEIVER_NAME') {
        setUssdSessionData(prev => ({ ...prev, receiverName: input }));
        setUssdStep('CBE_RECEIVER_ACCOUNT');
      }
      else if (ussdStep === 'CBE_RECEIVER_ACCOUNT') {
        setUssdSessionData(prev => ({ ...prev, receiverAcc: input }));
        setUssdStep('CBE_AMOUNT_ENTRY');
      }
      else if (ussdStep === 'CBE_AMOUNT_ENTRY') {
        const amt = parseFloat(input);
        setUssdSessionData(prev => ({ ...prev, amount: amt }));
        setUssdStep('CBE_REASON_ENTRY');
      }
      else if (ussdStep === 'CBE_REASON_ENTRY') {
        setUssdSessionData(prev => ({ ...prev, reason: input }));
        setUssdStep('CBE_FINAL_PIN');
      }
      else if (ussdStep === 'CBE_FINAL_PIN') {
        if (input === '1997') {
          const randomBalance = (600 + Math.random() * (10000 - 600)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const txId = generateTxId();
          
          setAvailableBalance(randomBalance);
          setUssdSessionData(prev => ({ 
            ...prev, 
            txId: txId, 
            balance: randomBalance 
          }));

          const amount = Number(ussdSessionData.amount) || 0;
          const sender = ussdSessionData.senderName || ownerName;
          const receiver = ussdSessionData.receiverName || 'Wondimu Dargaso Koyira';
          const receiverSuffix = ussdSessionData.receiverAcc?.slice(-4) || '4455';
          const totalAmount = (amount + 0.61).toFixed(2);
          
          // Randomly choose between two message formats
          const useAlternativeFormat = Math.random() > 0.5;
          let content = "";
          
          if (useAlternativeFormat) {
            const timeStr = new Date().toLocaleTimeString('en-GB', { hour12: false });
            const dateStr = new Date().toLocaleDateString('en-GB');
            content = `Dear ${sender}, You have transferred ETB ${amount.toFixed(2)} to ${receiver} on ${dateStr} at ${timeStr} from your account 1*********0037. Your account has been debited with a S.charge of ETB 0.50 and VAT(15%) of ETB0.08 and Disaster Fund (5%) of ETB0.03, with a total of ETB ${totalAmount} Your Current Balance is ETB ${randomBalance}. Thank you for Banking with CBE! https://apps.cbe.com.et:100/?id=${txId} For feedback click the link https://forms.gle/R1s9nkJ6qZVCxRVu9`;
          } else {
            content = `Dear ${sender} You have successfully transferred ETB ${amount.toFixed(2)} from account 1*********0037 to account 1*********${receiverSuffix} (${receiver}). Service charge of ETB 0.50 and VAT(15%) of ETB0.08 and Disaster Recovery(5%) of 0.03 with total of ETB${totalAmount} .Your current balance is ETB${randomBalance}. Thanks for Banking with CBE.\nhttps://Mbreciept.cbe.com.et/${txId}`;
          }
          
          const newMessage = {
            id: Math.random().toString(36).substr(2, 9),
            text: content,
            txId: txId,
            timestamp: Date.now()
          };

          setMessages(prev => [...prev, newMessage]);

          const newTransaction = {
            id: txId,
            sender: sender,
            receiver: receiver,
            amount: -amount,
            date: `${new Date().getDate()}/${new Date().getMonth() + 1}`,
            about: 'yes',
            from: sender,
            to: receiver,
            timestamp: `${getTodayDate().split('/').reverse().join('-')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
          };
          setUssdTransactions(prev => [newTransaction, ...prev]);
          
          setUssdSessionData(prev => ({ 
            ...prev, 
            balance: randomBalance, 
            txId: txId,
            fullMessage: content 
          }));
          setUssdStep('CBE_SUCCESS');
          (document.activeElement as HTMLElement)?.blur();
          setTimeout(() => {
            setShowNotification(true);
            playNotificationSound();
            triggerNativePushNotification('CBE', content);
          }, 3500);
        } else {
          setUssdStep('CBE_ERROR_MSG');
          setUssdResult('Wrong pin try again');
        }
      }
      else {
        closeDialog();
      }
    }, 1200);
  };

  const closeDialog = () => {
    isClosingRef.current = true;
    setUssdResult(null);
    setUssdStep('IDLE');
    setDialedNumber('');
    setUssdInput('');
    setUssdSessionData({});
  };

  return (
    <div className={`flex flex-col h-screen relative select-none overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-[#F2F2F7] text-black' : 'bg-black text-white'}`}>
      {/* Pull-down Notification Shade (In-app overlay) */}
      <AnimatePresence>
        {isShadeOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#000000]/80 backdrop-blur-3xl z-[300] flex flex-col pt-16 pb-8 px-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
              <button 
                onClick={() => {
                  setIsShadeOpen(false);
                  setHasUnreadNotification(false);
                }}
                className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center active:scale-90"
              >
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <Bell size={48} className="mb-4" />
                  <p className="text-sm font-medium">No new notifications</p>
                </div>
              ) : (
                [...messages].reverse().map(msg => (
                  <div 
                    key={msg.id} 
                    className="bg-[#1C1C1E]/80 rounded-[1.8rem] p-4 border border-white/5 active:bg-zinc-800 transition-colors shadow-lg"
                    onClick={() => {
                      setIsShadeOpen(false);
                      setCurrentView('messages');
                      setHasUnreadNotification(false);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-[32px] h-[32px] rounded-full bg-[#3A3A3C] flex items-center justify-center overflow-hidden">
                        <User className="text-[#8E8E93]" size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold leading-none">CBE Messages</span>
                        <span className="text-[10px] text-zinc-500 mt-1">now</span>
                      </div>
                      <Bell size={10} className="text-zinc-600 ml-auto" />
                    </div>
                    <p className="text-[14px] text-zinc-300 line-clamp-3 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <motion.div 
              className="mt-auto pt-4 flex flex-col items-center gap-3"
              onClick={() => {
                setIsShadeOpen(false);
                setHasUnreadNotification(false);
              }}
            >
               <span className="text-zinc-600 text-xs font-medium">Swipe up to close</span>
              <div className="w-12 h-1.5 bg-zinc-700/50 rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle indicator for pull-down */}
      <div 
        className="absolute top-0 left-0 right-0 h-4 z-[400] cursor-pointer" 
        onMouseDown={() => setIsShadeOpen(true)}
        title="Swipe down for notifications"
      />
      
      {/* Message icon in system bar area hint */}
      {hasUnreadNotification && (
        <div className="fixed top-1 left-4 z-[350] pointer-events-none opacity-80">
          <MessageSquare className="w-3.5 h-3.5 text-white fill-current" />
        </div>
      )}

      {/* --- USSD Notification --- */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ x: '110%', opacity: 0, transition: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            dragDirectionLock
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 100) {
                setShowNotification(false);
                setShowReplyInput(false);
                setHasUnreadNotification(false);
              }
            }}
            className="fixed top-2.5 left-3.5 right-3.5 z-[200] bg-[#1C1C1E]/95 backdrop-blur-3xl rounded-[2.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 cursor-grab active:cursor-grabbing border border-white/5 safe-area-top"
          >
            {!showReplyInput ? (
              <div 
                className="flex gap-3.5"
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('button')) {
                    setCurrentView('messages');
                    setShowNotification(false);
                    setHasUnreadNotification(false);
                  }
                }}
              >
                {/* User Avatar with Message Icon */}
                <div className="relative flex-shrink-0 pt-0.5">
                  <div className="w-[44px] h-[44px] rounded-full bg-[#3A3A3C] flex items-center justify-center overflow-hidden">
                    <User className="text-[#AEAEB2]" size={28} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-[#1C1C1E] border-[1.5px] border-[#1C1C1E] rounded-full p-0.5">
                    <div className="bg-[#0B84FF] rounded-full p-0.5">
                      <MessageSquare size={10} className="text-white fill-current" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[#FFFFFF] font-semibold text-[16px] tracking-tight">CBE</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[#8E8E93] text-[14px]">now</span>
                        <Bell size={12} className="text-[#8E8E93] ml-0.5 fill-current opacity-70" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[#FFFFFF] text-[15px] leading-[1.3] line-clamp-1 font-normal opacity-90">
                    {getNotificationText()}
                  </p>
                  <div className="flex gap-6 mt-4 mb-0.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowReplyInput(true); setHasUnreadNotification(false); }}
                      className="text-[#0A84FF] text-[15.5px] font-medium active:opacity-40 transition-opacity"
                    >
                      Reply
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowNotification(false); setHasUnreadNotification(false); }}
                      className="text-[#0A84FF] text-[15.5px] font-medium active:opacity-40 transition-opacity"
                    >
                      Mark as read
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Inline Reply Interface */
              <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3A3A3C] flex items-center justify-center overflow-hidden">
                    <User className="text-[#8E8E93]" size={18} />
                  </div>
                  <span className="text-white font-medium text-sm">CBE</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1C1C1E] rounded-2xl px-4 py-2.5 border border-white/5">
                  <input 
                    type="text" autoFocus placeholder="Reply"
                    className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder-zinc-500"
                  />
                  <div className="w-8 h-8 rounded-full bg-[#3A3A3C] flex items-center justify-center">
                    <ArrowUp size={18} className="text-[#8E8E93]" />
                  </div>
                </div>
              </div>
            )}
            <div className="w-10 h-1.2 bg-[#48484A]/60 rounded-full mx-auto mt-2.5 mb-0.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {currentView === 'dialer' ? (
        <div className="flex flex-col h-full overflow-hidden">
          {/* --- Top Header --- */}
          <div className="pt-10 px-6 pb-2">
            <div className="flex justify-between items-center mb-1">
              <h1 className={`text-[32px] font-normal tracking-tight ${theme === 'light' ? 'text-black' : 'text-zinc-100'}`}>Recents</h1>
              <div className="flex gap-5">
                <button onClick={() => setCurrentView('search')}>
                  <Search className={`w-5 h-5 ${theme === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`} />
                </button>
                <button onClick={() => {
                  setTempOwnerName(ownerName);
                  setShowSettings(!showSettings);
                }}>
                  <Settings className={`w-5 h-5 ${theme === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`} />
                </button>
                <button onClick={() => setCurrentView('contacts')}>
                  <Hexagon className={`w-5 h-5 ${theme === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className={`flex flex-col gap-3 p-4 rounded-3xl border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900/50 border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={tempOwnerName}
                        onChange={(e) => setTempOwnerName(e.target.value)}
                        placeholder="Enter Owner Name"
                        className={`flex-1 bg-transparent border-none outline-none text-sm placeholder-zinc-500 ${theme === 'light' ? 'text-black' : 'text-zinc-100'}`}
                      />
                      <button 
                        onClick={() => {
                          setOwnerName(tempOwnerName);
                          localStorage.setItem('cbe_owner_name', tempOwnerName);
                          setShowSettings(false);
                        }}
                        className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-xl font-medium active:scale-95 transition-transform"
                      >
                        Save
                      </button>
                    </div>
                    <div className={`w-full h-[1px] ${theme === 'light' ? 'bg-zinc-200' : 'bg-zinc-800/40'}`} />
                    <div className="flex justify-between items-center py-0.5">
                      <span className={`text-xs font-semibold ${theme === 'light' ? 'text-zinc-655' : 'text-zinc-400'}`}>Theme Mode</span>
                      <div className={`flex p-1 rounded-xl gap-1 ${theme === 'light' ? 'bg-zinc-100' : 'bg-black/40'}`}>
                        <button 
                          onClick={() => {
                            setTheme('light');
                            localStorage.setItem('cbe_theme', 'light');
                          }}
                          className={`text-xs px-3 py-1 rounded-lg transition-colors ${theme === 'light' ? 'bg-white text-black shadow-sm font-semibold' : 'text-zinc-500 hover:text-white'}`}
                        >
                          Light
                        </button>
                        <button 
                          onClick={() => {
                            setTheme('dark');
                            localStorage.setItem('cbe_theme', 'dark');
                          }}
                          className={`text-xs px-3 py-1 rounded-lg transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-black'}`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`flex gap-6 border-b pb-0 transition-colors duration-300 ${theme === 'light' ? 'border-zinc-200' : 'border-zinc-900'}`}>
              <button 
                onClick={() => setActiveTab('all')}
                className={`pb-2 px-1 transition-colors relative text-sm ${activeTab === 'all' ? (theme === 'light' ? 'text-black font-semibold' : 'text-zinc-100 font-medium') : (theme === 'light' ? 'text-zinc-400 font-normal hover:text-black' : 'text-zinc-650 font-normal hover:text-zinc-350')}`}
              >
                All
                {activeTab === 'all' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('missed')}
                className={`pb-2 px-1 transition-colors relative text-sm ${activeTab === 'missed' ? (theme === 'light' ? 'text-red-500 font-semibold' : 'text-red-500 font-medium') : (theme === 'light' ? 'text-zinc-400 font-normal hover:text-red-500' : 'text-zinc-650 font-normal hover:text-zinc-350')}`}
              >
                Missed Calls
                {activeTab === 'missed' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* --- Call List --- */}
          <div className={`flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${isKeypadOpen ? 'pb-[420px]' : 'pb-24'}`}>
            {/* Search Results for Contacts (when typing) */}
            {dialedNumber && contacts
              .filter(contact => contact.name.toLowerCase().includes(dialedNumber.toLowerCase()) || contact.number.includes(dialedNumber))
              .map(contact => (
                <div 
                  key={`search-contact-${contact.id}`}
                  className="flex items-center gap-4 py-3 px-6 active:bg-zinc-900 transition-colors border-b border-zinc-900/30"
                  onClick={() => {
                    setDialedNumber(contact.number);
                  }}
                >
                  <div className={`w-10 h-10 rounded-full ${contact.color} flex items-center justify-center text-lg font-medium`}>
                    {contact.initial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-100 font-medium text-[15px]">{contact.name}</span>
                    <span className="text-zinc-500 text-xs">{contact.number}</span>
                  </div>
                  <Phone className="w-4 h-4 text-zinc-600 ml-auto" />
                </div>
              ))}

            {recentCalls
              .filter(call => activeTab === 'all' || call.type === 'missed')
              .filter(call => !dialedNumber || call.number.includes(dialedNumber) || call.name.toLowerCase().includes(dialedNumber.toLowerCase()))
              .map((call) => (
                <div key={call.id} className="relative group overflow-hidden touch-pan-x">
                  {/* Delete Action (Hidden behind) */}
                  <div 
                    className="absolute inset-0 bg-red-600 flex items-center justify-end px-7 z-0 pointer-events-none"
                    style={{ transition: 'opacity 0.2s' }}
                  >
                    <Trash2 className="text-white w-6 h-6" />
                  </div>
                  
                  {/* Swipeable Call Item */}
                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: -100, right: 0 }}
                    dragElastic={0.05}
                    onDragStart={(e) => e.stopPropagation()}
                    className={`relative flex items-center justify-between py-4 px-6 transition-colors z-10 cursor-pointer ${theme === 'light' ? 'bg-white border-b border-zinc-100 active:bg-zinc-100' : 'bg-black border-b border-zinc-900/40 active:bg-zinc-900/50'}`}
                    onClick={(e) => {
                      if (e.defaultPrevented) return;
                      setEditingCall(call);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`transition-colors ${call.type === 'missed' ? 'text-red-500' : 'text-zinc-500'}`}>
                        {call.type === 'missed' ? (
                          <Phone className="w-4 h-4 fill-current rotate-[135deg]" />
                        ) : (
                          <Phone className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h3 className={`text-[14px] font-normal tracking-wide ${call.type === 'missed' ? 'text-red-500' : (theme === 'light' ? 'text-black' : 'text-zinc-100')}`}>
                          {call.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-655 mt-0.5">
                          <div className={`border rounded-sm px-1 text-[8px] leading-tight flex items-center justify-center min-w-[14px] ${theme === 'light' ? 'border-zinc-200 text-zinc-550' : 'border-zinc-800 text-zinc-600'}`}>
                            {call.sim}
                          </div>
                          <span className={`text-[10.5px] ${theme === 'light' ? 'text-zinc-440' : 'text-zinc-600'}`}>{call.name.startsWith('+251') ? 'Ethiopia' : 'Mobile'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10.5px] ${theme === 'light' ? 'text-zinc-440' : 'text-zinc-600'}`}>{call.time}</span>
                      <div className={`p-1 border rounded-full flex items-center justify-center ${theme === 'light' ? 'border-zinc-200' : 'border-zinc-800'}`}>
                        <Info className="w-4 h-4 text-[#007AFF]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Functional Delete Button (Behind) */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentCalls(prev => prev.filter(c => c.id !== call.id));
                    }}
                    className="absolute right-0 top-0 bottom-0 w-24 bg-red-600 flex items-center justify-center z-5"
                  >
                    <Trash2 className="text-white w-6 h-6" />
                  </button>
                </div>
              ))}
          </div>

          {/* --- Keypad Area (HiOS 16 Android Style) --- */}
          <AnimatePresence>
            {isKeypadOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`absolute bottom-0 left-0 right-0 pb-5 rounded-t-[2.2rem] border-t z-40 transition-colors duration-300 ${
                  theme === 'light' 
                    ? 'bg-[#F7F8FA] border-zinc-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]' 
                    : 'bg-[#121316] border-white/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.5)]'
                }`}
                ref={dialerRef}
              >
                {/* HiOS Top Sheet Handle */}
                <div className={`w-9 h-1 rounded-full mx-auto mt-2.5 mb-1 ${theme === 'light' ? 'bg-zinc-300' : 'bg-zinc-700/60'}`} />

                {/* --- Dialed Number Row --- */}
                <div className="flex flex-col items-center justify-center px-6 min-h-[76px] max-h-[96px] overflow-hidden">
                  {dialedNumber ? (
                    <div className="w-full flex items-center justify-between">
                      <div className="w-10 flex items-center justify-center">
                        <button 
                          onClick={() => {
                            setEditingCall({
                              id: Date.now().toString(),
                              name: '',
                              number: dialedNumber,
                              time: 'Just now',
                              type: 'outgoing',
                              sim: 1
                            });
                          }}
                          className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'text-zinc-600 hover:bg-zinc-200/60' : 'text-zinc-400 hover:bg-white/10'}`}
                          title="Add Contact"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center px-2">
                        <span className={`font-normal tracking-wide break-all text-center leading-tight transition-all duration-200 ${theme === 'light' ? 'text-zinc-900' : 'text-white'} ${
                          dialedNumber.length < 8 ? 'text-[36px]' : 
                          dialedNumber.length < 12 ? 'text-[28px]' : 
                          dialedNumber.length < 16 ? 'text-[22px]' : 
                          dialedNumber.length < 20 ? 'text-[19px]' : 'text-[17px]'
                        }`}>
                          {dialedNumber}
                        </span>
                        <button 
                          onClick={() => {
                            setEditingCall({
                              id: Date.now().toString(),
                              name: '',
                              number: dialedNumber,
                              time: 'Just now',
                              type: 'outgoing',
                              sim: 1
                            });
                          }}
                          className="text-[12px] font-medium text-[#0A84FF] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          Add to contact
                        </button>
                      </div>

                      <div className="w-10 flex items-center justify-center">
                        <button 
                          onClick={handleDelete}
                          onContextMenu={(e) => { e.preventDefault(); handleLongDelete(); }}
                          className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'text-zinc-600 active:bg-zinc-200' : 'text-zinc-400 active:bg-white/10'}`}
                          title="Delete (Hold to clear)"
                        >
                          <Delete className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-6 flex items-center justify-center">
                      <span className={`text-[12px] tracking-wide ${theme === 'light' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        HiOS Phone
                      </span>
                    </div>
                  )}
                </div>

                {/* --- HiOS 16 3x4 Keypad Grid --- */}
                <div className="grid grid-cols-3 gap-y-1 justify-items-center mt-0.5 px-6">
                  <KeypadButton digit="1" sub="oo" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="2" sub="abc" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="3" sub="def" theme={theme} onClick={handleDigitClick} />
                  
                  <KeypadButton digit="4" sub="ghi" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="5" sub="jkl" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="6" sub="mno" theme={theme} onClick={handleDigitClick} />
                  
                  <KeypadButton digit="7" sub="pqrs" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="8" sub="tuv" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="9" sub="wxyz" theme={theme} onClick={handleDigitClick} />
                  
                  <KeypadButton digit="*" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="0" sub="+" theme={theme} onClick={handleDigitClick} />
                  <KeypadButton digit="#" theme={theme} onClick={handleDigitClick} />
                </div>

                {/* --- HiOS 16 Bottom Action Row --- */}
                <div className="flex items-center justify-around px-8 mt-2 mb-3">
                  {/* Hide Keypad Button */}
                  <button 
                    onClick={() => setIsKeypadOpen(false)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      theme === 'light' 
                        ? 'text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200' 
                        : 'text-zinc-400 hover:bg-white/5 active:bg-white/10'
                    }`}
                    title="Hide keypad"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>

                  {/* HiOS Dual-SIM Call Controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => runUSSD(dialedNumber)}
                      className="flex items-center gap-1.5 bg-[#00C250] hover:bg-[#00B048] active:bg-[#009E40] text-white px-4.5 py-3 rounded-full shadow-lg shadow-green-600/25 active:scale-95 transition-all"
                      title="Call with SIM 1"
                    >
                      <Phone className="w-4 h-4 fill-current" />
                      <span className="text-[12px] font-semibold tracking-wide">SIM 1</span>
                    </button>

                    <button 
                      onClick={() => runUSSD(dialedNumber)}
                      className="flex items-center gap-1.5 bg-[#00C250] hover:bg-[#00B048] active:bg-[#009E40] text-white px-4.5 py-3 rounded-full shadow-lg shadow-green-600/25 active:scale-95 transition-all"
                      title="Call with SIM 2"
                    >
                      <Phone className="w-4 h-4 fill-current" />
                      <span className="text-[12px] font-semibold tracking-wide">SIM 2</span>
                    </button>
                  </div>

                  {/* Right Action: Delete if dialed, else Messages */}
                  {dialedNumber ? (
                    <button 
                      onClick={handleDelete}
                      onContextMenu={(e) => { e.preventDefault(); handleLongDelete(); }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        theme === 'light' 
                          ? 'text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200' 
                          : 'text-zinc-400 hover:bg-white/5 active:bg-white/10'
                      }`}
                      title="Delete"
                    >
                      <Delete className="w-6 h-6" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentView('messages')}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        theme === 'light' 
                          ? 'text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200' 
                          : 'text-zinc-400 hover:bg-white/5 active:bg-white/10'
                      }`}
                      title="Messages"
                    >
                      <MessageSquare className="w-5 h-5 fill-current" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- Floating Keypad Toggle (HiOS 16 Style FAB) --- */}
          {!isKeypadOpen && (
            <button 
              onClick={() => setIsKeypadOpen(true)}
              className="fixed bottom-24 right-6 bg-[#00C250] hover:bg-[#00B048] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-green-600/35 active:scale-95 transition-transform z-[60]"
              title="Open keypad"
            >
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
                ))}
              </div>
            </button>
          )}

          {/* --- Bottom Navigation --- */}
          <div className={`fixed bottom-0 left-0 right-0 flex justify-around py-3 h-[80px] items-start border-t transition-colors duration-300 ${theme === 'light' ? 'bg-[#F2F2F7] border-zinc-200' : 'bg-black border-zinc-900/50'}`}>
            <button className="flex flex-col items-center gap-1.5 group">
              <div className="p-1 px-5 rounded-full bg-blue-500/15">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-[11px] font-medium text-blue-500">Recents</span>
            </button>
            <button className={`flex flex-col items-center gap-1.5 group ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`} onClick={() => setCurrentView('contacts')}>
              <div className="p-1 px-5">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium">Contacts</span>
            </button>
          </div>
        </div>
      ) : currentView === 'messages' ? (
        /* --- Standalone Messages App View --- */
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className={`flex flex-col h-full transition-colors duration-300 ${theme === 'light' ? 'bg-[#F2F2F7] text-black' : 'bg-[#000000] text-white'}`}
        >
          {/* Messages Header */}
          <div className={`pt-10 px-4 pb-4 flex items-center justify-between border-b transition-colors duration-300 ${theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800/30'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (isMsgDeleteMode) {
                    setIsMsgDeleteMode(false);
                    setSelectedMessages([]);
                  } else {
                    setCurrentView('dialer');
                  }
                }}
                className="p-2 -ml-2 active:bg-zinc-800 rounded-full transition-colors"
                id="msg-back-btn"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3A3A3C] flex items-center justify-center overflow-hidden">
                  <User className="text-[#8E8E93]" size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[18px] font-medium leading-tight">CBE</span>
                  {isMsgDeleteMode && <span className="text-[12px] text-blue-500">{selectedMessages.length} selected</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button 
                  onClick={() => {
                    if (isMsgDeleteMode) {
                      setMessages(prev => prev.filter(m => !selectedMessages.includes(m.id)));
                      setSelectedMessages([]);
                      setIsMsgDeleteMode(false);
                    } else {
                      setIsMsgDeleteMode(true);
                    }
                  }}
                  className={`p-2 rounded-full transition-colors ${isMsgDeleteMode ? 'text-red-500' : 'text-zinc-400'}`}
                >
                  {isMsgDeleteMode ? <Delete size={22} /> : <div className="text-sm font-medium px-2">Select</div>}
                </button>
              )}
              <button className="p-2 active:bg-zinc-800 rounded-full text-zinc-400">
                <MoreVertical size={22} />
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 pt-6 space-y-4 no-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                <MessageSquare size={64} className="mb-4" />
                <p>No messages yet</p>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className="space-y-1">
                    <div 
                      className="flex items-start gap-3 group relative"
                      onClick={() => {
                        if (isMsgDeleteMode) {
                          setSelectedMessages(prev => 
                            prev.includes(msg.id) ? prev.filter(id => id !== msg.id) : [...prev, msg.id]
                          );
                        }
                      }}
                    >
                      {isMsgDeleteMode && (
                        <div className="flex-shrink-0 pt-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMessages.includes(msg.id) ? 'bg-blue-500 border-blue-500' : 'border-zinc-700'}`}>
                            {selectedMessages.includes(msg.id) && <Check size={14} className="text-white" />}
                          </div>
                        </div>
                      )}
                      <div className={`rounded-[1.2rem] p-3.5 max-w-[85%] self-start transition-all ${theme === 'light' ? 'bg-white shadow-sm text-black border border-zinc-100' : 'bg-[#3a3a3c] text-white'} ${isMsgDeleteMode && selectedMessages.includes(msg.id) ? 'opacity-50 scale-[0.98]' : ''}`}>
                        <p className={`text-[15.5px] leading-[1.35] whitespace-pre-wrap break-words font-normal ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                          {msg.text.split('\n').map((line, i) => (
                            <Fragment key={i}>
                              {i > 0 && <br />}
                              {line.split(/(\s+)/).map((part, j) => {
                                if (part.startsWith('http')) {
                                  return <span key={j} className="text-[#3478f6] underline break-all">{part}</span>;
                                }
                                return <Fragment key={j}>{part}</Fragment>;
                              })}
                            </Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#8e8e93] block ml-1 mt-0.5">
                      {formatMsgTime(msg.timestamp)}  <span className="ml-1 border border-[#8e8e93]/30 px-1 rounded-[2px] text-[9px] font-medium">1</span>
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} className="h-2" />
              </>
            )}
          </div>

          {/* Message Input Bar */}
          <div className={`p-3 border-t flex flex-col gap-1 safe-area-bottom transition-colors duration-300 ${theme === 'light' ? 'border-zinc-200 bg-[#E5E5EA]' : 'border-zinc-900/50 bg-[#0F0F0F]'}`}>
            {ussdInput.length > 0 && (
              <div className="flex items-end justify-end px-2">
                <span className="text-[10px] text-zinc-500 mr-2">{ussdInput.length} / 1</span>
              </div>
            )}
            <div className="flex items-center gap-3 px-1">
              <div className={`flex-1 rounded-2xl p-2 flex items-center gap-3 border shadow-inner transition-colors duration-300 ${theme === 'light' ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#242426] border-white/5'}`}>
                <button className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'light' ? 'active:bg-zinc-105' : 'active:bg-zinc-800'}`}>
                  <Plus className="text-zinc-400" size={22} />
                </button>
                <input 
                  type="text" 
                  placeholder="Message" 
                  className={`bg-transparent border-none outline-none text-[16.5px] flex-1 placeholder:text-zinc-400 ${theme === 'light' ? 'text-black' : 'text-zinc-100'}`}
                  value={ussdInput}
                  onChange={(e) => setUssdInput(e.target.value)}
                />
                <div className={`h-6 w-[1px] mx-1 ${theme === 'light' ? 'bg-zinc-200' : 'bg-zinc-800'}`}></div>
                <div className="flex items-center gap-1 px-2 text-zinc-400 cursor-pointer">
                  <span className={`text-[12px] border rounded px-1 min-w-[16px] text-center font-medium ${theme === 'light' ? 'border-zinc-300 text-zinc-600' : 'border-zinc-700/50 text-zinc-400'}`}>1</span>
                  <ChevronDown size={14} />
                </div>
              </div>
              <button 
                onClick={handleUssdAction}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${ussdInput.length > 0 ? 'bg-[#0B84FF] scale-100 shadow-[0_0_15px_-3px_rgba(11,132,255,0.5)]' : `${theme === 'light' ? 'bg-[#D1D1D6]' : 'bg-zinc-850'} opacity-80 scale-95`}`}
              >
                {ussdInput.length > 0 ? <ArrowUp className="text-white" size={24} strokeWidth={2.5} stroke="currentColor" /> : <Mic size={22} className="text-zinc-400" />}
              </button>
            </div>
          </div>
        </motion.div>
      ) : currentView === 'contacts' ? (
        /* --- Contacts View --- */
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className={`flex flex-col h-full transition-colors duration-300 ${theme === 'light' ? 'bg-[#F2F2F7] text-black' : 'bg-black text-white'}`}>
          <div className="pt-10 px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-[32px] font-normal transition-colors ${theme === 'light' ? 'text-black' : 'text-zinc-100'}`}>Contacts</h1>
              <Hexagon className={`w-5 h-5 ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-300'}`} />
            </div>
            <p className="text-zinc-500 text-sm mb-4">469 contacts</p>
            <div className={`rounded-xl px-4 py-2.5 flex items-center gap-3 mb-6 transition-colors ${theme === 'light' ? 'bg-white border border-zinc-200' : 'bg-zinc-900/80'}`}>
              <Search className="w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search" 
                className={`bg-transparent border-none outline-none text-[17px] flex-1 ${theme === 'light' ? 'text-black placeholder:text-zinc-400' : 'text-zinc-100'}`} 
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 relative no-scrollbar pb-24">
            <div className={`absolute right-1 top-4 h-full flex flex-col gap-1 text-[9px] font-bold pr-2 z-20 ${theme === 'light' ? 'text-zinc-400 bg-white/20' : 'text-zinc-500 bg-black/50'}`}>
              {['★', ':', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z', ':', '#'].map((l, idx) => <span key={`${l}-${idx}`}>{l}</span>)}
            </div>

            <div className="space-y-8 pb-32">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-zinc-200 text-zinc-550' : 'bg-zinc-800 text-zinc-500'}`}><User size={28} /></div>
                <span className="text-[20px]">My Profile</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-zinc-200 text-zinc-550' : 'bg-zinc-800 text-zinc-500'}`}><User size={28} /></div>
                <span className="text-[20px]">My Groups</span>
              </div>

              {/* Favorites Section */}
              {contacts.filter(c => c.isFavorite && (c.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) || c.number.includes(contactSearchQuery))).length > 0 && (
                <div className="space-y-6 pt-4">
                  <h2 className="text-zinc-500 text-sm font-medium">★</h2>
                  {contacts.filter(c => c.isFavorite && (c.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) || c.number.includes(contactSearchQuery))).map(contact => (
                    <div key={contact.id} className={`flex items-center gap-4 rounded-xl transition-colors p-1 ${theme === 'light' ? 'active:bg-zinc-200/60 hover:bg-zinc-100' : 'active:bg-zinc-900 hover:bg-zinc-900/40'}`}>
                      <div className={`w-14 h-14 rounded-full ${contact.color} flex items-center justify-center text-2xl font-medium`}>
                        {contact.initial}
                      </div>
                      <span className="text-[20px]">{contact.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* All Contacts Section */}
              <div className="space-y-6 pt-4">
                <h2 className="text-zinc-500 text-sm font-medium">All Contacts</h2>
                {contacts.filter(c => !c.isFavorite && (c.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) || c.number.includes(contactSearchQuery))).map(contact => (
                  <div key={contact.id} className={`flex items-center gap-4 rounded-xl transition-colors p-1 ${theme === 'light' ? 'active:bg-zinc-200/60 hover:bg-zinc-100' : 'active:bg-zinc-900'}`}>
                    <div className={`w-14 h-14 rounded-full ${contact.color} flex items-center justify-center text-2xl font-medium`}>
                      {contact.initial}
                    </div>
                    <span className="text-[20px]">{contact.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className={`fixed bottom-0 left-0 right-0 flex justify-around py-3 h-[80px] items-start border-t transition-colors duration-300 ${theme === 'light' ? 'bg-[#F2F2F7] border-zinc-200' : 'bg-black border-zinc-900/50'} z-50`}>
            <button className={`flex flex-col items-center gap-1.5 group ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`} onClick={() => setCurrentView('dialer')}>
              <div className="p-1 px-5">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium">Recents</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 group">
              <div className="p-1 px-5 rounded-full bg-blue-500/15">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-[11px] font-medium text-blue-500">Contacts</span>
            </button>
          </div>
        </motion.div>
      ) : currentView === 'search' ? (
        /* --- Search View --- */
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex flex-col h-full bg-black text-white">
          <div className="pt-10 px-4 flex items-center gap-4">
            <button onClick={() => setCurrentView('dialer')}><ArrowLeft size={24} /></button>
            <div className="flex-1 bg-zinc-900/60 rounded-xl px-4 py-2 flex items-center gap-3">
              <Search className="w-4 h-4 text-zinc-500" />
              <input type="text" placeholder="Search" autoFocus className="bg-transparent border-none outline-none text-[17px] flex-1 text-zinc-100" />
              <Mic className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <div className="w-48 h-48 bg-zinc-900/30 rounded-full flex items-center justify-center mb-6 overflow-hidden relative">
              <FileText size={80} className="text-zinc-600" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            </div>
            <p className="text-zinc-400 text-[18px]">No search history</p>
          </div>
        </motion.div>
      ) : (
        /* --- Calling Screen --- */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-gradient-to-b from-[#2c4c5c] via-[#1a2b33] to-[#0e161a] text-white flex flex-col items-center px-10">
          <div className="mt-40 text-center">
            <h1 className="text-[44px] font-normal mb-8">{callingNumber}</h1>
            <div className="flex flex-col items-center gap-2">
              <div className="border border-white/20 rounded-md px-1.5 text-[10px]">1</div>
              <p className="text-[20px] font-light text-white/80">Calling...</p>
            </div>
          </div>

          <div className="mt-[180px] grid grid-cols-3 gap-x-12 gap-y-16 w-full justify-items-center mb-auto">
            <div className="flex flex-col items-center gap-3 opacity-40">
              <div className="w-[1.2px] h-6 bg-white/40 rotate-45 absolute -mr-6 -mt-1 hidden"></div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-10 flex gap-0.5 items-end justify-center">
                  {[3,5,2,4,6].map((h,i) => <div key={i} className={`w-[2px] bg-white rounded-full`} style={{height: `${h*4}px`}}></div>)}
                </div>
              </div>
              <span className="text-[13px] whitespace-nowrap">Start Record...</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MicOff size={28} className="text-white/80" />
              <span className="text-[13px]">Mute</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Pause size={28} className="text-white/80" />
              <span className="text-[13px]">Hold</span>
            </div>
            <div className="flex flex-col items-center gap-3 opacity-40">
              <FileText size={28} className="text-white/80" />
              <span className="text-[13px] whitespace-nowrap">Call Summary</span>
            </div>
            <div className="flex flex-col items-center gap-3 opacity-40">
              <Phone className="w-7 h-7 text-white/80 rotate-[135deg]" />
              <span className="text-[13px] whitespace-nowrap">Clear Calling</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ChevronDown size={28} className="text-white/80" />
              <span className="text-[13px]">More</span>
            </div>
          </div>

          <div className="mb-24 flex items-center justify-between w-full max-w-[280px]">
            <Volume2 size={36} className="text-white/80" />
            <button 
              onClick={endCall}
              className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center active:scale-95 shadow-2xl"
            >
              <Phone className="w-8 h-8 text-white fill-current rotate-[135deg]" />
            </button>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
              ))}
            </div>
          </div>
        </motion.div>
      )}


      {/* --- USSD UI Layer --- */}
      <AnimatePresence>
        {ussdRunning ? (
          <div className="fixed inset-0 z-[101] flex items-end justify-center bg-transparent pointer-events-none pb-[120px]">
            <motion.div 
              key="ussd-loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0 } }}
              transition={{ duration: 0.1 }}
              className={`px-8 py-8 rounded-[2.5rem] flex items-center gap-5 w-full max-w-[385px] mx-6 transition-colors duration-300 ${
                theme === 'light' 
                  ? 'bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-zinc-200' 
                  : 'bg-[#1C1C1E] text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/[0.03]'
              }`}
            >
              <motion.div 
                className="relative w-8 h-8 flex items-center justify-center mr-1"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              >
                <div className={`absolute top-0 w-2 h-2 rounded-full ${theme === 'light' ? 'bg-[#0A84FF] shadow-[0_0_8px_rgba(10,132,255,0.4)]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'}`} />
                <div className={`absolute bottom-0 w-2 h-2 rounded-full opacity-40 ${theme === 'light' ? 'bg-[#0A84FF]' : 'bg-white'}`} />
              </motion.div>
              <span className={`text-[17.5px] font-normal tracking-tight ${theme === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>USSD code running...</span>
            </motion.div>
          </div>
        ) : ussdResult ? (
          <div className="fixed inset-0 bg-black/60 z-[95] flex items-end justify-center pb-[120px] pointer-events-none">
            <motion.div 
              key="ussd-dialog"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ 
                opacity: 1,
                scale: 1,
                y: isClosingRef.current ? -220 : (isInputFocused ? -220 : 0)
              }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0 } }}
              transition={isClosingRef.current ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 45, mass: 1 }}
              className={`w-full max-w-[385px] mx-6 rounded-[1.8rem] overflow-hidden flex flex-col ussd-modal pointer-events-auto transition-colors duration-300 ${
                theme === 'light'
                  ? 'bg-white shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-zinc-200/80 text-black'
                  : 'bg-[#202022] shadow-[0_30px_70px_rgba(0,0,0,0.85)] border border-white/5 text-white'
              }`}
            >
              <div 
                className="px-7 pt-5 pb-0 flex flex-col overflow-y-auto max-h-[350px]"
                onClick={() => {
                  const input = document.querySelector('.ussd-modal input') as HTMLInputElement;
                  input?.focus();
                }}
              >
                {/* --- Step: PIN Login --- */}
                {ussdStep === 'CBE_LOGIN_PIN' && (
                  <>
                    <p className={`text-[17px] leading-[1.25] mb-0 font-normal tracking-tight ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      Welcome to CBE Mobile Banking. Please enter your PIN to login:
                    </p>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Main Menu --- */}
                {ussdStep === 'CBE_MAIN_MENU' && (
                  <>
                    <div className={`text-[16.5px] leading-[1.25] mb-0 font-normal whitespace-pre ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {"1:My Account\n2:Transfer to CBE Account\n3:Beneficiary\n4:Own Account Transfer\n5:Airtime\n6:Other Transfers\n7:CBEBirr\n8:Bills & Utilities\n9:Travel\n10:Next"}
                    </div>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: My Account Selection --- */}
                {ussdStep === 'CBE_MY_ACCOUNT_SELECT' && (
                  <>
                    <p className={`text-[16px] leading-[1.25] mb-0 font-normal whitespace-pre ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {"Select Account\n1:Education savin-0037\n2:Back"}
                    </p>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Account Summary --- */}
                {ussdStep === 'CBE_ACCOUNT_SUMMARY' && (
                  <>
                    <div className={`text-[15.5px] leading-[1.35] mb-0 font-normal whitespace-pre ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {`${ownerName}\nAvailable Balance is ETB ${availableBalance}\nTransactions\n` + ussdTransactions.slice(0, 5).map((t, i) => `${i+1}:${t.amount} on ${t.date}`).join('\n') + "\n6:Back\n7:Next"}
                    </div>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Transaction Detail --- */}
                {ussdStep === 'CBE_TRANSACTION_DETAIL' && ussdSelectedTransaction && (
                  <>
                    <div className={`text-[15.5px] leading-[1.35] mb-0 font-normal whitespace-pre ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {`Amount:${ussdSelectedTransaction.amount} ETB\nAbout Payment: ${ussdSelectedTransaction.about}\nFrom ${ussdSelectedTransaction.from} to\n${ussdSelectedTransaction.to}\nOn Date:${ussdSelectedTransaction.timestamp}\n1:Back`}
                    </div>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Receiver Name --- */}
                {ussdStep === 'CBE_RECEIVER_NAME' && (
                  <>
                    <p className={`text-[16.5px] leading-[1.25] mb-0 font-normal ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      Enter Receiver Name:
                    </p>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Receiver Account --- */}
                {ussdStep === 'CBE_RECEIVER_ACCOUNT' && (
                  <>
                    <p className={`text-[16.5px] leading-[1.3] mb-0 font-normal ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      Please enter account you want to transfer
                    </p>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Amount Entry --- */}
                {ussdStep === 'CBE_AMOUNT_ENTRY' && (
                  <>
                    <p className={`text-[16.5px] leading-[1.25] mb-0 font-normal whitespace-pre-wrap ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {ownerName} ETB Saving-0037 to {ussdSessionData.receiverName} ETB {
                        (() => {
                          const name = ussdSessionData.receiverName || '';
                          const firstWord = name.trim().split(' ')[0].toLowerCase();
                          return (firstWord.endsWith('a') || firstWord.endsWith('e') || firstWord.endsWith('i') || firstWord.endsWith('t')) ? 'Women Saving Ac' : 'Saving Ac';
                        })()
                      }-{ussdSessionData.receiverAcc?.slice(-4)}{"\n"}
                      Enter Amount
                    </p>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Reason Entry --- */}
                {ussdStep === 'CBE_REASON_ENTRY' && (
                  <>
                    <p className={`text-[16.5px] leading-[1.25] mb-0 font-normal whitespace-pre-wrap ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {ownerName} ETB Saving-0037 to {ussdSessionData.receiverName} ETB {
                        (() => {
                          const name = ussdSessionData.receiverName || '';
                          const firstWord = name.trim().split(' ')[0].toLowerCase();
                          return (firstWord.endsWith('a') || firstWord.endsWith('e') || firstWord.endsWith('i') || firstWord.endsWith('t')) ? 'Women Saving Ac' : 'Saving Ac';
                        })()
                      }-{ussdSessionData.receiverAcc?.slice(-4)}{"\n"}
                      Amount:{ussdSessionData.amount}{"\n"}
                      Enter Reason
                    </p>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Final PIN --- */}
                {ussdStep === 'CBE_FINAL_PIN' && (
                  <>
                    <p className={`text-[16.5px] leading-[1.25] mb-0 font-normal whitespace-pre-wrap ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {ownerName} ETB Saving-0037 to {ussdSessionData.receiverName} ETB {
                        (() => {
                          const name = ussdSessionData.receiverName || '';
                          const firstWord = name.trim().split(' ')[0].toLowerCase();
                          return (firstWord.endsWith('a') || firstWord.endsWith('e') || firstWord.endsWith('i') || firstWord.endsWith('t')) ? 'Women Saving Ac' : 'Saving Ac';
                        })()
                      }-{ussdSessionData.receiverAcc?.slice(-4)}{"\n"}
                      Amount:{ussdSessionData.amount}{"\n"}
                      Remark:{ussdSessionData.reason}{"\n\n"}
                      Enter PIN to pay
                    </p>
                    <div className="relative mb-0">
                      <input 
                        type="text" autoFocus 
                        value={ussdInput} 
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal py-1.5 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </>
                )}

                {/* --- Step: Error Message --- */}
                {ussdStep === 'CBE_ERROR_MSG' && (
                  <div className={`text-[17px] font-normal leading-[1.6] mb-2 whitespace-pre-wrap ${theme === 'light' ? 'text-red-600 font-medium' : 'text-white'}`}>
                    {ussdResult}
                  </div>
                )}

                {/* --- Step: Success Message --- */}
                {ussdStep === 'CBE_SUCCESS' && (
                   <div className="flex flex-col pt-0.5 pb-0">
                    <p className={`text-[17px] leading-[1.25] mb-0 font-normal tracking-tight whitespace-pre-wrap ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                      {`Completed ETB${(Number(ussdSessionData.amount || 0) + 0.61).toFixed(2)} transfer From ${ussdSessionData.senderName || ownerName} to ${ussdSessionData.receiverName || 'Wondimu Dargaso Koyira'}-${ussdSessionData.receiverAcc?.slice(-4) || '4455'}. To ${ussdSessionData.reason || '432'} on ${getTodayDate()} ${ussdSessionData.txId || ''} Service Charge\n#:Next`}
                    </p>
                    <div className="relative mt-0 mb-0">
                      <input 
                        type="text"
                        autoFocus
                        value={ussdInput}
                        onChange={(e) => setUssdInput(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => {
                          setIsInputFocused(false);
                          if (isClosingRef.current) return;
                          setTimeout(() => {
                            if (isClosingRef.current) return;
                            const input = document.querySelector('.ussd-modal input') as HTMLInputElement;
                            input?.focus();
                          }, 10);
                        }}
                        className={`w-full bg-transparent border-none outline-none text-[19.5px] font-normal pt-0 pb-1 caret-[#0A84FF] focus:outline-none focus:ring-0 ${theme === 'light' ? 'text-black' : 'text-[#C0C0C0]'}`}
                      />
                    </div>
                  </div>
                )}

                {/* --- Step: Generic USSD --- */}
                {ussdStep === 'GENERIC' && (
                  <div className={`text-[17px] font-normal whitespace-pre-wrap leading-[1.6] ${theme === 'light' ? 'text-zinc-800' : 'text-[#969696]'}`}>
                    {ussdResult}
                  </div>
                )}
              </div>

               {/* --- Nav Buttons --- */}
              <div className="w-full h-[1.5px] bg-[#0A84FF]/90" />
              <div className="flex h-[3.4rem]">
                <button 
                  onClick={closeDialog}
                  className={`flex-1 text-[#0A84FF] text-[18.5px] font-medium transition-colors ${theme === 'light' ? 'active:bg-zinc-100 hover:bg-zinc-50' : 'active:bg-white/[0.03]'}`}
                >
                  Cancel
                </button>
                <div className={`w-[1.5px] h-full flex-shrink-0 ${theme === 'light' ? 'bg-zinc-200' : 'bg-white/[0.12]'}`} />
                <button 
                  onClick={ussdStep === 'CBE_SUCCESS' || ussdStep === 'GENERIC' || ussdStep === 'CBE_ERROR_MSG' ? closeDialog : handleUssdAction}
                  className={`flex-1 text-[#0A84FF] text-[18.5px] font-medium transition-colors ${theme === 'light' ? 'active:bg-zinc-100 hover:bg-zinc-50' : 'active:bg-white/[0.03]'}`}
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* --- Edit Call Modal --- */}
      <AnimatePresence>
        {editingCall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1C1C1E] w-full max-w-[320px] rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Edit Call Info</h2>
                  <button onClick={() => setEditingCall(null)} className="text-zinc-500 active:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block px-1">Name</label>
                    <input 
                      type="text" 
                      value={editingCall.name}
                      onChange={(e) => setEditingCall({ ...editingCall, name: e.target.value })}
                      className="w-full bg-[#2C2C2E] border-none outline-none text-[17px] py-2 px-3 rounded-xl text-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block px-1">Number</label>
                    <input 
                      type="text" 
                      value={editingCall.number}
                      onChange={(e) => setEditingCall({ ...editingCall, number: e.target.value })}
                      className="w-full bg-[#2C2C2E] border-none outline-none text-[17px] py-2 px-3 rounded-xl text-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block px-1">Time</label>
                      <input 
                        type="text" 
                        value={editingCall.time}
                        onChange={(e) => setEditingCall({ ...editingCall, time: e.target.value })}
                        className="w-full bg-[#2C2C2E] border-none outline-none text-[17px] py-2 px-3 rounded-xl text-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block px-1">SIM</label>
                      <select 
                        value={editingCall.sim}
                        onChange={(e) => setEditingCall({ ...editingCall, sim: Number(e.target.value) as 1 | 2 })}
                        className="w-full bg-[#2C2C2E] border-none outline-none text-[17px] py-2 px-3 rounded-xl text-white focus:ring-1 focus:ring-blue-500 appearance-none"
                      >
                        <option value={1}>SIM 1</option>
                        <option value={2}>SIM 2</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block px-1">Type</label>
                    <div className="flex gap-2 p-1 bg-[#2C2C2E] rounded-xl">
                      {(['incoming', 'outgoing', 'missed'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setEditingCall({ ...editingCall, type })}
                          className={`flex-1 py-1.5 rounded-lg text-[13px] capitalize transition-colors ${editingCall.type === type ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={() => {
                      setRecentCalls(prev => prev.filter(c => c.id !== editingCall.id));
                      setEditingCall(null);
                    }}
                    className="flex-1 bg-red-500/10 text-red-500 py-3 rounded-xl font-medium active:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => handleUpdateCall(editingCall)}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium active:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
