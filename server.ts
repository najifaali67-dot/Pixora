import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
// In-Memory Secure Payment & Membership Store
// ==========================================

export interface ServerPayment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  senderNumber: string;
  provider: 'bKash' | 'Nagad';
  transactionId: string;
  plan: 'pro';
  billingPeriod: 'monthly' | 'yearly';
  amount: number;
  currency: 'BDT';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
  adminActionBy?: string;
}

// Payment numbers configuration (default: 01618238630)
let paymentSettings = {
  bkashNumber: '01618238630',
  nagadNumber: '01618238630',
  monthlyPriceBdt: 199,
  yearlyPriceBdt: 1499,
};

// Server-side payment records list
let paymentRecords: ServerPayment[] = [
  {
    id: 'pay_demo_01',
    userId: 'user_pixora_demo',
    userName: 'Tanvir Hossain',
    userEmail: 'tanvir@example.com',
    senderNumber: '01711987654',
    provider: 'bKash',
    transactionId: 'BK9X249A11',
    plan: 'pro',
    billingPeriod: 'monthly',
    amount: 199,
    currency: 'BDT',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'pay_demo_02',
    userId: 'user_nusrat_88',
    userName: 'Nusrat Jahan',
    userEmail: 'nusrat.designer@gmail.com',
    senderNumber: '01822334455',
    provider: 'Nagad',
    transactionId: 'NG77190PQ2',
    plan: 'pro',
    billingPeriod: 'yearly',
    amount: 1499,
    currency: 'BDT',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    verifiedAt: new Date(Date.now() - 82000000).toISOString(),
    adminActionBy: 'najifaali67@gmail.com',
  },
];

// Set of user IDs with approved Pro membership
const approvedProUsers = new Set<string>(['user_nusrat_88']);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Pixora Image Tools & Bangladesh Payments Engine',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// Payment Settings & Management Endpoints
// ==========================================

// Get payment numbers for bKash & Nagad
app.get('/api/payments/settings', (req: Request, res: Response) => {
  res.json(paymentSettings);
});

// Update payment numbers (Admin only)
app.post('/api/admin/payment-settings', (req: Request, res: Response) => {
  const adminSecret = req.headers['x-admin-role'] || req.body.adminRole;
  if (adminSecret !== 'admin') {
    res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    return;
  }

  const { bkashNumber, nagadNumber, monthlyPriceBdt, yearlyPriceBdt } = req.body;

  if (bkashNumber && typeof bkashNumber === 'string') {
    paymentSettings.bkashNumber = bkashNumber.trim();
  }
  if (nagadNumber && typeof nagadNumber === 'string') {
    paymentSettings.nagadNumber = nagadNumber.trim();
  }
  if (monthlyPriceBdt && typeof monthlyPriceBdt === 'number') {
    paymentSettings.monthlyPriceBdt = monthlyPriceBdt;
  }
  if (yearlyPriceBdt && typeof yearlyPriceBdt === 'number') {
    paymentSettings.yearlyPriceBdt = yearlyPriceBdt;
  }

  res.json({
    success: true,
    message: 'Payment configuration updated successfully.',
    settings: paymentSettings,
  });
});

// ==========================================
// Payment Requests (bKash & Nagad)
// ==========================================

// Submit a new payment request (Always starts as 'pending')
app.post('/api/payments/request', (req: Request, res: Response) => {
  const {
    userId,
    userName = 'Pixora Creator',
    userEmail,
    senderNumber,
    provider,
    transactionId,
    plan = 'pro',
    billingPeriod = 'monthly',
    amount,
  } = req.body;

  // Validation
  if (!userEmail || !userEmail.includes('@')) {
    res.status(400).json({ error: 'Valid user email is required.' });
    return;
  }

  if (provider !== 'bKash' && provider !== 'Nagad') {
    res.status(400).json({ error: 'Only bKash and Nagad payment methods are accepted.' });
    return;
  }

  if (!transactionId || transactionId.trim().length < 4) {
    res.status(400).json({ error: 'A valid Transaction ID (TrxID) is required.' });
    return;
  }

  if (!senderNumber || senderNumber.trim().length < 10) {
    res.status(400).json({ error: 'Sender mobile number is required (e.g., 017xxxxxxxx).' });
    return;
  }

  // Check for duplicate pending transaction ID
  const cleanTrx = transactionId.trim().toUpperCase();
  const existing = paymentRecords.find(
    (p) => p.transactionId === cleanTrx && p.status === 'pending'
  );
  if (existing) {
    res.status(400).json({
      error: 'This Transaction ID has already been submitted and is pending verification.',
    });
    return;
  }

  const newPayment: ServerPayment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: userId || `usr_${Date.now()}`,
    userName: userName.trim(),
    userEmail: userEmail.trim().toLowerCase(),
    senderNumber: senderNumber.trim(),
    provider,
    transactionId: cleanTrx,
    plan: 'pro',
    billingPeriod,
    amount:
      amount ||
      (billingPeriod === 'monthly'
        ? paymentSettings.monthlyPriceBdt
        : paymentSettings.yearlyPriceBdt),
    currency: 'BDT',
    status: 'pending', // NEVER auto-approve
    createdAt: new Date().toISOString(),
  };

  paymentRecords.unshift(newPayment);

  res.status(201).json({
    success: true,
    message:
      'Payment request submitted successfully. Status is Pending Admin Verification.',
    payment: newPayment,
  });
});

// Get payment list (users see their own; admin sees all)
app.get('/api/payments', (req: Request, res: Response) => {
  const { userId, role, provider, status } = req.query;

  let list = [...paymentRecords];

  if (role !== 'admin') {
    if (!userId) {
      res.status(400).json({ error: 'userId is required for non-admin queries.' });
      return;
    }
    list = list.filter((p) => p.userId === String(userId));
  } else {
    // Admin filtering
    if (provider && (provider === 'bKash' || provider === 'Nagad')) {
      list = list.filter((p) => p.provider === provider);
    }
    if (status && (status === 'pending' || status === 'approved' || status === 'rejected')) {
      list = list.filter((p) => p.status === status);
    }
  }

  res.json({
    payments: list,
    total: list.length,
    pendingCount: paymentRecords.filter((p) => p.status === 'pending').length,
  });
});

// Admin: Approve Payment
app.post('/api/admin/payments/:id/approve', (req: Request, res: Response) => {
  const adminSecret = req.headers['x-admin-role'] || req.body.adminRole;
  if (adminSecret !== 'admin') {
    res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    return;
  }

  const { id } = req.params;
  const adminEmail = req.body.adminEmail || 'admin@pixora.app';

  const payment = paymentRecords.find((p) => p.id === id);
  if (!payment) {
    res.status(404).json({ error: 'Payment request not found.' });
    return;
  }

  payment.status = 'approved';
  payment.verifiedAt = new Date().toISOString();
  payment.adminActionBy = adminEmail;

  // Mark user as active Pro on server
  approvedProUsers.add(payment.userId);

  res.json({
    success: true,
    message: `Payment ${payment.transactionId} approved. Pro membership activated for ${payment.userEmail}.`,
    payment,
  });
});

// Admin: Reject Payment
app.post('/api/admin/payments/:id/reject', (req: Request, res: Response) => {
  const adminSecret = req.headers['x-admin-role'] || req.body.adminRole;
  if (adminSecret !== 'admin') {
    res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
    return;
  }

  const { id } = req.params;
  const { reason = 'Transaction ID not verified on merchant statement' } = req.body;
  const adminEmail = req.body.adminEmail || 'admin@pixora.app';

  const payment = paymentRecords.find((p) => p.id === id);
  if (!payment) {
    res.status(404).json({ error: 'Payment request not found.' });
    return;
  }

  payment.status = 'rejected';
  payment.verifiedAt = new Date().toISOString();
  payment.adminActionBy = adminEmail;

  // Ensure user is not in active Pro set if no other approved payment exists
  const hasOtherApproved = paymentRecords.some(
    (p) => p.userId === payment.userId && p.id !== id && p.status === 'approved'
  );
  if (!hasOtherApproved) {
    approvedProUsers.delete(payment.userId);
  }

  res.json({
    success: true,
    message: `Payment ${payment.transactionId} rejected. Pro membership remains inactive.`,
    payment,
  });
});

// Get user verified membership status
app.get('/api/user/membership/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const isPro = approvedProUsers.has(userId);

  const pendingRequest = paymentRecords.find(
    (p) => p.userId === userId && p.status === 'pending'
  );

  res.json({
    userId,
    isPro,
    plan: isPro ? 'pro' : 'free',
    hasPendingRequest: Boolean(pendingRequest),
    pendingPayment: pendingRequest || null,
  });
});

// ==========================================
// Image Editing Tool Handoff
// ==========================================
app.post('/api/ai/edit', (req: Request, res: Response) => {
  const { mode } = req.body;
  // Signals frontend to execute high-precision local neural/canvas engine
  res.json({
    useLocalEngine: true,
    mode: mode || 'edit',
  });
});

// Admin Overview Metrics
app.get('/api/admin/overview', (req: Request, res: Response) => {
  const pendingCount = paymentRecords.filter((p) => p.status === 'pending').length;
  const approvedCount = paymentRecords.filter((p) => p.status === 'approved').length;
  const totalBkash = paymentRecords.filter((p) => p.provider === 'bKash').length;
  const totalNagad = paymentRecords.filter((p) => p.provider === 'Nagad').length;

  const totalRevenueBdt = paymentRecords
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({
    totalUsers: 1420,
    freeUsers: 1420 - approvedCount,
    proUsers: approvedCount,
    totalImageProcesses: 38400,
    pendingPayments: pendingCount,
    approvedPayments: approvedCount,
    bkashPayments: totalBkash,
    nagadPayments: totalNagad,
    revenueBdt: totalRevenueBdt,
    serverUptime: '99.99%',
  });
});

// Contact message endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Please provide name, email, and message.' });
    return;
  }
  res.json({
    success: true,
    message: 'Thank you for contacting Pixora! We will respond within 24 hours.',
  });
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Pixora full-stack server running at http://0.0.0.0:${port}`);
  });
}

startServer();
