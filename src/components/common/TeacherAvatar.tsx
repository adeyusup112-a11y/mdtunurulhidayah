import React, { useState } from 'react';

export const CARTOON_TEACHER_IMAGES = {
  ADE_YUSUP: '/src/assets/images/cartoon_ustadz_clean_1792552709074.jpg',
  SITI_SAADAH: '/src/assets/images/cartoon_ustadzah_clean_1792552725068.jpg',
  FITRI_HERMAWATI: '/src/assets/images/cartoon_ustadzah_soft_1792552770682.jpg',
  AZMI_NURJAMIL: '/src/assets/images/cartoon_ustadz_young_1792552747499.jpg',
  DEFAULT_USTADZ: '/src/assets/images/cartoon_ustadz_clean_1792552709074.jpg',
  DEFAULT_USTADZAH: '/src/assets/images/cartoon_ustadzah_clean_1792552725068.jpg',
};

export const CARTOON_AVATAR_OPTIONS = [
  {
    label: 'Ikon Kartun Ustadz Pemimpin (Ust. Ade Yusup)',
    url: CARTOON_TEACHER_IMAGES.ADE_YUSUP,
    gender: 'male',
  },
  {
    label: 'Ikon Kartun Ustadzah Hijab Hijau (Usth. Siti Saadah)',
    url: CARTOON_TEACHER_IMAGES.SITI_SAADAH,
    gender: 'female',
  },
  {
    label: 'Ikon Kartun Ustadzah Hijab Pastel (Usth. Fitri Hermawati)',
    url: CARTOON_TEACHER_IMAGES.FITRI_HERMAWATI,
    gender: 'female',
  },
  {
    label: 'Ikon Kartun Ustadz Muda (Ust. Azmi M Nurjamil)',
    url: CARTOON_TEACHER_IMAGES.AZMI_NURJAMIL,
    gender: 'male',
  },
];

interface TeacherAvatarProps {
  name?: string;
  roleTitle?: string;
  photoUrl?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showBadge?: boolean;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  name = '',
  roleTitle = '',
  photoUrl,
  className = '',
  size = 'md',
  showBadge = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const lowerName = name.toLowerCase();
  const lowerRole = roleTitle.toLowerCase();

  // Determine specific cartoon icon based on teacher name
  let targetSrc = '';

  if (photoUrl && photoUrl.includes('cartoon_')) {
    targetSrc = photoUrl;
  } else if (lowerName.includes('ade') || lowerName.includes('kepala')) {
    targetSrc = CARTOON_TEACHER_IMAGES.ADE_YUSUP;
  } else if (lowerName.includes('siti') || lowerName.includes('saadah')) {
    targetSrc = CARTOON_TEACHER_IMAGES.SITI_SAADAH;
  } else if (lowerName.includes('fitri') || lowerName.includes('hermawati')) {
    targetSrc = CARTOON_TEACHER_IMAGES.FITRI_HERMAWATI;
  } else if (lowerName.includes('azmi') || lowerName.includes('nurjamil')) {
    targetSrc = CARTOON_TEACHER_IMAGES.AZMI_NURJAMIL;
  } else {
    const isFemale =
      lowerName.includes('usth') ||
      lowerName.includes('ustadzah') ||
      lowerRole.includes('usth') ||
      lowerRole.includes('ustadzah');
    targetSrc = isFemale
      ? CARTOON_TEACHER_IMAGES.DEFAULT_USTADZAH
      : CARTOON_TEACHER_IMAGES.DEFAULT_USTADZ;
  }

  const isFemale =
    targetSrc.includes('ustadzah') ||
    lowerName.includes('usth') ||
    lowerName.includes('siti') ||
    lowerName.includes('fitri');

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-44 h-44',
    full: 'w-full h-full',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-2xs ${
        size !== 'full' ? sizeClasses[size] : 'w-full h-full'
      } ${className}`}
    >
      {!imgError ? (
        <img
          src={targetSrc}
          alt={`Ikon Kartun ${name || 'Guru'}`}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Crisp Vector SVG Cartoon Fallback */
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-emerald-100 to-amber-50 p-2">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-800">
            {isFemale ? (
              <g>
                <circle cx="50" cy="50" r="46" fill="#d1fae5" />
                <path
                  d="M50 18 C34 18 26 32 26 52 C26 72 35 86 50 86 C65 86 74 72 74 52 C74 32 66 18 50 18 Z"
                  fill="#065f46"
                />
                <circle cx="50" cy="48" r="16" fill="#fde68a" />
                <ellipse cx="44" cy="46" rx="2" ry="2.5" fill="#1c1917" />
                <ellipse cx="56" cy="46" rx="2" ry="2.5" fill="#1c1917" />
                <path
                  d="M45 54 Q50 58 55 54"
                  stroke="#b45309"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M32 86 C32 74 40 70 50 70 C60 70 68 74 68 86 Z"
                  fill="#047857"
                />
              </g>
            ) : (
              <g>
                <circle cx="50" cy="50" r="46" fill="#d1fae5" />
                <rect x="33" y="18" width="34" height="20" rx="4" fill="#064e3b" />
                <circle cx="50" cy="50" r="17" fill="#fde68a" />
                <ellipse cx="43" cy="48" rx="2" ry="2.5" fill="#1c1917" />
                <ellipse cx="57" cy="48" rx="2" ry="2.5" fill="#1c1917" />
                <path
                  d="M44 56 Q50 61 56 56"
                  stroke="#b45309"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M28 86 C28 72 38 68 50 68 C62 68 72 72 72 86 Z"
                  fill="#047857"
                />
              </g>
            )}
          </svg>
        </div>
      )}

      {showBadge && (
        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-400 text-stone-950 font-bold text-[9px] rounded-full shadow-xs">
          Kartun
        </div>
      )}
    </div>
  );
};
