import jwt from 'jsonwebtoken';
import Activity from '../model/activity.js';

const getActionLabel = (method, path) => {
  const key = `${method.toUpperCase()} ${path}`;
  const actionMap = {
    'POST /api/auth/login': 'user_login',
    'POST /api/auth/signup': 'user_signup',
    'POST /api/auth/forgot-password': 'forgot_password_request',
    'POST /api/auth/reset-password': 'password_reset',
    'POST /api/orders': 'order_create',
    'PUT /api/orders/:id/status': 'order_status_update',
    'POST /api/designs': 'design_upload',
    'POST /api/admin/approve-designer': 'designer_approval_update',
    'POST /api/admin/approve-item': 'catalogue_approval_update',
    'POST /api/admin/create-admin': 'admin_create',
  };

  if (actionMap[key]) return actionMap[key];

  if (path.startsWith('/api/admin/activities')) return 'activity_feed_access';
  if (path.startsWith('/api/admin/analytics')) return 'analytics_view';
  if (path.startsWith('/api/admin/users')) return 'admin_users_view';
  if (path.startsWith('/api/orders')) return 'orders_access';
  if (path.startsWith('/api/designs')) return 'designs_access';
  if (path.startsWith('/api/catalogue')) return 'catalogue_access';
  if (path.startsWith('/api/ai')) return 'ai_measurement_access';

  return 'api_request';
};

const parseTokenUser = (req) => {
  if (req.user) {
    return {
      userId: req.user.id,
      userEmail: req.user.email,
      role: req.user.role,
    };
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return {};

  const token = authHeader.split(' ')[1];
  if (!token || !process.env.JWT_SECRET) return {};

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      userId: decoded.id,
      userEmail: decoded.email,
      role: decoded.role,
    };
  } catch {
    return {};
  }
};

export const activityLogger = (req, res, next) => {
  // Log API requests only.
  if (!req.path.startsWith('/api/')) {
    return next();
  }

  const skipPaths = ['/api/auth/verify-email'];
  if (skipPaths.some((p) => req.path.startsWith(p)) || req.method === 'OPTIONS') {
    return next();
  }

  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const tokenUser = parseTokenUser(req);

    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : (forwardedFor || req.ip || '').toString().split(',')[0].trim();

    const metadata = {
      durationMs,
      query: req.query,
    };

    if (req.body && typeof req.body === 'object') {
      const safeBody = { ...req.body };
      if (safeBody.password) safeBody.password = '[REDACTED]';
      if (safeBody.newPassword) safeBody.newPassword = '[REDACTED]';
      if (safeBody.token) safeBody.token = '[REDACTED]';
      metadata.body = safeBody;
    }

    Activity.create({
      ...tokenUser,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      action: getActionLabel(req.method, req.path),
      ip,
      userAgent: req.headers['user-agent'],
      metadata,
    }).catch((err) => {
      console.error('[ACTIVITY] Failed to log request:', err.message);
    });
  });

  next();
};

export default activityLogger;
