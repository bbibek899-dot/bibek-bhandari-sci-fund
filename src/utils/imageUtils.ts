/**
 * Utility to process, optimize and resize user-uploaded photos
 * to ensure high-definition clarity while keeping localStorage lightweight.
 */

export const resolveImageUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  let clean = trimmed;
  if (clean.startsWith('/src/assets/')) {
    clean = clean.replace('/src/assets/', '');
  }
  if (clean.startsWith('./')) {
    clean = clean.slice(2);
  }
  if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }

  // Automatic reroute from old stock images to verified real photos
  if (clean.includes('1790321508089') || clean.includes('creator_hero') || clean.includes('bibek_recovery_hero')) {
    clean = 'images/bibek_cover_photo_real.jpg';
  } else if (clean.includes('1790321487796') || clean.includes('creator_avatar') || clean.includes('bibek_bhandari_portrait')) {
    clean = 'images/bibek_profile_real.jpg';
  } else if (clean.includes('1790321524240') || clean.includes('esewa_official_qr')) {
    clean = 'images/esewa_real_official_qr.jpg';
  } else if (clean.includes('1790321539674') || clean.includes('sbi_bank_nepal_qr')) {
    clean = 'images/sbi_bank_nepal_real_qr.jpg';
  }

  // On GitHub Pages, ensure proper absolute repo path resolution even without trailing slash
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const repoSegment = pathSegments.length > 0 ? pathSegments[0] : 'bibek-bhandari-sci-fund';
    return `/${repoSegment}/${clean}`;
  }

  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${clean}`;
};

export const processImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.88
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Crisp rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};
