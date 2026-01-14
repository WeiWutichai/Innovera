export interface Integration {
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
    supportedItems: string[]; // e.g. "Modules supported", "Services supported"
}

export const integrations: Integration[] = [
    {
        id: 'sap',
        slug: 'sap',
        name: 'SAP',
        name_th: 'SAP',
        icon: 'Database',
        tagline: 'Enterprise Resource Planning Integration',
        tagline_th: 'การเชื่อมต่อระบบบริหารจัดการทรัพยากรองค์กร',
        description: 'Seamlessly connect Innovera with SAP S/4HANA and other SAP modules. Synchronize data, automate workflows, and ensure financial accuracy across your organization.',
        description_th: 'เชื่อมต่อ Innovera กับ SAP S/4HANA และโมดูล SAP อื่นๆ อย่างราบรื่น ซิงค์ข้อมูล เวิร์กโฟลว์อัตโนมัติ และรับรองความถูกต้องทางการเงินทั่วทั้งองค์กร',
        heroImage: '/integrations/sap-hero.jpg',
        color: '#003366', // SAP Dark Blue
        gradient: 'from-blue-900 via-blue-800 to-indigo-900',
        features: [
            {
                title: 'Real-time Sync',
                title_th: 'การซิงค์แบบเรียลไทม์',
                description: 'Keep your financial and operational data in sync instantly.',
                description_th: 'รักษาข้อมูลทางการเงินและปฏิบัติการของคุณให้ตรงกันทันที',
                icon: 'RefreshCw'
            },
            {
                title: 'Financial Posting',
                title_th: 'การบันทึกบัญชี',
                description: 'Automate journal entries and invoice postings directly to SAP.',
                description_th: 'บันทึกรายการรายวันและใบแจ้งหนี้ไปยัง SAP โดยทำงานอัตโนมัติ',
                icon: 'FileText'
            },
            {
                title: 'Inventory Management',
                title_th: 'การจัดการสินค้าคงคลัง',
                description: 'Synchronize stock levels and material master data.',
                description_th: 'ซิงค์ระดับสต็อกและข้อมูลหลักวัสดุ',
                icon: 'Package'
            }
        ],
        benefits: {
            title: 'Integration Benefits',
            title_th: 'ประโยชน์ของการเชื่อมต่อ',
            items: [
                'Eliminate manual data entry errors',
                'Accelerate financial closing processes',
                'Single source of truth for master data',
                'End-to-end business process visibility'
            ],
            items_th: [
                'ขจัดข้อผิดพลาดจากการป้อนข้อมูลด้วยตนเอง',
                'เร่งกระบวนการปิดบัญชี',
                'แหล่งข้อมูลความจริงเดียวสำหรับข้อมูลหลัก',
                'การมองเห็นกระบวนการทางธุรกิจแบบ End-to-end'
            ]
        },
        supportedItems: ['SAP S/4HANA', 'SAP Business One', 'SAP ECC']
    },
    {
        id: 'google-gemini',
        slug: 'google-gemini',
        name: 'Google Gemini',
        name_th: 'Google Gemini',
        icon: 'Sparkles',
        tagline: 'AI-Powered Business Intelligence',
        tagline_th: 'ระบบอัจฉริยะทางธุรกิจขับเคลื่อนด้วย AI',
        description: 'Leverage the power of Google Gemini directly within Innovera. Generate content, analyze complex data, and get intelligent insights to make better decisions faster.',
        description_th: 'ใช้พลังของ Google Gemini ได้โดยตรงใน Innovera สร้างเนื้อหา วิเคราะห์ข้อมูลซับซ้อน และรับข้อมูลเชิงลึกอัจฉริยะเพื่อการตัดสินใจที่ดีกว่าและเร็วกว่า',
        heroImage: '/integrations/gemini-hero.jpg',
        color: '#0EA5E9', // Sky Blue
        gradient: 'from-sky-500 via-blue-500 to-indigo-500',
        features: [
            {
                title: 'Smart Analytics',
                title_th: 'การวิเคราะห์อัจฉริยะ',
                description: 'Ask questions about your data in natural language and get instant answers.',
                description_th: 'ถามคำถามเกี่ยวกับข้อมูลของคุณด้วยภาษาธรรมชาติและรับคำตอบทันที',
                icon: 'Brain' // representing AI/Brain
            },
            {
                title: 'Content Generation',
                title_th: 'การสร้างเนื้อหา',
                description: 'Draft emails, reports, and marketing copy with AI assistance.',
                description_th: 'ร่างอีเมล รายงาน และข้อความการตลาดด้วยความช่วยเหลือจาก AI',
                icon: 'PenTool'
            },
            {
                title: 'Automated Insights',
                title_th: 'ข้อมูลเชิงลึกอัตโนมัติ',
                description: 'Proactively identify trends and anomalies in your business data.',
                description_th: 'ระบุแนวโน้มและความผิดปกติในข้อมูลธุรกิจของคุณในเชิงรุก',
                icon: 'Lightbulb'
            }
        ],
        benefits: {
            title: 'Why Integrate Gemini?',
            title_th: 'ทำไมต้องเชื่อต่อ Gemini?',
            items: [
                'Enhance decision making with AI',
                'Automate routine cognitive tasks',
                'Improve communication clarity and tone',
                'Unlock hidden value in your data'
            ],
            items_th: [
                'เพิ่มประสิทธิภาพการตัดสินใจด้วย AI',
                'ทำงานด้านการคิดวิเคราะห์ประจำวันโดยอัตโนมัติ',
                'ปรับปรุงความชัดเจนและน้ำเสียงของการสื่อสาร',
                'ปลดล็อกมูลค่าที่ซ่อนอยู่ในข้อมูลของคุณ'
            ]
        },
        supportedItems: ['Gemini Pro', 'Gemini Ultra']
    },
    {
        id: 'aws',
        slug: 'aws',
        name: 'AWS Cloud',
        name_th: 'AWS Cloud',
        icon: 'Cloud',
        tagline: 'Secure & Scalable Infrastructure',
        tagline_th: 'โครงสร้างพื้นฐานที่ปลอดภัยและขยายขนาดได้',
        description: 'Seamlessly store and manage your documents and backups on AWS S3, and leverage AWS Lambda for custom serverless workflows connected to Innovera events.',
        description_th: 'จัดเก็บและจัดการเอกสารและข้อมูลสำรองของคุณบน AWS S3 ได้อย่างราบรื่น และใช้ AWS Lambda สำหรับเวิร์กโฟลว์ Serverless ที่เชื่อมต่อกับเหตุการณ์ใน Innovera',
        heroImage: '/integrations/aws-hero.jpg',
        color: '#F97316', // Orange
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        features: [
            {
                title: 'Secure Storage',
                title_th: 'การจัดเก็บที่ปลอดภัย',
                description: 'Bank-grade encryption for all your uploaded documents and files.',
                description_th: 'การเข้ารหัสระดับธนาคารสำหรับเอกสารและไฟล์ที่อัปโหลดทั้งหมด',
                icon: 'Lock'
            },
            {
                title: 'Scalability',
                title_th: 'ความสามารถในการขยาย',
                description: 'Unlimited storage capacity that grows with your business needs.',
                description_th: 'ความจุในการจัดเก็บข้อมูลไม่จำกัดที่เติบโตไปพร้อมกับธุรกิจของคุณ',
                icon: 'Scaling' // ArrowUpRight or similar, let's use TrendingUp
            },
            {
                title: 'Serverless Functions',
                title_th: 'ฟังก์ชัน Serverless',
                description: 'Trigger custom code execution based on platform events via AWS Lambda.',
                description_th: 'เรียกใช้โค้ดแบบกำหนดเองตามเหตุการณ์ของแพลตฟอร์มผ่าน AWS Lambda',
                icon: 'Code2'
            }
        ],
        benefits: {
            title: 'AWS Benefits',
            title_th: 'ประโยชน์ของ AWS',
            items: [
                '99.999999999% Data Durability',
                'Global accessibility with low latency',
                'Enterprise-grade security standards',
                'Cost-effective storage tiering'
            ],
            items_th: [
                'ความทนทานของข้อมูล 99.999999999%',
                'เข้าถึงได้ทั่วโลกด้วยความหน่วงต่ำ',
                'มาตรฐานความปลอดภัยระดับองค์กร',
                'การจัดระดับการจัดเก็บข้อมูลที่คุ้มค่า'
            ]
        },
        supportedItems: ['Amazon S3', 'AWS Lambda', 'Amazon SNS/SQS']
    }
];

export function getIntegrationBySlug(slug: string): Integration | undefined {
    return integrations.find(p => p.slug === slug);
}

export function getAllIntegrationSlugs(): string[] {
    return integrations.map(p => p.slug);
}
