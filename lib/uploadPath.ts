import path from 'path';
import fs from 'fs';

/**
 * Detects domain root if running on Hostinger / cPanel shared hosting:
 * e.g. /home/u628156753/domains/solitairehumanresources.com/hbuilds/versions/<uuid>/nodejs
 * -> /home/u628156753/domains/solitairehumanresources.com
 */
function getDomainRoot(): string | null {
  const cwd = process.cwd();
  const match = cwd.match(/^(\/home\/[^/]+\/domains\/[^/]+)/);
  if (match) return match[1];
  return null;
}

/**
 * Returns the absolute directory where uploaded files are stored.
 *
 * Priority:
 * 1. process.env.UPLOADS_DIR (if explicitly specified)
 * 2. Hostinger persistent domain directory: <domainRoot>/uploads
 * 3. Fallback: <process.cwd()>/public/uploads
 */
export function getUploadDir(): string {
  if (process.env.UPLOADS_DIR) {
    const dir = path.resolve(process.env.UPLOADS_DIR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  const domainRoot = getDomainRoot();
  if (domainRoot) {
    const persistentDir = path.join(domainRoot, 'uploads');
    try {
      if (!fs.existsSync(persistentDir)) {
        fs.mkdirSync(persistentDir, { recursive: true });
      }
      return persistentDir;
    } catch (e) {
      console.warn('[uploadPath] Could not create persistent dir at', persistentDir, e);
    }
  }

  const localDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }

  return localDir;
}

/**
 * Returns the primary file path for saving a new file.
 */
export function getUploadFilePath(filename: string): string {
  return path.join(getUploadDir(), filename);
}

/**
 * Resolves an existing uploaded file across all possible locations:
 * 1. Primary upload directory (getUploadDir())
 * 2. Current public/uploads directory (<cwd>/public/uploads)
 * 3. Domain root uploads directory (<domainRoot>/uploads)
 * 4. Across sibling version directories in Hostinger hbuilds/versions/*
 *
 * If found in an older build directory, automatically copies it to the persistent
 * uploads directory so it won't be lost on future deployments.
 */
export function resolveUploadedFilePath(filenameOrPath: string): string {
  // If absolute path that already exists, return as-is
  if (path.isAbsolute(filenameOrPath) && fs.existsSync(filenameOrPath)) {
    return filenameOrPath;
  }

  // Extract relative path or basename
  let clean = filenameOrPath.replace(/^[/\\]+/, '');
  if (clean.startsWith('uploads/')) clean = clean.slice('uploads/'.length);
  if (clean.startsWith('uploads\\')) clean = clean.slice('uploads\\'.length);

  // If filenameOrPath was a full path that does not exist, get its filename
  const filename = path.basename(clean);

  // 1. Check primary upload dir
  const primaryUploadDir = getUploadDir();
  const primaryPath = path.join(primaryUploadDir, clean);
  if (fs.existsSync(primaryPath)) return primaryPath;

  const primaryFilenamePath = path.join(primaryUploadDir, filename);
  if (fs.existsSync(primaryFilenamePath)) return primaryFilenamePath;

  const primaryVideosPath = path.join(primaryUploadDir, 'videos', filename);
  if (fs.existsSync(primaryVideosPath)) return primaryVideosPath;

  // 2. Check current public/uploads
  const currentPublic = path.join(process.cwd(), 'public', 'uploads', clean);
  if (fs.existsSync(currentPublic)) {
    try {
      if (primaryPath !== currentPublic && !fs.existsSync(primaryPath)) {
        const destDir = path.dirname(primaryPath);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(currentPublic, primaryPath);
      }
    } catch {}
    return currentPublic;
  }

  const currentPublicFilename = path.join(process.cwd(), 'public', 'uploads', filename);
  if (fs.existsSync(currentPublicFilename)) {
    return currentPublicFilename;
  }

  // 3. Check domain root uploads if detected
  const domainRoot = getDomainRoot();
  if (domainRoot) {
    const domainUploads = path.join(domainRoot, 'uploads', clean);
    if (fs.existsSync(domainUploads)) return domainUploads;

    const domainFilename = path.join(domainRoot, 'uploads', filename);
    if (fs.existsSync(domainFilename)) return domainFilename;

    const domainVideos = path.join(domainRoot, 'uploads', 'videos', filename);
    if (fs.existsSync(domainVideos)) return domainVideos;
  }

  // 4. Scan sibling build version directories on Hostinger (hbuilds/versions/*/nodejs/public/uploads)
  try {
    const cwd = process.cwd();
    let versionsDir: string | null = null;
    const hbuildsIdx = cwd.indexOf('hbuilds/versions');
    if (hbuildsIdx !== -1) {
      versionsDir = cwd.slice(0, hbuildsIdx + 'hbuilds/versions'.length);
    } else if (cwd.includes('versions')) {
      const parent = path.resolve(cwd, '../..');
      if (path.basename(parent) === 'versions') {
        versionsDir = parent;
      }
    }

    if (versionsDir && fs.existsSync(versionsDir)) {
      const versions = fs.readdirSync(versionsDir);
      for (const ver of versions) {
        const candidatePaths = [
          path.join(versionsDir, ver, 'nodejs', 'public', 'uploads', clean),
          path.join(versionsDir, ver, 'nodejs', 'public', 'uploads', filename),
          path.join(versionsDir, ver, 'public', 'uploads', clean),
          path.join(versionsDir, ver, 'public', 'uploads', filename),
          path.join(versionsDir, ver, 'uploads', clean),
          path.join(versionsDir, ver, 'uploads', filename),
        ];

        for (const candidate of candidatePaths) {
          if (fs.existsSync(candidate)) {
            // Found it in an old build version! Copy to primary upload dir
            try {
              const destDir = path.dirname(primaryPath);
              if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
              fs.copyFileSync(candidate, primaryPath);
              console.log(`[uploadPath] Recovered ${filename} from version ${ver} -> ${primaryPath}`);
              return primaryPath;
            } catch {
              return candidate;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('[uploadPath] Error scanning version directories:', err);
  }

  // 5. Fallback: check public/images (for existing video and image assets)
  const publicImages = path.join(process.cwd(), 'public', 'images', clean);
  if (fs.existsSync(publicImages)) return publicImages;
  const publicImagesFilename = path.join(process.cwd(), 'public', 'images', filename);
  if (fs.existsSync(publicImagesFilename)) return publicImagesFilename;

  // Default fallback
  return primaryPath;
}
