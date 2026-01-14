export interface Platform {
    id: string;
    slug: string;
    name: string;
    name_th: string;
    icon: string;
    tagline: string;
    tagline_th: string;
    description: string;
    description_th: string;
    heroImage: string;
    color: string;
    gradient: string;

    features: {
        title: string;
        title_th: string;
        description: string;
        description_th: string;
        icon: string;
    }[];

    benefits: {
        title: string;
        title_th: string;
        items: string[];
        items_th: string[];
    };

    useCases: {
        title: string;
        title_th: string;
        description: string;
        description_th: string;
    }[];

    pricing: {
        title: string;
        title_th: string;
        subtitle: string;
        subtitle_th: string;
        plans: {
            name: string;
            price: string;
            period: string;
            description: string;
            features: string[];
            recommended?: boolean;
            buttonText: string;
        }[];
    };
}

export const platforms: Platform[] = [
    {
        id: 'inno-one',
        slug: 'inno-one',
        name: 'INNO ONE',
        name_th: 'อินโน วัน',
        icon: 'LayoutDashboard',
        tagline: 'All-in-One Business Management Platform',
        tagline_th: 'แพลตฟอร์มบริหารจัดการธุรกิจแบบครบวงจร',
        description: 'Comprehensive business management solution designed for modern enterprises. Streamline operations, boost productivity, and drive growth with our integrated platform.',
        description_th: 'โซลูชันบริหารจัดการธุรกิจที่ครอบคลุม ออกแบบมาสำหรับองค์กรสมัยใหม่ เพิ่มประสิทธิภาพการดำเนินงาน เพิ่มผลผลิต และขับเคลื่อนการเติบโตด้วยแพลตฟอร์มแบบบูรณาการ',
        heroImage: '/platforms/inno-one-hero.jpg',
        color: '#3B82F6',
        gradient: 'from-blue-600 via-blue-500 to-cyan-500',
        features: [
            {
                title: 'Project Management',
                title_th: 'การจัดการโครงการ',
                description: 'Plan, track, and deliver projects on time with powerful project management tools',
                description_th: 'วางแผน ติดตาม และส่งมอบโครงการตรงเวลาด้วยเครื่องมือจัดการโครงการที่ทรงพลัง',
                icon: 'Kanban'
            },
            {
                title: 'Team Collaboration',
                title_th: 'การทำงานร่วมกันของทีม',
                description: 'Enhance team productivity with real-time collaboration and communication',
                description_th: 'เพิ่มประสิทธิภาพทีมด้วยการทำงานร่วมกันและการสื่อสารแบบเรียลไทม์',
                icon: 'Users'
            },
            {
                title: 'Analytics & Reporting',
                title_th: 'การวิเคราะห์และรายงาน',
                description: 'Make data-driven decisions with comprehensive analytics and insights',
                description_th: 'ตัดสินใจโดยอิงข้อมูลด้วยการวิเคราะห์และข้อมูลเชิงลึกที่ครอบคลุม',
                icon: 'BarChart3'
            },
            {
                title: 'Automation',
                title_th: 'ระบบอัตโนมัติ',
                description: 'Automate repetitive tasks and workflows to save time and reduce errors',
                description_th: 'ทำงานซ้ำๆ และเวิร์กโฟลว์อัตโนมัติเพื่อประหยัดเวลาและลดข้อผิดพลาด',
                icon: 'Zap'
            }
        ],
        benefits: {
            title: 'Why Choose INNO ONE',
            title_th: 'ทำไมต้องเลือก INNO ONE',
            items: [
                'Increase productivity by up to 40%',
                'Reduce operational costs by 30%',
                'Improve team collaboration and communication',
                'Real-time insights and analytics',
                '24/7 customer support',
                'Scalable for businesses of all sizes'
            ],
            items_th: [
                'เพิ่มผลผลิตได้ถึง 40%',
                'ลดต้นทุนการดำเนินงาน 30%',
                'ปรับปรุงการทำงานร่วมกันและการสื่อสารของทีม',
                'ข้อมูลเชิงลึกและการวิเคราะห์แบบเรียลไทม์',
                'การสนับสนุนลูกค้าตลอด 24/7',
                'ขยายได้สำหรับธุรกิจทุกขนาด'
            ]
        },
        useCases: [
            {
                title: 'Enterprise Management',
                title_th: 'การจัดการองค์กร',
                description: 'Perfect for large enterprises managing multiple departments and projects',
                description_th: 'เหมาะสำหรับองค์กรขนาดใหญ่ที่จัดการหลายแผนกและโครงการ'
            },
            {
                title: 'Startup Growth',
                title_th: 'การเติบโตของสตาร์ทอัพ',
                description: 'Scale your startup efficiently with integrated business tools',
                description_th: 'ขยายสตาร์ทอัพของคุณอย่างมีประสิทธิภาพด้วยเครื่องมือธุรกิจแบบบูรณาการ'
            }
        ],
        pricing: {
            title: 'Simple, Transparent Pricing',
            title_th: 'ราคาที่เรียบง่ายและโปร่งใส',
            subtitle: 'Choose the plan that fits your business needs',
            subtitle_th: 'เลือกแผนที่เหมาะกับความต้องการทางธุรกิจของคุณ',
            plans: [
                {
                    name: 'Starter',
                    price: '฿1,990',
                    period: '/month',
                    description: 'Essential tools for small teams',
                    features: ['Up to 5 Users', 'Basic Project Management', '2GB Storage', 'Email Support'],
                    buttonText: 'Start Free Trial'
                },
                {
                    name: 'Professional',
                    price: '฿4,990',
                    period: '/month',
                    description: 'Advanced features for growing businesses',
                    features: ['Up to 20 Users', 'Advanced Analytics', 'Unlimited Storage', 'Priority Support', 'Automation Tools'],
                    recommended: true,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Enterprise',
                    price: 'Contact Us',
                    period: '',
                    description: 'Custom solutions for large organizations',
                    features: ['Unlimited Users', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Support', 'On-premise Option'],
                    buttonText: 'Contact Sales'
                }
            ]
        }
    },
    {
        id: 'lawfirm',
        slug: 'lawfirm',
        name: 'LAWFIRM',
        name_th: 'ลอว์เฟิร์ม',
        icon: 'Scale',
        tagline: 'Complete Legal Practice Management',
        tagline_th: 'ระบบบริหารจัดการสำนักงานกฎหมายแบบครบวงจร',
        description: 'Streamline your legal practice with case management, client portal, document automation, and billing - all in one platform.',
        description_th: 'ปรับปรุงการปฏิบัติงานทางกฎหมายของคุณด้วยการจัดการคดี พอร์ทัลลูกค้า ระบบเอกสารอัตโนมัติ และการเรียกเก็บเงิน - ทั้งหมดในแพลตฟอร์มเดียว',
        heroImage: '/platforms/lawfirm-hero.jpg',
        color: '#8B5CF6',
        gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
        features: [
            {
                title: 'Case Management',
                title_th: 'การจัดการคดี',
                description: 'Organize and track all your cases in one centralized system',
                description_th: 'จัดระเบียบและติดตามคดีทั้งหมดของคุณในระบบรวมศูนย์',
                icon: 'Briefcase'
            },
            {
                title: 'Client Portal',
                title_th: 'พอร์ทัลลูกค้า',
                description: 'Secure client communication and document sharing',
                description_th: 'การสื่อสารกับลูกค้าและการแชร์เอกสารอย่างปลอดภัย',
                icon: 'Shield'
            },
            {
                title: 'Document Automation',
                title_th: 'ระบบเอกสารอัตโนมัติ',
                description: 'Generate legal documents quickly with templates',
                description_th: 'สร้างเอกสารทางกฎหมายอย่างรวดเร็วด้วยเทมเพลต',
                icon: 'FileText'
            },
            {
                title: 'Time & Billing',
                title_th: 'การจับเวลาและเรียกเก็บเงิน',
                description: 'Track billable hours and generate invoices automatically',
                description_th: 'ติดตามชั่วโมงที่เรียกเก็บได้และสร้างใบแจ้งหนี้อัตโนมัติ',
                icon: 'Clock'
            }
        ],
        benefits: {
            title: 'Why Choose LAWFIRM',
            title_th: 'ทำไมต้องเลือก LAWFIRM',
            items: [
                'Reduce administrative time by 50%',
                'Improve client satisfaction',
                'Secure and compliant document storage',
                'Automated billing and invoicing',
                'Mobile access for lawyers on the go',
                'Integration with legal research tools'
            ],
            items_th: [
                'ลดเวลาการบริหารงาน 50%',
                'เพิ่มความพึงพอใจของลูกค้า',
                'การจัดเก็บเอกสารที่ปลอดภัยและสอดคล้องกับกฎหมาย',
                'การเรียกเก็บเงินและออกใบแจ้งหนี้อัตโนมัติ',
                'เข้าถึงผ่านมือถือสำหรับทนายความที่เดินทาง',
                'บูรณาการกับเครื่องมือค้นคว้ากฎหมาย'
            ]
        },
        useCases: [
            {
                title: 'Law Firms',
                title_th: 'สำนักงานกฎหมาย',
                description: 'Manage multiple cases and clients efficiently',
                description_th: 'จัดการหลายคดีและลูกค้าอย่างมีประสิทธิภาพ'
            },
            {
                title: 'Solo Practitioners',
                title_th: 'ทนายความเดี่ยว',
                description: 'All-in-one solution for independent lawyers',
                description_th: 'โซลูชันแบบครบวงจรสำหรับทนายความอิสระ'
            }
        ],
        pricing: {
            title: 'Legal Practice Plans',
            title_th: 'แผนสำหรับสำนักงานกฎหมาย',
            subtitle: 'Secure and compliant solutions for your practice',
            subtitle_th: 'โซลูชันที่ปลอดภัยและสอดคล้องกับกฎหมายสำหรับการปฏิบัติงานของคุณ',
            plans: [
                {
                    name: 'Solo',
                    price: '฿2,500',
                    period: '/month',
                    description: 'For independent practitioners',
                    features: ['1 Lawyer', 'Unlimited Cases', 'Document Management', 'Basic Billing'],
                    buttonText: 'Start Trial'
                },
                {
                    name: 'Firm',
                    price: '฿6,500',
                    period: '/month',
                    description: 'For small to medium law firms',
                    features: ['Up to 5 Lawyers', 'Client Portal', 'Document Automation', 'Advanced Billing & Trust Accounting', 'Court Calendar Sync'],
                    recommended: true,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Enterprise',
                    price: 'Contact Us',
                    period: '',
                    description: 'For large firms and corporate legal depts',
                    features: ['Unlimited Lawyers', 'API Access', 'Custom Workflows', 'Dedicated Support', 'On-premise Deployment'],
                    buttonText: 'Contact Sales'
                }
            ]
        }
    },
    {
        id: 'physical-therapy',
        slug: 'physical-therapy',
        name: 'PHYSICAL THERAPY',
        name_th: 'กายภาพบำบัด',
        icon: 'Activity',
        tagline: 'Modern Physical Therapy Management',
        tagline_th: 'ระบบบริหารจัดการคลินิกกายภาพบำบัดสมัยใหม่',
        description: 'Comprehensive clinic management system for physical therapists. Manage appointments, patient records, treatment plans, and billing seamlessly.',
        description_th: 'ระบบบริหารจัดการคลินิกที่ครอบคลุมสำหรับนักกายภาพบำบัด จัดการนัดหมาย บันทึกผู้ป่วย แผนการรักษา และการเรียกเก็บเงินอย่างราบรื่น',
        heroImage: '/platforms/physical-therapy-hero.jpg',
        color: '#EF4444',
        gradient: 'from-rose-600 via-red-500 to-orange-500',
        features: [
            {
                title: 'Appointment Scheduling',
                title_th: 'การจัดตารางนัดหมาย',
                description: 'Easy online booking and calendar management',
                description_th: 'การจองออนไลน์และการจัดการปฏิทินที่ง่ายดาย',
                icon: 'Calendar'
            },
            {
                title: 'Patient Records',
                title_th: 'บันทึกผู้ป่วย',
                description: 'Digital health records with treatment history',
                description_th: 'บันทึกสุขภาพดิจิทัลพร้อมประวัติการรักษา',
                icon: 'FileHeart'
            },
            {
                title: 'Treatment Plans',
                title_th: 'แผนการรักษา',
                description: 'Create and track personalized treatment programs',
                description_th: 'สร้างและติดตามโปรแกรมการรักษาส่วนบุคคล',
                icon: 'Stethoscope'
            },
            {
                title: 'Exercise Library',
                title_th: 'คลังแบบฝึกหัด',
                description: 'Video library of exercises for patient education',
                description_th: 'คลังวิดีโอแบบฝึกหัดสำหรับให้ความรู้ผู้ป่วย',
                icon: 'PlayCircle'
            }
        ],
        benefits: {
            title: 'Why Choose PHYSICAL THERAPY',
            title_th: 'ทำไมต้องเลือก PHYSICAL THERAPY',
            items: [
                'Reduce no-shows by 60% with automated reminders',
                'Improve patient outcomes with structured programs',
                'Save 3+ hours daily on administrative tasks',
                'Increase revenue with better scheduling',
                'HIPAA compliant and secure',
                'Mobile app for patients'
            ],
            items_th: [
                'ลดการไม่มาตามนัด 60% ด้วยการแจ้งเตือนอัตโนมัติ',
                'ปรับปรุงผลลัพธ์ผู้ป่วยด้วยโปรแกรมที่มีโครงสร้าง',
                'ประหยัดเวลา 3+ ชั่วโมงต่อวันในงานบริหาร',
                'เพิ่มรายได้ด้วยการจัดตารางที่ดีขึ้น',
                'สอดคล้องกับ HIPAA และปลอดภัย',
                'แอปมือถือสำหรับผู้ป่วย'
            ]
        },
        useCases: [
            {
                title: 'Private Clinics',
                title_th: 'คลินิกเอกชน',
                description: 'Perfect for independent physical therapy practices',
                description_th: 'เหมาะสำหรับคลินิกกายภาพบำบัดอิสระ'
            },
            {
                title: 'Multi-Location Centers',
                title_th: 'ศูนย์หลายสาขา',
                description: 'Manage multiple locations from one platform',
                description_th: 'จัดการหลายสาขาจากแพลตฟอร์มเดียว'
            }
        ],
        pricing: {
            title: 'Clinic Management Plans',
            title_th: 'แผนจัดการคลินิก',
            subtitle: 'Streamline your clinic operations',
            subtitle_th: 'ปรับปรุงการดำเนินงานคลินิกของคุณ',
            plans: [
                {
                    name: 'Clinic Starter',
                    price: '฿3,500',
                    period: '/month',
                    description: 'For small clinics',
                    features: ['1 Provider', 'Patient Scheduling', 'EMR Basics', 'Mobile App for Patients'],
                    buttonText: 'Start Trial'
                },
                {
                    name: 'Clinic Pro',
                    price: '฿8,900',
                    period: '/month',
                    description: 'For growing clinics',
                    features: ['Up to 5 Providers', 'Advanced EMR', 'Billing & Claims', 'Telehealth Integration', 'Exercise Library'],
                    recommended: true,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Hospital / Network',
                    price: 'Contact Us',
                    period: '',
                    description: 'For hospitals and clinic networks',
                    features: ['Unlimited Providers', 'Multi-location Support', 'Custom Integration', '24/7 Support'],
                    buttonText: 'Contact Sales'
                }
            ]
        }
    },
    {
        id: 'dormitory',
        slug: 'dormitory',
        name: 'DORMITORY',
        name_th: 'หอพัก',
        icon: 'Building2',
        tagline: 'Smart Dormitory Management System',
        tagline_th: 'ระบบบริหารจัดการหอพักอัจฉริยะ',
        description: 'Complete solution for managing student housing, room assignments, payments, maintenance, and resident communication.',
        description_th: 'โซลูชันที่สมบูรณ์สำหรับการจัดการที่พักนักศึกษา การจัดห้อง การชำระเงิน การบำรุงรักษา และการสื่อสารกับผู้พักอาศัย',
        heroImage: '/platforms/dormitory-hero.jpg',
        color: '#10B981',
        gradient: 'from-emerald-600 via-green-500 to-teal-500',
        features: [
            {
                title: 'Room Management',
                title_th: 'การจัดการห้องพัก',
                description: 'Track room availability, assignments, and occupancy',
                description_th: 'ติดตามห้องว่าง การจัดห้อง และการเข้าพัก',
                icon: 'BedDouble'
            },
            {
                title: 'Payment Processing',
                title_th: 'การประมวลผลการชำระเงิน',
                description: 'Automated rent collection and payment tracking',
                description_th: 'การเก็บค่าเช่าและติดตามการชำระเงินอัตโนมัติ',
                icon: 'CreditCard'
            },
            {
                title: 'Maintenance Requests',
                title_th: 'คำขอซ่อมบำรุง',
                description: 'Digital maintenance request and tracking system',
                description_th: 'ระบบคำขอและติดตามการซ่อมบำรุงดิจิทัล',
                icon: 'Wrench'
            },
            {
                title: 'Resident Portal',
                title_th: 'พอร์ทัลผู้พักอาศัย',
                description: 'Self-service portal for residents',
                description_th: 'พอร์ทัลบริการตนเองสำหรับผู้พักอาศัย',
                icon: 'UserCircle2'
            }
        ],
        benefits: {
            title: 'Why Choose DORMITORY',
            title_th: 'ทำไมต้องเลือก DORMITORY',
            items: [
                'Reduce administrative workload by 70%',
                'Improve rent collection rate to 98%',
                'Faster maintenance response times',
                'Better resident satisfaction',
                'Real-time occupancy tracking',
                'Automated billing and invoicing'
            ],
            items_th: [
                'ลดภาระงานบริหาร 70%',
                'เพิ่มอัตราการเก็บค่าเช่าเป็น 98%',
                'เวลาตอบสนองการซ่อมบำรุงที่เร็วขึ้น',
                'ความพึงพอใจของผู้พักอาศัยที่ดีขึ้น',
                'การติดตามการเข้าพักแบบเรียลไทม์',
                'การเรียกเก็บเงินและออกใบแจ้งหนี้อัตโนมัติ'
            ]
        },
        useCases: [
            {
                title: 'University Housing',
                title_th: 'หอพักมหาวิทยาลัย',
                description: 'Manage large-scale student housing operations',
                description_th: 'จัดการที่พักนักศึกษาขนาดใหญ่'
            },
            {
                title: 'Private Dormitories',
                title_th: 'หอพักเอกชน',
                description: 'Streamline operations for private dorm businesses',
                description_th: 'ปรับปรุงการดำเนินงานสำหรับธุรกิจหอพักเอกชน'
            }
        ],
        pricing: {
            title: 'Property Management Plans',
            title_th: 'แผนบริหารจัดการอสังหาริมทรัพย์',
            subtitle: 'Efficient management at scale',
            subtitle_th: 'การจัดการที่มีประสิทธิภาพในวงกว้าง',
            plans: [
                {
                    name: 'Basic',
                    price: '฿1,000',
                    period: '/month',
                    description: 'Up to 50 Units',
                    features: ['Room Management', 'Bill Generation', 'Maintenance Requests', 'Basic Reports'],
                    buttonText: 'Start Trial'
                },
                {
                    name: 'Professional',
                    price: '฿3,500',
                    period: '/month',
                    description: 'Up to 200 Units',
                    features: ['Unlimited Users', 'Online Payment Gateway', 'Resident App', 'Meter Reading App', 'Advanced Accounting'],
                    recommended: true,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Enterprise',
                    price: 'Contact Us',
                    period: '',
                    description: 'Unlimited Units',
                    features: ['Multi-property Support', 'Custom Branding', 'API Integration', 'On-premise Setup'],
                    buttonText: 'Contact Sales'
                }
            ]
        }
    }
];

export function getPlatformBySlug(slug: string): Platform | undefined {
    return platforms.find(p => p.slug === slug);
}

export function getAllPlatformSlugs(): string[] {
    return platforms.map(p => p.slug);
}
