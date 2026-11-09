import { PhotographerSiteData } from '../types/photographer';

export const INITIAL_PHOTOGRAPHER_DATA: PhotographerSiteData = {
  profile: {
    name: 'Алексей Миронов',
    tagline: 'Visual Storyteller & Editorial Photographer',
    headline: 'Черно-белая эстетика, свет и неподдельная глубина каждого кадра',
    shortBio: 'Более 8 лет создаю кинематографичные портреты, честные свадебные репортажи и авторские арт-серии. Работаю в строгом минималистичном стиле без фальши и шаблонного позирования.',
    fullBio: [
      'Привет! Меня зовут Алексей. Для меня фотография — это визуальная драматургия, чистая геометрия и честные эмоции. Я работаю преимущественно с естественным и контрастным светом, убирая все лишнее, чтобы в фокусе оставался только человек и его характер.',
      'Начинал с пленочной уличной и документальной фотографии в европейских столицах. Этот опыт привил мне привычку предвидеть решающий момент до нажатия кнопки и видеть кадр в черно-белой светотени.',
      'Сегодня я снимаю камерные и масштабные свадебные истории, создаю портреты для артистов и предпринимателей, а также работаю с независимыми брендами одежды и дизайна.'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    heroBannerUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=85',
    experienceYears: 8,
    completedShoots: 450,
    countriesVisited: 14,
    awardsCount: 9,
    philosophy: '«Фотография обретает силу тогда, когда в кадре нет ничего случайного. Только свет, форма и внутренняя тишина человека».'
  },
  contacts: {
    telegramUsername: 'alexey_mironov_photo',
    whatsappPhone: '+79161234567',
    phone: '+7 (916) 123-45-67',
    email: 'mironov.photo@gmail.com',
    instagram: '@mironov_visuals',
    vk: 'vk.com/mironov_visuals',
    city: 'Москва & Санкт-Петербург (выезд по миру)',
    defaultMessage: 'Здравствуйте, Алексей! Хотел бы обсудить фотосъемку.'
  },
  packages: [
    {
      id: 'pkg-portrait',
      title: 'Индивидуальный портрет',
      price: '15 000 ₽',
      priceNum: 15000,
      duration: '1.5 – 2 часа',
      photosCount: '35–45 фото в авторской ретуши',
      turnaroundTime: 'до 7 дней',
      features: [
        'Помощь с подбором студии или уличной локации',
        'Консультация по стилю и лаконичному образу',
        'Все исходные кадры в базовом цвете/чб (150+)',
        'Закрытая персональная онлайн-галерея на 1 год',
        'Печать 5 избранных кадров на хлопковой бумаге'
      ],
      popular: false
    },
    {
      id: 'pkg-lovestory',
      title: 'Love Story & Камерная свадьба',
      price: '28 000 ₽',
      priceNum: 28000,
      duration: '3 – 4 часа',
      photosCount: '90–120 фото в авторском цвете',
      turnaroundTime: 'до 14 дней',
      features: [
        'Предварительная встреча для согласования тайминга',
        'Кинематографичный репортаж + непринужденная прогулка',
        'Все удачные кадры с цветокоррекцией (300+)',
        'Превью из первых 10 кадров на следующий день',
        'Подборка вертикальных кадров для соцсетей'
      ],
      popular: true
    },
    {
      id: 'pkg-wedding-day',
      title: 'Полный свадебный день',
      price: '65 000 ₽',
      priceNum: 65000,
      duration: 'до 10 часов',
      photosCount: '400–600 фото в полной обработке',
      turnaroundTime: 'до 30 дней',
      features: [
        'Съемка от утренних сборов до финала вечера',
        'Съемка с двух камер для непрерывного захвата моментов',
        'Собственный мобильный студийный свет для сложных залов',
        'Превью-серия (30 кадров) в течение 48 часов',
        'Премиальная фотокнига в тканевом переплете (25×25 см)',
        'Флеш-накопитель в деревянном крафтовом боксе'
      ],
      popular: false
    },
    {
      id: 'pkg-brand',
      title: 'Fashion & Контент для бренда',
      price: '35 000 ₽',
      priceNum: 35000,
      duration: 'до 4 часов',
      photosCount: '60–80 готовых кадров для лукбука',
      turnaroundTime: 'до 10 дней',
      features: [
        'Детальный пре-продакшн и раскадровка',
        'Подбор локаций и световых схем под концепцию',
        'Коммерческие права на использование материалов',
        'Строгое соблюдение гайдлайнов бренда'
      ],
      popular: false
    }
  ],
  photos: [
    {
      id: 'p-1',
      title: 'Сияние в сумерках',
      category: 'portrait',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      description: 'Студийный портрет со строгим моделирующим светом.',
      featured: true,
      aspectRatio: 'portrait',
      order: 1,
      exif: {
        camera: 'Sony Alpha 7R V',
        lens: '85mm f/1.4 GM II',
        focalLength: '85mm',
        aperture: 'f/1.6',
        shutterSpeed: '1/250s',
        iso: '100',
        location: 'Студия «Октябрь», Москва',
        year: '2026'
      }
    },
    {
      id: 'p-2',
      title: 'Шепот волн и ветра',
      category: 'wedding',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      description: 'Камерная свадебная церемония на закатном побережье.',
      featured: true,
      aspectRatio: 'landscape',
      order: 2,
      exif: {
        camera: 'Leica Q3',
        lens: 'Summilux 28mm f/1.7',
        focalLength: '28mm',
        aperture: 'f/2.0',
        shutterSpeed: '1/800s',
        iso: '160',
        location: 'Куршская коса, Балтика',
        year: '2025'
      }
    },
    {
      id: 'p-3',
      title: 'Монохромная геометрия',
      category: 'fashion',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      description: 'Фэшн-съемка для капсульной коллекции одежды с драматичной светотенью.',
      featured: true,
      aspectRatio: 'portrait',
      order: 3,
      exif: {
        camera: 'Sony Alpha 7R V',
        lens: '50mm f/1.2 GM',
        focalLength: '50mm',
        aperture: 'f/2.8',
        shutterSpeed: '1/160s',
        iso: '200',
        location: 'Санкт-Петербург, Музей Штиглица',
        year: '2026'
      }
    },
    {
      id: 'p-4',
      title: 'Огни ночного мегаполиса',
      category: 'street',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85',
      description: 'Кинематографичный уличный кадр под дождем.',
      featured: false,
      aspectRatio: 'landscape',
      order: 4,
      exif: {
        camera: 'Contax T2',
        lens: 'Carl Zeiss Sonnar 38mm f/2.8',
        focalLength: '38mm',
        aperture: 'f/2.8',
        shutterSpeed: '1/60s',
        iso: '800 (Kodak Tri-X 400)',
        location: 'Токио, Сибуя',
        year: '2025'
      }
    },
    {
      id: 'p-5',
      title: 'Нежность прикосновения',
      category: 'wedding',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      description: 'Искренние эмоции и объятия во время свадебных клятв.',
      featured: true,
      aspectRatio: 'portrait',
      order: 5,
      exif: {
        camera: 'Sony Alpha 7R V',
        lens: '85mm f/1.4 GM II',
        focalLength: '85mm',
        aperture: 'f/1.4',
        shutterSpeed: '1/1000s',
        iso: '100',
        location: 'Старинная усадьба, Подмосковье',
        year: '2025'
      }
    },
    {
      id: 'p-6',
      title: 'Северная панорама',
      category: 'landscape',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85',
      description: 'Рассветное умиротворение и горная дымка ранней осенью.',
      featured: false,
      aspectRatio: 'landscape',
      order: 6,
      exif: {
        camera: 'Sony Alpha 7R V',
        lens: '24-70mm f/2.8 GM II',
        focalLength: '35mm',
        aperture: 'f/8.0',
        shutterSpeed: '1/4s',
        iso: '50',
        location: 'Горный Алтай, долина реки Чуя',
        year: '2025'
      }
    },
    {
      id: 'p-7',
      title: 'Мужской характерный портрет',
      category: 'portrait',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
      description: 'Глубокий мужской портрет с акцентом на взгляд и фактуру.',
      featured: false,
      aspectRatio: 'portrait',
      order: 7,
      exif: {
        camera: 'Sony Alpha 7R V',
        lens: '50mm f/1.2 GM',
        focalLength: '50mm',
        aperture: 'f/1.8',
        shutterSpeed: '1/320s',
        iso: '200',
        location: 'Лофт на Красном Октябре',
        year: '2026'
      }
    },
    {
      id: 'p-8',
      title: 'Шелковый силуэт',
      category: 'fashion',
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
      description: 'Графичный профиль и мягкий рассеянный свет.',
      featured: true,
      aspectRatio: 'portrait',
      order: 8,
      exif: {
        camera: 'Sony Alpha 7R V',
        lens: '85mm f/1.4 GM II',
        focalLength: '85mm',
        aperture: 'f/2.2',
        shutterSpeed: '1/200s',
        iso: '100',
        location: 'Париж, мастерская скульптора',
        year: '2025'
      }
    }
  ],
  testimonials: [
    {
      id: 't-1',
      authorName: 'Дарья и Максим',
      shootType: 'Свадебный день в Подмосковье',
      text: 'Работать с Алексеем было невероятно легко. Никакого навязчивого позирования или стресса — только живое общение и естественность. Когда мы открыли галерею, мы просто потеряли дар речи: черно-белые кадры получились как из европейского кинематографа. Спасибо за память на всю жизнь!',
      rating: 5,
      date: 'Октябрь 2026',
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 't-2',
      authorName: 'Елена Воронцова',
      shootType: 'Индивидуальный портрет для бренда',
      text: 'Я обычно очень скованно чувствую себя перед камерой, но с Алексеем мы просто пили кофе, слушали джаз и разговаривали. Кадры превзошли любые ожидания — в них чувствуется характер и глубина. Уже распечатала три фотографии в рамки.',
      rating: 5,
      date: 'Сентябрь 2026',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 't-3',
      authorName: 'Артем и Анна',
      shootType: 'Love Story в Санкт-Петербурге',
      text: 'Съемка на рассвете на крышах и каналах Питера была одним из самых ярких приключений года! Алексей тонко чувствует свет и геометрию города. Фотографии отдал раньше оговоренного срока. Однозначно рекомендуем!',
      rating: 5,
      date: 'Август 2026',
      photos: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'
      ]
    }
  ],
  bookings: [
    {
      id: 'b-demo-1',
      name: 'Екатерина Соколова',
      phoneOrMessenger: '+7 (926) 888-22-11',
      contactType: 'telegram',
      packageId: 'pkg-lovestory',
      date: '2026-11-20',
      message: 'Хотим прогулочную съемку в центре на закате!',
      createdAt: '2026-11-05',
      status: 'new'
    }
  ],
  adminPin: 'photo2025'
};
