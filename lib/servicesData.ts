export interface ServiceDetail {
  slug: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  overview: string[];
  image: string;
  keyHighlights: string[];
  responsibilities: string[];
  qualifications?: string[];
  idealFor?: string[];
  faqs: { question: string; answer: string }[];
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    slug: 'house-manager',
    title: 'House Manager',
    subtitle: 'Estate Operations & Household Leadership',
    iconName: 'Home',
    summary: 'Seamless household management for a stress-free lifestyle, overseeing staff, vendors, finances, and daily operations.',
    overview: [
      'A Solitaire House Manager serves as the chief orchestrator of your residence, ensuring that your home operates with five-star hotel precision while maintaining warmth and privacy.',
      'From supervising domestic staff and coordinating specialist contractors to overseeing procurement, inventory, and household accounting, our house managers allow principals and their families to focus on what matters most.',
      'Every house manager presented by Solitaire possesses exceptional communication skills, emotional intelligence, and rigorous background verification tailored to private estates across Dubai and the UAE.'
    ],
    image: '/images/luxury_penthouse_dubai.jpg',
    keyHighlights: [
      'Single point of contact for all residence operations',
      'Vendor & specialist contractor supervision',
      'Household budgeting, bookkeeping, & expense reconciliation',
      'Event planning & VIP guest hospitality coordination'
    ],
    responsibilities: [
      'Oversee, schedule, and evaluate daily domestic staff (housekeepers, drivers, chefs, security)',
      'Manage preventative maintenance for HVAC, pools, home automation, and smart home systems',
      'Coordinate luxury provisioning, pantry inventories, and household procurements',
      'Maintain strict confidentiality and security protocols for the family and property',
      'Liaise with family offices, personal assistants, and corporate staff when required',
      'Organize and supervise private dinners, gatherings, and seasonal estate transitions'
    ],
    qualifications: [
      '5+ years experience managing high-net-worth private residences or luxury hospitality properties',
      'Proficiency in smart home systems (Crestron, Lutron, Control4)',
      'Strong financial literacy and household accounting capabilities',
      'Impeccable communication, discretion, and leadership etiquette',
      'Full UAE residency clearance and verified references'
    ],
    idealFor: [
      'Luxury villas in Emirates Hills, Palm Jumeirah, & Jumeirah Bay',
      'Multi-property families requiring synchronized estate management',
      'High-profile executives requiring turnkey residential management'
    ],
    faqs: [
      {
        question: 'What is the difference between a Butler and a House Manager?',
        answer: 'A House Manager focuses on overall estate administration, staff management, contractors, and logistics, whereas a Butler focuses on personal hospitality, formal table service, wardrobe care, and immediate guest protocol.'
      },
      {
        question: 'How quickly can Solitaire place a House Manager?',
        answer: 'We typically present vetted, short-listed candidates within 48 to 72 hours, with interviews and household trials arranged around your schedule.'
      },
      {
        question: 'Are all candidates background-checked?',
        answer: 'Yes. Every candidate undergoes multi-tier identity checks, criminal background audits, qualification verification, and detailed reference interviews.'
      }
    ]
  },
  {
    slug: 'executive-assistant',
    title: 'Executive Assistant',
    subtitle: 'High-Level Private & Corporate Administrative Support',
    iconName: 'Briefcase',
    summary: 'Professional support for your personal and business needs, managing complex calendars, global travel, and confidential correspondence.',
    overview: [
      'An Executive Assistant placed by Solitaire is a strategic gatekeeper and confidant, adept at managing high-stakes corporate demands and private family commitments in parallel.',
      'Our candidates bring extensive experience supporting C-suite executives, family offices, and prominent figures, delivering seamless time management, flawless itinerary planning, and impeccable document preparation.',
      'Whether based in your private office, corporate headquarters, or traveling internationally, they operate with total discretion, composure, and anticipatory problem-solving.'
    ],
    image: '/images/luxury_staff_team.jpg',
    keyHighlights: [
      'Bespoke calendar, meeting, and prioritization management',
      'Complex private aviation & global travel logistics',
      'Bilingual executive correspondence and board deck preparation',
      'Family office coordination and private task execution'
    ],
    responsibilities: [
      'Act as the primary gatekeeper and filter for high-priority incoming communications',
      'Coordinate private jet charters, commercial flight itineraries, luxury lodging, and visas',
      'Prepare confidential memos, presentations, investment summaries, and board materials',
      'Coordinate personal appointments, philanthropic commitments, and family schedules',
      'Liaise seamlessly between business teams, household staff, and external advisors',
      'Maintain supreme confidentiality under non-disclosure agreements (NDAs)'
    ],
    qualifications: [
      'Bachelors degree in Business, Communications, or related discipline',
      '5+ years experience supporting ultra-high-net-worth individuals or C-suite executives',
      'Superior written and spoken English; Arabic or French proficiency is highly valued',
      'Mastery of Microsoft 365, Google Workspace, and executive productivity tools',
      'Poise, emotional resilience, and immaculate personal presentation'
    ],
    idealFor: [
      'CEOs, Managing Directors, and Founders based in Dubai / Abu Dhabi',
      'Single-family and multi-family office principals',
      'Global entrepreneurs operating across multiple time zones'
    ],
    faqs: [
      {
        question: 'Can the Executive Assistant travel internationally with me?',
        answer: 'Yes. We specifically source and screen candidates who possess valid international visas and the flexibility for frequent global travel.'
      },
      {
        question: 'Can you provide bilingual Executive Assistants?',
        answer: 'Yes. We frequently place bilingual professionals fluent in English/Arabic, English/French, or English/Russian.'
      }
    ]
  },
  {
    slug: 'facility-manager',
    title: 'Facility Manager',
    subtitle: 'Property Infrastructure & Technical Maintenance',
    iconName: 'Building2',
    summary: 'Efficient property and facility management solutions ensuring preventative maintenance, smart systems upkeep, and infrastructure longevity.',
    overview: [
      'Luxury residential compounds, expansive penthouses, and commercial headquarters require continuous technical vigilance to prevent costly downtime and maintain peak property value.',
      'A Solitaire Facility Manager ensures that HVAC cooling plants, smart automation, water purification, swimming pools, electrical grids, and security infrastructure function without disruption.',
      'By managing vendor SLA contracts and conducting rigorous scheduled inspections, they protect your real estate investments 24/7.'
    ],
    image: '/images/luxury_villa_pool.jpg',
    keyHighlights: [
      'HVAC, chiller, and mechanical preventative maintenance',
      'Smart home automation, CCTV, and biometric security systems',
      'Vendor SLA management, procurement, and cost auditing',
      'Health, safety, and fire compliance across all facilities'
    ],
    responsibilities: [
      'Conduct regular diagnostic audits of mechanical, electrical, and plumbing (MEP) systems',
      'Direct and monitor third-party contractors for elevator, pool, landscaping, and chiller services',
      'Establish preventative maintenance calendars to minimize unexpected equipment failures',
      'Implement energy efficiency and water conservation best practices',
      'Ensure 24/7 emergency response protocols for technical and security incidents',
      'Maintain detailed logs of asset warranties, maintenance records, and operational expenditures'
    ],
    qualifications: [
      'Engineering or Facilities Management certification (BIFM, CFM, or equivalent)',
      'Deep technical knowledge of MEP systems and UAE building codes',
      'Hands-on experience with luxury villas, commercial towers, or hospitality resorts',
      'Strong contract negotiation and vendor oversight capabilities'
    ],
    idealFor: [
      'Large private estates with extensive grounds, pools, and chillers',
      'High-end residential compounds and waterfront penthouses',
      'Commercial corporate offices and family office premises'
    ],
    faqs: [
      {
        question: 'Does the Facility Manager perform repairs directly or manage contractors?',
        answer: 'Depending on the role profile you choose, they can perform minor troubleshooting directly while managing accredited specialized contractors for heavy equipment and SLA compliance.'
      }
    ]
  },
  {
    slug: 'butler',
    title: 'Butler',
    subtitle: 'Formal Service, Protocol & Discretion',
    iconName: 'ConciergeBell',
    summary: 'Discreet and professional service at your command, mastering fine dining etiquette, silver service, wardrobe curation, and bespoke guest care.',
    overview: [
      'Drawing on the finest traditions of British and European private service alongside contemporary luxury standards, a Solitaire Butler brings poise, refined etiquette, and anticipatory service to your dining and entertaining.',
      'From serving morning tea and coordinating daily wardrobe care to executing formal multi-course dinners with impeccable silver service, our butlers elevate the domestic experience.',
      'Trained in diplomatic protocol and total confidentiality, they represent the pinnacle of bespoke hospitality.'
    ],
    image: '/images/luxury_staff_team.jpg',
    keyHighlights: [
      'Formal silver, English, and French table service',
      'Fine wine cellar management and spirits pairing',
      'Haute couture wardrobe care, packing, and valet service',
      'Impeccable protocol for high-profile and royal guests'
    ],
    responsibilities: [
      'Deliver seamless daily beverage, breakfast, lunch, and formal dinner service',
      'Curate, catalog, and maintain fine wine, cigar, and crystal collections',
      'Manage fine wardrobe care, shoe care, packing, and unpacking for travels',
      'Greet visiting dignitaries, royalty, and high-profile guests with appropriate protocol',
      'Work harmoniously with private chefs to coordinate flawless meal presentations',
      'Anticipate the principals daily preferences without intrusion'
    ],
    qualifications: [
      'Graduate of a recognized International Butler Academy (British Butler Institute or equivalent)',
      'Extensive private residence or 5-star palace hospitality background',
      'Deep knowledge of formal dining service, wine pairing, and protocol',
      'Polished appearance, quiet demeanor, and complete discretion'
    ],
    idealFor: [
      'Prominent residences hosting formal dinners and VIP guests',
      'Palaces, royal households, and ultra-luxury estates',
      'Principals who appreciate classic European or contemporary luxury service'
    ],
    faqs: [
      {
        question: 'Are Solitaire butlers experienced with VIP and diplomatic protocol?',
        answer: 'Yes. Many of our candidates have served in royal residences, diplomatic embassies, and world-class luxury hotels throughout the Middle East and Europe.'
      }
    ]
  },
  {
    slug: 'personal-chef',
    title: 'Personal Chef',
    subtitle: 'Bespoke In-Home Culinary Art & Dietary Wellness',
    iconName: 'ChefHat',
    summary: 'Nutritious, customized meals crafted exclusively for your lifestyle, dietary preferences, and private family entertaining.',
    overview: [
      'A Solitaire Personal Chef transforms in-home dining into an unforgettable private restaurant experience, tailored precisely to your family’s nutritional goals, tastes, and schedules.',
      'Whether preparing wholesome organic family breakfasts, bespoke keto or vegan luncheons, or exquisite multi-course tasting menus for dinner parties, our chefs bring Michelin-caliber passion to your kitchen.',
      'They manage complete kitchen hygiene, provisioning of the freshest organic ingredients from premium local and international markets, and flawless presentation.'
    ],
    image: '/images/luxury_chef_cooking.jpg',
    keyHighlights: [
      'Personalized nutrition, allergen-free, and gourmet menu planning',
      'Daily in-residence cooking for family and private events',
      'Sourcing premium organic, wagyu, and farm-to-table ingredients',
      'Total kitchen sanitation, food safety, and pantry management'
    ],
    responsibilities: [
      'Design weekly bespoke menus aligned with family dietary requirements and preferences',
      'Procure the highest-quality cuts, seafood, organic produce, and specialty seasonings',
      'Prepare and serve breakfast, lunch, afternoon refreshments, and dinner daily',
      'Cater private dinner parties, banquets, and holiday celebrations',
      'Maintain pristine cleanliness and sanitation across all cooking and storage areas',
      'Coordinate with household staff to synchronize meal timing with family activities'
    ],
    qualifications: [
      'Culinary Arts diploma from a prestigious culinary institute (Le Cordon Bleu, etc.)',
      'Proven background in luxury private households, luxury yachts, or fine dining restaurants',
      'Advanced knowledge of specialized diets (Keto, Gluten-Free, Vegan, Halal, Kosher)',
      'HACCP / Food Safety certification'
    ],
    idealFor: [
      'Health-conscious families seeking nutritious, tailored daily meals',
      'Busy executives who desire restaurant-quality dining at home',
      'Families hosting frequent private dinners and VIP gatherings'
    ],
    faqs: [
      {
        question: 'Can the chef accommodate strict food allergies and specialized diets?',
        answer: 'Absolutely. We screen chefs specifically for your dietary framework, including gluten-free, dairy-free, diabetic-friendly, kosher-style, or athlete nutrition.'
      }
    ]
  },
  {
    slug: 'chauffeur-driver',
    title: 'Chauffeur / Driver',
    subtitle: 'Luxury Fleet Operation & Road Safety',
    iconName: 'Car',
    summary: 'Safe, punctual, and discreet professional drivers with mastery of luxury fleet handling, VIP security, and seamless Dubai navigation.',
    overview: [
      'A Solitaire Private Chauffeur provides serene, punctual, and safe transportation for principals, their families, and visiting guests across the UAE.',
      'Our chauffeurs are skilled in maneuvering luxury and exotic vehicle fleets (Rolls-Royce, Bentley, Mercedes-Maybach, Range Rover), maintaining vehicles in showroom condition at all times.',
      'Trained in defensive driving, route optimization, and VIP etiquette, they ensure every journey is effortless, comfortable, and protected.'
    ],
    image: '/images/luxury_staff_team.jpg',
    keyHighlights: [
      'Impeccable knowledge of Dubai, Abu Dhabi, and UAE roadways',
      'Luxury & exotic fleet care, detailing, and scheduled servicing',
      'Executive airport VIP transfers and school run punctuality',
      'Defensive driving techniques and security awareness'
    ],
    responsibilities: [
      'Transport principals, family members, and business associates safely and punctually',
      'Conduct daily vehicle maintenance checks (oil, tire pressure, cleanliness, fuel/charge levels)',
      'Coordinate scheduled vehicle maintenance, insurance renewals, and registration with agencies',
      'Plan optimal routes avoiding traffic congestion across Dubai and inter-emirate corridors',
      'Assist passengers with luggage, door service, and umbrella protection during inclement weather',
      'Uphold complete discretion regarding conversations overheard in the vehicle'
    ],
    qualifications: [
      'Valid UAE driving license with a 100% clean driving record',
      'Minimum 5 years driving for private VIP families or luxury hotel limousine fleets',
      'Defensive driving certification is an advantage',
      'Polished appearance, punctuality, and calm under high-traffic conditions',
      'Fluent spoken English; Arabic is a plus'
    ],
    idealFor: [
      'Families requiring reliable daily school runs and household transport',
      'Executives with high-density meeting schedules across Dubai and Abu Dhabi',
      'Principals with luxury and exotic vehicle collections'
    ],
    faqs: [
      {
        question: 'Does the chauffeur work on a fixed or flexible schedule?',
        answer: 'We place both standard daytime chauffeurs and flexible split-shift / on-call chauffeurs according to your family’s routine.'
      }
    ]
  },
  {
    slug: 'nanny',
    title: 'Nanny & Governess',
    subtitle: 'Certified Childcare & Educational Mentorship',
    iconName: 'Baby',
    summary: 'Caring, certified professionals dedicated to your child’s emotional wellbeing, physical safety, intellectual development, and daily routines.',
    overview: [
      'A Solitaire Nanny or Governess is more than a caregiver; she is a nurturing mentor committed to your children’s safety, cognitive development, and manners.',
      'From caring for newborns with gentle sleep-training techniques to helping school-age children with bilingual language skills, etiquette, and homework, our candidates bring warmth, education, and structure.',
      'All candidates undergo thorough pediatric first aid certification, extensive identity and criminal record screening, and rigorous reference evaluations.'
    ],
    image: '/images/luxury_penthouse_dubai.jpg',
    keyHighlights: [
      'Pediatric First Aid & CPR certified professionals',
      'Early childhood education, creative play, and motor skills development',
      'Nutritious meal preparation and wholesome daily routine supervision',
      'Bilingual tutors and European/British governesses available'
    ],
    responsibilities: [
      'Provide attentive, nurturing care ensuring physical safety and emotional security',
      'Establish age-appropriate developmental routines (nap times, learning activities, outdoor play)',
      'Prepare balanced, wholesome meals and snacks suitable for children',
      'Assist with school assignments, reading, language practice, and social etiquette',
      'Accompany children to school, sporting events, playdates, and doctor appointments',
      'Travel with the family internationally to maintain continuity in the child’s routine'
    ],
    qualifications: [
      'Recognized qualifications in Early Childhood Education, Nursing, or Norland/Cache certifications',
      'Minimum 4+ years caring for children in private VIP residences',
      'Current Pediatric First Aid & CPR certification',
      'Fluent spoken English; French, Spanish, or Arabic language skills available',
      'Warm, patient, energetic, and emotionally mature personality'
    ],
    idealFor: [
      'Newborns, infants, and toddlers requiring attentive developmental care',
      'School-age children needing homework support and structured learning',
      'Families who travel frequently and require consistent childcare'
    ],
    faqs: [
      {
        question: 'Can the nanny travel with our family during holidays?',
        answer: 'Yes. Most of our high-caliber nannies and governesses are accustomed to international family travel and hold valid passports and travel visas.'
      },
      {
        question: 'Do you offer live-in and live-out nanny placements?',
        answer: 'Yes. We offer both live-in and live-out placement options depending on your household preferences.'
      }
    ]
  },
  {
    slug: 'multicuisine-chef',
    title: 'Multicuisine Chef',
    subtitle: 'Global Gastronomy & High-Profile Banquet Catering',
    iconName: 'UtensilsCrossed',
    summary: 'A world of flavors tailored to your taste, mastering international culinary traditions, lavish banquets, and everyday gourmet diversity.',
    overview: [
      'For households that celebrate culinary variety, a Solitaire Multicuisine Chef brings mastery across Middle Eastern, French, Italian, Pan-Asian, Indian, and Mediterranean cuisines.',
      'Whether preparing an authentic Lebanese mezze, traditional Japanese sushi, authentic Italian pasta, or royal Indian curries, they ensure every dish delivers authentic flavor and exquisite plating.',
      'Our chefs have trained in world-class 5-star hotel kitchens and are seasoned in catering large family gatherings, diplomatic lunches, and gala dinners.'
    ],
    image: '/images/luxury_chef_cooking.jpg',
    keyHighlights: [
      'Mastery across Middle Eastern, European, Asian, and Mediterranean cuisines',
      'Lavish family gatherings, royal banquets, and formal reception catering',
      'Authentic regional spices, ingredients, and presentation techniques',
      'Kitchen inventory, butcher cuts, and fine ingredients sourcing'
    ],
    responsibilities: [
      'Deliver diverse daily menus preventing palate fatigue for the family',
      'Cook authentic multi-regional dishes with mastery over traditional cooking methods',
      'Manage complex banqueting for large guest counts without compromising quality',
      'Coordinate with local fish markets, specialty spice merchants, and organic farms',
      'Uphold world-class hygiene, HACCP standards, and clean kitchen practices',
      'Collaborate with butlers and serving staff for synchronized table service'
    ],
    qualifications: [
      '10+ years experience in multi-outlet luxury hotels or prominent private estates',
      'Proven repertoire in at least 4 international culinary traditions',
      'Experience catering large banquets and royal family events',
      'Certified Food Safety and Sanitation credentials'
    ],
    idealFor: [
      'Cosmopolitan families who love diverse global cuisines',
      'Large households hosting frequent weekend banquets and celebrations',
      'Residences that require seamless catering for diverse visiting guests'
    ],
    faqs: [
      {
        question: 'Can the multicuisine chef provide trial tastings before hiring?',
        answer: 'Yes. We encourage a paid trial tasting day so you and your family can sample dishes from multiple cuisines before finalizing the placement.'
      }
    ]
  }
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_DATA.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllServiceSlugs(): string[] {
  return SERVICES_DATA.map((s) => s.slug);
}

