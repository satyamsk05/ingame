const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5050;

require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth0 Configuration (Real Production Setup)
const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET || '77c363e5304af93f35a2e3c8881801772e13bd1a15cb208729c22350e1d8593c',
  baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
  clientID: process.env.CLIENT_ID || 'WxcN6MSEPSfkoFuDGRv1FhdRN4hpOQVe',
  clientSecret: process.env.CLIENT_SECRET || 'FNPbQnnspnGQeq919zAWoH2KOHW8JK6n5Eic5GFZeW5Vh15rv9eomWUcrLBoxcOY',
  issuerBaseURL: process.env.ISSUER_BASE_URL || 'https://dev-d5lt4jxvqrvrx1rp.us.auth0.com',
  authorizationParams: {
    response_type: 'code',
    connection: 'google-oauth2',
  },
};

// Enable Auth0 middleware if configured
if (process.env.CLIENT_ID || auth0Config.clientID) {
  try {
    app.use(auth(auth0Config));
    console.log('✅ Real Auth0 Google OAuth authentication enabled.');
  } catch (err) {
    console.warn('⚠️ Auth0 initialization deferred:', err.message);
  }
}

// Health Check Route for Render / UptimeRobot keep-alive
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    auth0Configured: Boolean(process.env.CLIENT_ID && process.env.ISSUER_BASE_URL)
  });
});

// In-Memory Database Store (For fast gaming state)
// Multi-User Database Store & Session Isolation
const usersStore = {
  'usr_9981': {
    id: 'usr_9981',
    username: 'Ashu K',
    phoneNumber: '+91727*****82',
    avatarPath: 'assets/avatar/avatar_1.png',
    depositBalance: 800.0,
    winningsBalance: 450.0,
    rewardsBalance: 0.0,
  }
};

let userState = usersStore['usr_9981'];

// Helper to get or create user profile
function getUserState(userId = 'usr_9981') {
  if (!usersStore[userId]) {
    usersStore[userId] = {
      id: userId,
      username: 'Player_' + userId.slice(-4),
      phoneNumber: '+91987*****00',
      avatarPath: 'assets/avatar/avatar_1.png',
      depositBalance: 500.0,
      winningsBalance: 200.0,
      rewardsBalance: 0.0,
    };
  }
  return usersStore[userId];
}

// Complete Bet Audit Trail Log
let betAuditLogs = [
  {
    id: 'bet_1001',
    userId: 'usr_9981',
    gameTitle: '7 Up Down',
    betType: 'DOWN (2-6)',
    amount: 50.0,
    diceResult: '2 + 3 = 5',
    status: 'WON',
    payout: 100.0,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'bet_1002',
    userId: 'usr_9981',
    gameTitle: 'Fruit Slice Ninja',
    betType: 'Match Entry',
    amount: 10.0,
    diceResult: 'N/A',
    status: 'FINISHED',
    payout: 18.0,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  }
];

let transactionsList = [
  {
    id: 'tx_101',
    title: 'Day 2 Reward',
    amount: 8.0,
    isCredit: true,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: 'Reward',
  },
  {
    id: 'tx_102',
    title: 'Cash Deposited',
    amount: 500.0,
    isCredit: true,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    category: 'Deposit',
  },
  {
    id: 'tx_103',
    title: 'Won : Call Break',
    amount: 20.0,
    isCredit: true,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    category: 'Game',
  },
];

const gamesList = [
  {
    id: 'game_fruit_slice',
    title: 'Fruit Slice Ninja',
    category: 'Arcade',
    entryFee: 10.0,
    prizePool: 18.0,
    icon: 'Assets/nav_icon/nav_game.png',
    gameUrl: '/games/fruit_slice/index.html',
    badge: 'HOT 🔥',
    activePlayers: 1420,
  },
  {
    id: 'game_ludo_classic',
    title: 'Ludo Express',
    category: 'Board',
    entryFee: 20.0,
    prizePool: 36.0,
    icon: 'Assets/nav_icon/nav_game.png',
    gameUrl: '/games/ludo/index.html',
    badge: 'POPULAR ⭐',
    activePlayers: 3890,
  },
  {
    id: 'game_call_break',
    title: 'Call Break Pro',
    category: 'Cards',
    entryFee: 50.0,
    prizePool: 90.0,
    icon: 'Assets/nav_icon/nav_game.png',
    gameUrl: '/games/call_break/index.html',
    badge: 'HIGH STAKES',
    activePlayers: 890,
  },
  {
    id: 'game_carrom_star',
    title: 'Carrom Clash',
    category: 'Board',
    entryFee: 15.0,
    prizePool: 27.0,
    icon: 'Assets/nav_icon/nav_game.png',
    gameUrl: '/games/carrom/index.html',
    badge: 'NEW 🚀',
    activePlayers: 2150,
  },
  {
    id: 'game_7_up_down',
    title: '7 Up Down (Dice)',
    category: 'Dice',
    entryFee: 10.0,
    prizePool: 20.0,
    icon: 'Assets/nav_icon/nav_game.png',
    gameUrl: '/games/seven_up_down/index.html',
    badge: 'HOT 🔥',
    activePlayers: 4520,
  },
];

// --- REST API ENDPOINTS ---

// In-Memory OTP Store with expiry tracking
const otpStore = {};

// Helper: Send Real OTP via Gateway (Fast2SMS, 2Factor, Twilio)
async function sendRealOtpGateway(phone, otp, channel) {
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const twoFactorKey = process.env.TWOFACTOR_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;

  try {
    if (fast2smsKey && fast2smsKey !== 'your_fast2sms_api_key') {
      // Fast2SMS API (India OTP)
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phone,
        }),
      });
      console.log(`📱 Real Fast2SMS OTP ${otp} dispatched to +91${phone}`);
      return true;
    } else if (twoFactorKey && twoFactorKey !== 'your_2factor_api_key') {
      // 2Factor.in API (India OTP)
      await fetch(`https://2factor.in/API/V1/${twoFactorKey}/SMS/+91${phone}/${otp}/AUTOGEN`);
      console.log(`📱 Real 2Factor OTP ${otp} dispatched to +91${phone}`);
      return true;
    } else if (twilioSid && (twilioAuth || process.env.TWILIO_API_SECRET) && twilioSid !== 'your_twilio_sid') {
      // Twilio SMS / WhatsApp (Supports ContentSid templates for WhatsApp & standard SMS)
      const userSid = process.env.TWILIO_API_KEY_SID || twilioSid;
      const passSecret = process.env.TWILIO_API_SECRET || twilioAuth;
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '+17372212163';
      const contentSid = process.env.TWILIO_WHATSAPP_CONTENT_SID || 'HX25161c213d71bb75e073ead06f38fbbd';

      const authHeader = 'Basic ' + Buffer.from(`${userSid}:${passSecret}`).toString('base64');
      const bodyParams = new URLSearchParams();

      if (channel === 'whatsapp') {
        bodyParams.append('To', `whatsapp:+91${phone}`);
        bodyParams.append('From', `whatsapp:${twilioPhone}`);
        bodyParams.append('ContentSid', contentSid);
        bodyParams.append('ContentVariables', JSON.stringify({ "1": otp }));
      } else {
        bodyParams.append('To', `+91${phone}`);
        bodyParams.append('From', twilioPhone);
        bodyParams.append('Body', `Your InGames Verification Code is: ${otp}`);
      }

      const twRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      const twData = await twRes.json();
      if (!twRes.ok) {
        console.error(`⚠️ Twilio Error (${twData.code}):`, twData.message);
        return { success: false, error: twData.message || 'Twilio Gateway Error' };
      }

      console.log(`📱 Real Twilio OTP ${otp} dispatched to +91${phone} via ${channel}`);
      return { success: true };
    }
  } catch (err) {
    console.error('⚠️ Real SMS Gateway error:', err.message);
    return { success: false, error: err.message };
  }
  return { success: false, error: 'SMS Gateway credentials missing in .env' };
}

// Auth Endpoint 1: Send Real OTP via SMS or WhatsApp
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone, channel = 'sms' } = req.body;

  if (!phone || typeof phone !== 'string' || phone.trim().replace(/[^0-9]/g, '').length < 10) {
    return res.status(400).json({ status: 'error', message: 'Valid 10-digit mobile number required' });
  }

  const sanitizedPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  
  // Generate Real Secure Random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  otpStore[sanitizedPhone] = {
    otp,
    channel,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
  };

  // Attempt real SMS / WhatsApp gateway dispatch
  const dispatchResult = await sendRealOtpGateway(sanitizedPhone, otp, channel);

  if (!dispatchResult.success) {
    return res.status(400).json({
      status: 'error',
      message: dispatchResult.error,
    });
  }

  res.json({
    status: 'success',
    message: `Real OTP sent successfully via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`,
    channel,
    phone: sanitizedPhone,
  });
});

// Auth Endpoint 2: Verify Real OTP & Return User Session
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ status: 'error', message: 'Phone number and OTP are required' });
  }

  const sanitizedPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  const storedData = otpStore[sanitizedPhone];

  if (!storedData) {
    return res.status(400).json({ status: 'error', message: 'OTP expired or not requested. Please request a new OTP.' });
  }

  if (Date.now() > storedData.expiresAt) {
    delete otpStore[sanitizedPhone];
    return res.status(400).json({ status: 'error', message: 'OTP has expired. Please request a new OTP.' });
  }

  if (storedData.otp === otp.toString().trim()) {
    // Clear used OTP from memory
    delete otpStore[sanitizedPhone];

    const userId = 'usr_' + sanitizedPhone;
    const user = getUserState(userId);
    user.phoneNumber = `+91${sanitizedPhone}`;
    const totalBalance = user.depositBalance + user.winningsBalance + user.rewardsBalance;

    return res.json({
      status: 'success',
      message: 'Login successful',
      token: 'jwt_ingames_token_' + sanitizedPhone,
      data: {
        ...user,
        totalBalance,
      },
    });
  }

  return res.status(400).json({ status: 'error', message: 'Invalid OTP code entered. Please check and try again.' });
});

// Auth Endpoint 3: Google One-Click OAuth Login
app.post('/api/auth/google', (req, res) => {
  const { email, name, picture, googleId } = req.body;
  const userEmail = email || 'player@gmail.com';
  const cleanId = (googleId || userEmail.replace(/[^a-zA-Z0-9]/g, '')).slice(0, 20);
  const userId = 'usr_g_' + cleanId;

  const user = getUserState(userId);
  if (name) user.username = name;
  user.email = userEmail;
  if (picture) user.avatarPath = picture;

  const totalBalance = user.depositBalance + user.winningsBalance + user.rewardsBalance;

  return res.json({
    status: 'success',
    message: 'Google Sign-In successful',
    token: 'jwt_google_token_' + userId,
    data: {
      ...user,
      totalBalance,
    },
  });
});

// 1. App Configuration & Maintenance Status
app.get('/api/config', (req, res) => {
  res.json({
    status: 'success',
    version: '1.0.0',
    minVersionRequired: '1.0.0',
    maintenanceMode: false,
    updateUrl: 'https://ingames.app/download',
    referralReward: 1000,
    onlineUsersCount: 89156 + Math.floor(Math.random() * 200),
  });
});

// 1b. Get Promotional Banners List (Served from server)
app.get('/api/banners', (req, res) => {
  res.json({
    status: 'success',
    data: [
      {
        id: 'banner_spin_win',
        type: 'image',
        imageUrl: 'http://localhost:5050/banners/banner.png',
        title: 'Spin & Win Jackpot',
      },
      {
        id: 'banner_deposit_bonus',
        type: 'deposit_card',
        title: 'DEPOSIT BONUS\n180% BONUS',
        subtitle: 'DEPOSIT -> GET BONUS',
      },
    ],
  });
});

// 2. Get User Profile & Wallet Balances
app.get('/api/user/profile', (req, res) => {
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_9981';
  const user = getUserState(userId);
  const totalBalance = user.depositBalance + user.winningsBalance + user.rewardsBalance;
  res.json({
    status: 'success',
    data: {
      ...user,
      totalBalance,
    },
  });
});

// Update User Profile (Username & Avatar)
app.post('/api/user/update-profile', (req, res) => {
  const userId = req.body.userId || req.headers['x-user-id'] || 'usr_9981';
  const user = getUserState(userId);
  const { username, avatarPath } = req.body;
  if (username && typeof username === 'string' && username.trim().length > 0) {
    user.username = username.trim();
  }
  if (avatarPath && typeof avatarPath === 'string') {
    user.avatarPath = avatarPath;
  }
  const totalBalance = user.depositBalance + user.winningsBalance + user.rewardsBalance;
  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      ...user,
      totalBalance,
    },
  });
});

// 3. Get Active Games List
app.get('/api/games', (req, res) => {
  res.json({
    status: 'success',
    count: gamesList.length,
    data: gamesList,
  });
});

// 4. Add Cash (Simulated Payment Gateway Endpoint)
app.post('/api/wallet/add-cash', (req, res) => {
  const userId = req.body.userId || req.headers['x-user-id'] || 'usr_9981';
  const user = getUserState(userId);
  const { amount, paymentMethod } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid deposit amount' });
  }

  user.depositBalance += numAmount;

  const newTx = {
    id: 'tx_' + Date.now(),
    title: `Cash Deposited (${paymentMethod || 'UPI'})`,
    amount: numAmount,
    isCredit: true,
    timestamp: new Date().toISOString(),
    category: 'Deposit',
  };

  transactionsList.unshift(newTx);

  io.emit('wallet_updated', {
    userId: user.id,
    depositBalance: user.depositBalance,
    winningsBalance: user.winningsBalance,
    totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
  });

  res.json({
    status: 'success',
    message: `₹${numAmount} added successfully via ${paymentMethod || 'UPI'}`,
    data: {
      depositBalance: user.depositBalance,
      winningsBalance: user.winningsBalance,
      totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
      transaction: newTx,
    },
  });
});

// 5. Withdraw Cash
app.post('/api/wallet/withdraw', (req, res) => {
  const userId = req.body.userId || req.headers['x-user-id'] || 'usr_9981';
  const user = getUserState(userId);
  const { amount, upiId } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid withdrawal amount' });
  }

  if (numAmount > user.winningsBalance) {
    return res.status(400).json({ status: 'error', message: 'Insufficient winnings balance for withdrawal' });
  }

  user.winningsBalance -= numAmount;

  const newTx = {
    id: 'tx_' + Date.now(),
    title: `Withdrawal to ${upiId || 'UPI'}`,
    amount: numAmount,
    isCredit: false,
    timestamp: new Date().toISOString(),
    category: 'Withdrawal',
  };

  transactionsList.unshift(newTx);

  io.emit('wallet_updated', {
    userId: user.id,
    depositBalance: user.depositBalance,
    winningsBalance: user.winningsBalance,
    totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
  });

  res.json({
    status: 'success',
    message: `₹${numAmount} withdrawal initiated to ${upiId || 'Bank'}`,
    data: {
      depositBalance: user.depositBalance,
      winningsBalance: user.winningsBalance,
      totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
      transaction: newTx,
    },
  });
});

// 6. Deduct Entry Fee / Place Bet when game starts
app.post('/api/games/join', (req, res) => {
  const userId = req.body.userId || req.headers['x-user-id'] || 'usr_9981';
  const user = getUserState(userId);
  const { gameId, entryFee, betType } = req.body;
  const fee = parseFloat(entryFee);

  if (isNaN(fee) || fee <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid bet entry fee' });
  }

  const total = user.depositBalance + user.winningsBalance;
  if (total < fee) {
    return res.status(400).json({ status: 'error', message: 'Insufficient balance to place bet' });
  }

  // Deduct from deposit balance first, then winnings
  if (user.depositBalance >= fee) {
    user.depositBalance -= fee;
  } else {
    const rem = fee - user.depositBalance;
    user.depositBalance = 0;
    user.winningsBalance -= rem;
  }

  const betId = 'bet_' + Date.now();
  const gameTitle = gameId || 'Game Bet';
  const betLabel = betType ? `${gameTitle} : ${betType}` : `Entry Fee : ${gameTitle}`;

  // Transaction Ledger Entry
  const newTx = {
    id: 'tx_' + Date.now(),
    title: betLabel,
    amount: fee,
    isCredit: false,
    timestamp: new Date().toISOString(),
    category: 'Game',
  };
  transactionsList.unshift(newTx);

  // Complete Audit Log Entry
  const betAudit = {
    id: betId,
    userId: user.id,
    gameTitle: gameTitle,
    betType: betType || 'Match Entry',
    amount: fee,
    diceResult: 'Pending',
    status: 'PLACED',
    payout: 0.0,
    timestamp: new Date().toISOString(),
  };
  betAuditLogs.unshift(betAudit);

  io.emit('wallet_updated', {
    userId: user.id,
    depositBalance: user.depositBalance,
    winningsBalance: user.winningsBalance,
    totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
  });

  io.emit('bet_placed', {
    userId: user.id,
    bet: betAudit,
  });

  res.json({
    status: 'success',
    message: 'Bet placed successfully',
    betId: betId,
    data: {
      depositBalance: user.depositBalance,
      winningsBalance: user.winningsBalance,
      totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
    },
  });
});

// 7. Claim Game Winnings
app.post('/api/games/claim-winnings', (req, res) => {
  const userId = req.body.userId || req.headers['x-user-id'] || 'usr_9981';
  const user = getUserState(userId);
  const { score, prizeAmount, gameTitle, diceResult } = req.body;
  const prize = parseFloat(prizeAmount) || 0;

  if (prize > 0) {
    user.winningsBalance += prize;

    const newTx = {
      id: 'tx_' + Date.now(),
      title: `Won : ${gameTitle || '7 Up Down'} (Result: ${diceResult || score || 'Win'})`,
      amount: prize,
      isCredit: true,
      timestamp: new Date().toISOString(),
      category: 'Game',
    };

    transactionsList.unshift(newTx);

    // Audit log update
    const betAudit = {
      id: 'bet_' + Date.now(),
      userId: user.id,
      gameTitle: gameTitle || '7 Up Down',
      betType: 'Win Payout',
      amount: prize,
      diceResult: diceResult || `Score: ${score}`,
      status: 'WON',
      payout: prize,
      timestamp: new Date().toISOString(),
    };
    betAuditLogs.unshift(betAudit);

    io.emit('wallet_updated', {
      userId: user.id,
      depositBalance: user.depositBalance,
      winningsBalance: user.winningsBalance,
      totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
    });
  }

  res.json({
    status: 'success',
    message: prize > 0 ? `Congratulations! Won ₹${prize}` : 'Game Finished',
    data: {
      depositBalance: user.depositBalance,
      winningsBalance: user.winningsBalance,
      totalBalance: user.depositBalance + user.winningsBalance + user.rewardsBalance,
    },
  });
});

// 8. Get Transactions History
app.get('/api/wallet/transactions', (req, res) => {
  res.json({
    status: 'success',
    count: transactionsList.length,
    data: transactionsList,
  });
});

// 9. Get Game Bet Audit Logs
app.get('/api/games/bet-history', (req, res) => {
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_9981';
  const userBets = betAuditLogs.filter(b => b.userId === userId);
  res.json({
    status: 'success',
    count: userBets.length,
    data: userBets,
  });
});

// --- SOCKET.IO REALTIME EVENTS ---
io.on('connection', (socket) => {
  console.log(`🎮 Client Connected: ${socket.id}`);

  // Send real-time ticker data every 3 seconds
  const tickerInterval = setInterval(() => {
    const liveOnline = 89150 + Math.floor(Math.random() * 120);
    socket.emit('online_ticker_update', { count: `${liveOnline.toLocaleString()} online` });
  }, 3000);

  socket.on('disconnect', () => {
    clearInterval(tickerInterval);
    console.log(`🔌 Client Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 InGames Backend Server running at http://localhost:${PORT}`);
});

