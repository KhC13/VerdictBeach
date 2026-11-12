import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/apiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory path
export const UPLOADS_DIR = path.resolve(__dirname, '../../uploads/documents');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 30);
    cb(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
  },
});

// Allowed document mime types
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  'image/jpeg',
  'image/png',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.rtf',
  '.jpg',
  '.jpeg',
  '.png',
]);

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME_TYPES.has(file.mimetype) || ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type "${ext || file.mimetype}". Supported formats: PDF, DOC, DOCX, TXT, RTF, JPG, PNG.`
      ),
      false
    );
  }
}

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5,                   // Max 5 attachments
  },
});

/**
 * Middleware handling array of attachments up to 5 files
 * Supports optional upload (doesn't fail if no files uploaded)
 */
export function uploadAttachments(req, res, next) {
  const uploadHandler = multerUpload.array('attachments', 5);

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(ApiError.badRequest('File size exceeds the 10MB limit.'));
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(ApiError.badRequest('Too many files. Maximum allowed is 5 attachments.'));
      }
      return next(ApiError.badRequest(`Upload error: ${err.message}`));
    }
    if (err) {
      return next(err);
    }
    next();
  });
}
