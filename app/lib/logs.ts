import { query, ensureInitialized } from './db';

export async function createLog(data: {
  type: string;
  action: string;
  severity?: string;
  message?: string;
  details?: any;
  userInfo?: string;
  email?: string;
  ipAddress?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  requestId?: string;
}) {
  try {
    await ensureInitialized();
    await query(
      `INSERT INTO logs (type, action, severity, message, details, user_info, email, ip_address, endpoint, method, status_code, response_time, request_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        data.type || 'system',
        data.action || '',
        data.severity || 'info',
        data.message || '',
        data.details ? JSON.stringify(data.details) : '{}',
        data.userInfo || '',
        data.email || '',
        data.ipAddress || '',
        data.endpoint || '',
        data.method || '',
        data.statusCode || 0,
        data.responseTime || 0,
        data.requestId || '',
      ]
    );
  } catch (e) {
    console.error('Log write error:', e);
  }
}

export async function getLogs(opts: {
  type?: string;
  severity?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  await ensureInitialized();
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (opts.type) {
    conditions.push(`type = $${idx++}`);
    params.push(opts.type);
  }
  if (opts.severity) {
    conditions.push(`severity = $${idx++}`);
    params.push(opts.severity);
  }
  if (opts.search) {
    conditions.push(`(action ILIKE $${idx} OR message ILIKE $${idx} OR user_info ILIKE $${idx} OR email ILIKE $${idx} OR ip_address ILIKE $${idx})`);
    params.push(`%${opts.search}%`);
    idx++;
  }
  if (opts.dateFrom) {
    conditions.push(`created_at >= $${idx++}`);
    params.push(opts.dateFrom);
  }
  if (opts.dateTo) {
    conditions.push(`created_at <= $${idx++}`);
    params.push(opts.dateTo);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const page = opts.page || 1;
  const limit = opts.limit || 50;
  const offset = (page - 1) * limit;

  const countResult = await query(`SELECT COUNT(*) as count FROM logs ${where}`, params);
  const total = parseInt(countResult[0]?.count || '0');

  const rows = await query(
    `SELECT * FROM logs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...params, limit, offset]
  );

  return {
    entries: rows.map((r: any) => ({
      id: r.id,
      type: r.type,
      action: r.action,
      severity: r.severity,
      message: r.message,
      details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details,
      userInfo: r.user_info,
      email: r.email,
      ipAddress: r.ip_address,
      endpoint: r.endpoint,
      method: r.method,
      statusCode: r.status_code,
      responseTime: r.response_time,
      requestId: r.request_id,
      createdAt: r.created_at,
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function getLogSummary() {
  await ensureInitialized();
  const today = new Date().toISOString().slice(0, 10);

  const [totalRes, errorsTodayRes, warningsRes, failedRes, apiRes, dbErrorsRes, securityRes] = await Promise.all([
    query('SELECT COUNT(*) as count FROM logs'),
    query("SELECT COUNT(*) as count FROM logs WHERE severity IN ('error','critical') AND DATE(created_at) = $1", [today]),
    query("SELECT COUNT(*) as count FROM logs WHERE severity = 'warning' AND DATE(created_at) = $1", [today]),
    query("SELECT COUNT(*) as count FROM logs WHERE severity IN ('error','critical')"),
    query("SELECT COUNT(*) as count FROM logs WHERE type = 'api'"),
    query("SELECT COUNT(*) as count FROM logs WHERE type = 'database' AND severity IN ('error','critical')"),
    query("SELECT COUNT(*) as count FROM logs WHERE type = 'security'"),
  ]);

  return {
    total: parseInt(totalRes[0]?.count || '0'),
    errorsToday: parseInt(errorsTodayRes[0]?.count || '0'),
    warnings: parseInt(warningsRes[0]?.count || '0'),
    failedRequests: parseInt(failedRes[0]?.count || '0'),
    apiRequests: parseInt(apiRes[0]?.count || '0'),
    databaseErrors: parseInt(dbErrorsRes[0]?.count || '0'),
    securityEvents: parseInt(securityRes[0]?.count || '0'),
  };
}
