export const dictionary = {
    en: {
        nav: {
            service: "Service",
            platforms: "Platforms",
            siteReference: "Site Reference",
            blog: "Blog",
            community: "Community",
            contact: "Contact Us",
            pricing: "Pricing",
            signIn: "Sign in",
            startFree: "Start free"
        },
        hero: {
            badge: "Ship faster with fewer meetings",
            title: "Your Trusted",
            titleHighlight: "End-to-End Technology Partner",
            description: "Innovera is shaped by the habits of elite builders: tight feedback loops, ruthless prioritization, and a commitment to craft. Plan roadmaps, track sprints, and ship with confidence—without the overhead.",
            createWorkspace: "Create workspace",
            bookDemo: "Book a demo",
            trustedBy: "Trusted by 2,400+ teams • 4.9/5 satisfaction",
            cards: {
                customSoftware: {
                    title: "Custom Software Development",
                    desc: "Tailored to your needs."
                },
                backlog: {
                    title: "Backlog grooming",
                    desc: "Keep it clean.",
                    open: "Open"
                },
                branch: {
                    title: "Branch previews",
                    desc: "Deploy every branch.",
                    synced: "Synced"
                },
                release: {
                    title: "Release train",
                    val: "v2.4",
                    time: "shipped",
                    rollback: "Rollback"
                },
                stats: {
                    leadTime: "Lead time",
                    onTime: "On time",
                    cycleTime: "Cycle time",
                    nps: "NPS"
                }

            }
        },
        features: {
            cards: {
                webDesign: {
                    title: "Web Design & Development",
                    desc: "Modern website design and development, supporting all screens (Responsive) with a focus on user-friendly and beautiful UX/UI.",
                    subtitle: "Comprehensive Website Design and Development Service",
                    color: "blue",
                    features: [
                        {
                            title: "UX/UI Design",
                            icon: "monitor",
                            desc: "Designed with user experience in mind, beautiful and easy to use.",
                            items: ["Modern Interface", "Corporate Identity (CI)"]
                        },
                        {
                            title: "Development",
                            icon: "code-2",
                            desc: "Developed with the latest technology, fast, secure, and scalable.",
                            items: ["React / Next.js / Vue", "High Performance"]
                        }
                    ],
                    table: {
                        headers: ["Item", "Landing Page", "Corporate", "E-Commerce"],
                        rows: [
                            ["Pages", "1 Page (Long)", "5-10 Pages", "Unlimited"],
                            ["CMS", "-", "Yes", "Yes"],
                            ["Duration", "7-14 Days", "30-45 Days", "60+ Days"],
                            ["Responsive", "Yes", "Yes", "Yes"]
                        ]
                    }
                },
                mobileApp: {
                    title: "Mobile Application",
                    desc: "Create mobile applications on both iOS and Android with the latest technology to reach your customers anywhere, anytime.",
                    subtitle: "iOS and Android Mobile Application Development",
                    color: "purple",
                    features: [
                        {
                            title: "Cross-Platform",
                            icon: "layers",
                            desc: "Develop once, run on both iOS and Android. Save budget and time.",
                            items: ["Flutter / React Native", "Single Codebase"]
                        },
                        {
                            title: "Native Performance",
                            icon: "zap",
                            desc: "Fast and smooth performance, just like a Native App.",
                            items: ["60 FPS Animation", "Native Features Access"]
                        }
                    ],
                    table: {
                        headers: ["Item", "Starter App", "Business App", "Enterprise"],
                        rows: [
                            ["Platform", "iOS/Android", "iOS/Android", "iOS/Android + Web"],
                            ["Design", "Template", "Custom Design", "Premium Custom"],
                            ["Duration", "1-2 Months", "3-4 Months", "5+ Months"],
                            ["API Integration", "Basic", "Advanced", "Complex"]
                        ]
                    }
                },
                digitalMarketing: {
                    title: "Digital Marketing",
                    desc: "Comprehensive online marketing planning including SEO, SEM, and Social Media to increase sales and brand awareness.",
                    subtitle: "Comprehensive Online Marketing",
                    color: "orange",
                    features: [
                        {
                            title: "SEO & SEM",
                            icon: "search",
                            desc: "Boost your website ranking and manage ad budgets for maximum ROI.",
                            items: ["Keyword Research", "Google Ads Management"]
                        },
                        {
                            title: "Social Media",
                            icon: "share-2",
                            desc: "Create content and manage brand image on Facebook, IG, TikTok.",
                            items: ["Content Planning", "Community Management"]
                        }
                    ],
                    table: {
                        headers: ["Item", "Starter", "Growth", "Corporate"],
                        rows: [
                            ["Social Media Posts", "8 Posts/Month", "15 Posts/Month", "30 Posts/Month"],
                            ["Ads Budget Manage", "Up to 20k", "Up to 100k", "Unlimited"],
                            ["SEO Articles", "2 Articles", "5 Articles", "10+ Articles"],
                            ["Monthly Report", "Yes", "Yes", "Yes"]
                        ]
                    }
                },
                graphicDesign: {
                    title: "Graphic Design",
                    desc: "Design logos, banners, advertisements, and corporate identity (CI) to be outstanding and memorable.",
                    subtitle: "Graphic Design and Advertising Media",
                    color: "pink",
                    features: [
                        {
                            title: "Branding",
                            icon: "star",
                            desc: "Create a clear, distinct, and memorable brand identity.",
                            items: ["Logo Design", "Brand Guidelines"]
                        },
                        {
                            title: "Marketing Materials",
                            icon: "image",
                            desc: "Design eye-catching advertising media that stimulates sales.",
                            items: ["Social Media Banners", "Brochure / Print"]
                        }
                    ],
                    table: {
                        headers: ["Item", "Logo Only", "Brand Starter", "Full CI"],
                        rows: [
                            ["Logo Drafts", "3 Drafts", "5 Drafts", "Unlimited"],
                            ["Mood & Tone", "Yes", "Yes", "Yes"],
                            ["CI Manual", "-", "Basic", "Full Book"],
                            ["Files Included", "Ai, PNG, JPG", "All Formats", "All Formats"]
                        ]
                    }
                },
                cloudSolutions: {
                    title: "Cloud Solutions",
                    desc: "Consulting and installation services for Cloud Server systems with high security and stability.",
                    subtitle: "Cloud System and Server Services",
                    color: "teal",
                    features: [
                        {
                            title: "Cloud Migration",
                            icon: "upload-cloud",
                            desc: "Migrate from old servers to Cloud smoothly with no data loss.",
                            items: ["Zero Downtime", "Data Integrity"]
                        },
                        {
                            title: "DevOps & Security",
                            icon: "shield",
                            desc: "Implement CI/CD and Firewall security to prevent attacks.",
                            items: ["Auto Scaling", "DDoS Protection"]
                        }
                    ],
                    table: {
                        headers: ["Item", "Setup", "Maintenance", "Enterprise"],
                        rows: [
                            ["Server Setup", "Yes", "Review", "Custom Architecture"],
                            ["Monitoring", "Basic", "24/7 Realtime", "24/7 + Alert"],
                            ["Backup", "Daily", "Hourly", "Realtime Replica"],
                            ["Support", "Email", "Email/Chat", "Dedicated Team"]
                        ]
                    }
                },
                itConsultant: {
                    title: "IT Consultant",
                    desc: "IT consultancy to help plan strategies and solve technical problems to increase operational efficiency.",
                    subtitle: "Information Technology Consultant",
                    color: "indigo",
                    features: [
                        {
                            title: "Digital Strategy",
                            icon: "compass",
                            desc: "Plan a long-term roadmap for implementing technology in the organization.",
                            items: ["Technology Roadmap", "Budget Planning"]
                        },
                        {
                            title: "System Audit",
                            icon: "file-search",
                            desc: "Audit existing systems to find weaknesses and improvement guidelines.",
                            items: ["Performance Audit", "Security Audit"]
                        }
                    ],
                    table: {
                        headers: ["Item", "Consultation", "Project Manager", "Full Audit"],
                        rows: [
                            ["Session", "2 Times/Month", "Weekly", "On-Site"],
                            ["Deliverables", "Report", "Progress Tracking", "Full Documentation"],
                            ["Team", "Senior Consultant", "PM + Team", "Specialist Team"],
                            ["Contract", "Per Time/Month", "3-6 Months", "Project Based"]
                        ]
                    }
                }
            },
            highlights: {
                sprint: {
                    title: "Sprint planning",
                    desc: "Capacity-aware estimates, drag-and-drop scopes, carryover prevention."
                },
                keyboard: {
                    title: "Keyboard-first",
                    desc: "Every action in reach: create, assign, move, and merge in seconds."
                },
                git: {
                    title: "Git automations",
                    desc: "Branch naming, PR linking, and state changes that just happen."
                },
                roadmap: {
                    title: "Outcome roadmaps",
                    desc: "Tie initiatives to measurable impact, not just dates."
                },
                customFields: {
                    title: "Custom fields",
                    desc: "Track effort, risk, and dependencies with clarity."
                },
                analytics: {
                    title: "Real-time analytics",
                    desc: "Spot blockers early with cycle time and throughput insights."
                }
            }
        },
        siteReference: {
            title: "Site Reference",
            subtitle: "Curated collection of design and development resources",
            items: [
                {
                    title: "Maxtech Elevator & Service Co.,Ltd.",
                    desc: "Leading provider of elevator solutions and services, delivering safety and reliability across the region.",
                    image: "/assets/maxtech-logo.png",
                    url: "#"
                },
                {
                    title: "P.C. Tuna Siam",
                    desc: "Premier manufacturer and exporter of canned tuna and seafood products, committed to quality and sustainability.",
                    image: "/assets/pc-tuna-siam.png",
                    url: "#"
                },
                {
                    title: "Almendra",
                    desc: "Natural sugar reduction solutions derived from Stevia, enabling healthier food and beverage products.",
                    image: "/assets/almendra-logo.png",
                    url: "#"
                },
                {
                    title: "DURO",
                    desc: "High-quality road safety and traffic control products, ensuring safer roads for everyone.",
                    image: "/assets/duro-logo.png",
                    url: "#"
                }
            ]
        },
        blog: {
            title: "Latest updates",
            subtitle: "News, insights, and stories from our team",
            items: [
                {
                    title: "The Future of Web Development",
                    desc: "Exploring the latest trends in React, Next.js, and modern frontend architecture.",
                    image: "/assets/maxtech-logo.png",
                    date: "Dec 24, 2024",
                    readTime: "5 min read",
                    url: "future-web-development"
                },
                {
                    title: "Building Scalable Systems",
                    desc: "Best practices for designing robust and scalable backend systems for enterprise.",
                    image: "/assets/pc-tuna-siam.png",
                    date: "Dec 20, 2024",
                    readTime: "4 min read",
                    url: "building-scalable-systems"
                },
                {
                    title: "Design Systems 101",
                    desc: "How to create and maintain a consistent design language across your products.",
                    image: "/assets/almendra-logo.png",
                    date: "Dec 18, 2024",
                    readTime: "6 min read",
                    url: "design-systems-101"
                }
            ]
        },
        contact: {
            title: "Get in touch",
            subtitle: "We'd love to hear from you. Fill out the form or reach out directly.",
            form: {
                name: "Name",
                email: "Email",
                subject: "Subject",
                message: "Message",
                submit: "Send Message"
            },
            info: {
                email: "info@innovera.co.th",
                phone: "0953597497",
                address: "44/137 Moo 16 Bueng Kham Phroi Sub-district Lam Luk Ka District, Pathum Thani 12150",
                line: "Line Contact",
                whatsapp: "WhatsApp"
            }
        },
        pricing: {
            testimonials: {
                quote: "\"Innovera cut our cycle time by 35% in a month.\"",
                label: "What teams say",
                author: "Riya Sharma",
                role: "VP Engineering, Orbitly"
            },
            header: {
                title: "Simple, transparent pricing",
                subtitle: "Start free, scale as you grow"
            },
            plans: {
                free: {
                    name: "Free",
                    desc: "Perfect for small teams getting started",
                    price: "$0",
                    unit: "/month",
                    button: "Get started",
                    features: [
                        "Up to 5 team members",
                        "Unlimited issues",
                        "Basic analytics"
                    ]
                },
                pro: {
                    name: "Pro",
                    desc: "For growing teams that ship fast",
                    badge: "Most popular",
                    price: "$12",
                    unit: "/user/month",
                    button: "Start free trial",
                    features: [
                        "Everything in Free",
                        "Advanced analytics",
                        "Git integrations"
                    ]
                },
                enterprise: {
                    name: "Enterprise",
                    desc: "For large organizations with specific needs",
                    price: "Custom",
                    unit: "",
                    button: "Contact sales",
                    features: [
                        "Everything in Pro",
                        "SSO & security controls",
                        "Priority support"
                    ]
                }
            }
        },
        faq: {
            title: "Frequently asked questions",
            subtitle: "Everything you need to know about Innovera",
            items: [
                {
                    q: "How long does setup take?",
                    a: "Most teams are up and running in under 30 minutes. Import existing issues, connect your Git repos, and invite your team."
                },
                {
                    q: "Can I migrate from other tools?",
                    a: "Yes, we support imports from Jira, Linear, GitHub Issues, and most other project management tools."
                },
                {
                    q: "What Git providers do you support?",
                    a: "GitHub, GitLab, Bitbucket, and Azure DevOps. We sync branch names, PR status, and deployment info automatically."
                },
                {
                    q: "Is there a mobile app?",
                    a: "Our web app works great on mobile, and we're working on native iOS and Android apps for 2025."
                },
                {
                    q: "How does billing work?",
                    a: "Monthly or annual billing per active user. Free plan includes up to 5 team members with no time limit."
                },
                {
                    q: "Do you offer customer support?",
                    a: "Email support for all plans, with priority support and dedicated success managers for Enterprise customers."
                }
            ]
        },
        footer: {
            tagline: "The improving workflow for modern product teams. Plan, ship, and measure without the chaos.",
            product: {
                title: "Product",
                links: ["Features", "Workflows", "Insights", "Changelog"]
            },
            company: {
                title: "Company",
                links: ["About", "Blog", "Careers", "Customers"]
            },
            legal: {
                title: "Legal",
                links: ["Privacy", "Terms", "Security"]
            },
            copyright: "© 2024 Innovera Inc. All rights reserved.",
            status: "All systems operational"
        },
        profileMenu: {
            hi: "Hi",
            manage: "Manage your Innovera Account",
            signOut: "Sign out",
            privacy: "Privacy Policy",
            terms: "Terms of Service"
        },
        demoRequest: {
            title: "Request your Innovera demo today",
            subtitle: "See it in action",
            description: "Learn firsthand why businesses rely on Innovera to help them streamline workflows, develop applications, and empower employees to automate their most important work.",
            points: [
                "Won top industry awards for innovation and speed.",
                "Earned \"Momentum Leader\" for Digital Process Automation.",
                "Awarded \"Fastest Implementation\" honors."
            ],
            form: {
                workEmail: "Work Email",
                firstName: "First Name",
                lastName: "Last Name",
                phoneNumber: "Phone Number",
                companyName: "Company",
                country: "Country/Territory",
                interest: "What can our process experts help with?",
                submit: "Book your demo",
                submitting: "Submitting...",
                success: {
                    title: "Thank You!",
                    message: "We've received your request and will be in touch shortly.",
                    newRequest: "Send another request"
                },
                options: {
                    select: "Select...",
                    innoOne: "INNO ONE",
                    lawfirm: "LAWFIRM",
                    physicalTherapy: "PHYSICAL THERAPY",
                    dormitory: "DORMITORY",
                    processAutomation: "Process Automation",
                    appDevelopment: "App Development",
                    consulting: "Consulting",
                    other: "Other"
                }
            }
        }
    },
    th: {
        nav: {
            service: "บริการ",
            platforms: "แพลตฟอร์ม",
            siteReference: "อ้างอิง",
            blog: "บล็อก",
            community: "ชุมชน",
            contact: "ติดต่อเรา",
            pricing: "ราคา",
            signIn: "เข้าสู่ระบบ",
            startFree: "เริ่มต้นใช้งานฟรี"
        },
        hero: {
            badge: "ส่งงานไว ลดการประชุม",
            title: "พันธมิตรที่คุณวางใจ",
            titleHighlight: "ด้านเทคโนโลยีแบบครบวงจร",
            description: "Innovera ถูกสร้างขึ้นจากแนวคิดของนักพัฒนามืออาชีพ: เน้นรอบการทำงานที่รวดเร็ว การจัดลำดับความสำคัญที่ชัดเจน และความใส่ใจในรายละเอียด วางแผนแผนงาน ติดตามสปรินต์ และส่งมอบงานอย่างมั่นใจ—โดยไม่ต้องมีภาระส่วนเกิน",
            createWorkspace: "สร้างพื้นที่ทำงาน",
            bookDemo: "จองเวลาสาธิต",
            trustedBy: "ได้รับความไว้วางใจจาก 2,400+ ทีม • 4.9/5 คะแนนความพึงพอใจ",
            cards: {
                customSoftware: {
                    title: "การพัฒนาซอฟต์แวร์ตามสั่ง",
                    desc: "ปรับแต่งตามความต้องการของคุณ"
                },
                backlog: {
                    title: "การจัดการ Backlog",
                    desc: "จัดระเบียบอยู่เสมอ",
                    open: "เปิด"
                },
                branch: {
                    title: "ดูตัวอย่าง Branch",
                    desc: "Deploy ทุกสาขา",
                    synced: "ซิงค์แล้ว"
                },
                release: {
                    title: "ขบวนการปล่อยของ",
                    val: "v2.4",
                    time: "ส่งแล้ว",
                    rollback: "ย้อนกลับ"
                },
                stats: {
                    leadTime: "เวลาดำเนินการ",
                    onTime: "ตรงเวลา",
                    cycleTime: "รอบเวลา",
                    nps: "NPS"
                }
            }
        },
        features: {
            cards: {
                webDesign: {
                    title: "Web Design & Development",
                    desc: "รับออกแบบและพัฒนาเว็บไซต์ที่ทันสมัย รองรับทุกหน้าจอ (Responsive) เน้น UX/UI ที่ใช้งานง่ายและสวยงาม",
                    subtitle: "บริการออกแบบและพัฒนาเว็บไซต์ครบวงจร",
                    color: "blue",
                    features: [
                        {
                            title: "UX/UI Design",
                            icon: "monitor",
                            desc: "ออกแบบโดยคำนึงถึงประสบการณ์ผู้ใช้งานเป็นหลัก สวยงามและใช้งานง่าย",
                            items: ["Modern Interface", "Corporate Identity (CI)"]
                        },
                        {
                            title: "Development",
                            icon: "code-2",
                            desc: "พัฒนาด้วยเทคโนโลยีล่าสุด รวดเร็ว ปลอดภัย และรองรับการขยายตัว",
                            items: ["React / Next.js / Vue", "High Performance"]
                        }
                    ],
                    table: {
                        headers: ["รายการ", "Landing Page", "Corporate", "E-Commerce"],
                        rows: [
                            ["จำนวนหน้า", "1 หน้า (ยาว)", "5-10 หน้า", "ไม่จำกัด"],
                            ["ระบบหลังบ้าน (CMS)", "-", "Yes", "Yes"],
                            ["ระยะเวลา", "7-14 วัน", "30-45 วัน", "60+ วัน"],
                            ["Responsive", "Yes", "Yes", "Yes"]
                        ]
                    }
                },
                mobileApp: {
                    title: "Mobile Application",
                    desc: "สร้างแอปพลิเคชันบนมือถือทั้ง iOS และ Android ด้วยเทคโนโลยีล่าสุด เพื่อเข้าถึงลูกค้าของคุณได้ทุกที่ทุกเวลา",
                    subtitle: "พัฒนาแอปพลิเคชันมือถือ iOS และ Android",
                    color: "purple",
                    features: [
                        {
                            title: "Cross-Platform",
                            icon: "layers",
                            desc: "พัฒนาครั้งเดียวใช้ได้ทั้ง iOS และ Android ประหยัดงบประมาณและเวลา",
                            items: ["Flutter / React Native", "Single Codebase"]
                        },
                        {
                            title: "Native Performance",
                            icon: "zap",
                            desc: "ประสิทธิภาพการทำงานรวดเร็ว ลื่นไหล เหมือน Native App จริงๆ",
                            items: ["60 FPS Animation", "Native Features Access"]
                        }
                    ],
                    table: {
                        headers: ["รายการ", "Starter App", "Business App", "Enterprise"],
                        rows: [
                            ["Platform", "iOS/Android", "iOS/Android", "iOS/Android + Web"],
                            ["ดีไซน์", "Template", "Custom Design", "Premium Custom"],
                            ["ระยะเวลา", "1-2 เดือน", "3-4 เดือน", "5+ เดือน"],
                            ["API Integration", "Basic", "Advanced", "Complex"]
                        ]
                    }
                },
                digitalMarketing: {
                    title: "Digital Marketing",
                    desc: "วางแผนการตลาดออนไลน์ครบวงจร SEO, SEM และ Social Media เพื่อเพิ่มยอดขายและการรับรู้แบรนด์",
                    subtitle: "ทำการตลาดออนไลน์แบบครบวงจร",
                    color: "orange",
                    features: [
                        {
                            title: "SEO & SEM",
                            icon: "search",
                            desc: "ดันเว็บไซต์ให้ติดอันดับการค้นหา และบริหารงบโฆษณาให้คุ้มค่าที่สุด",
                            items: ["Keyword Research", "Google Ads Management"]
                        },
                        {
                            title: "Social Media",
                            icon: "share-2",
                            desc: "สร้างคอนเทนต์และดูแลภาพลักษณ์แบรนด์บน Facebook, IG, TikTok",
                            items: ["Content Planning", "Community Management"]
                        }
                    ],
                    table: {
                        headers: ["รายการ", "Starter", "Growth", "Corporate"],
                        rows: [
                            ["Social Media Posts", "8 โพสต์/เดือน", "15 โพสต์/เดือน", "30 โพสต์/เดือน"],
                            ["Ads Budget Manage", "ไม่เกิน 20k", "ไม่เกิน 100k", "ไม่จำกัด"],
                            ["SEO Articles", "2 บทความ", "5 บทความ", "10+ บทความ"],
                            ["Monthly Report", "Yes", "Yes", "Yes"]
                        ]
                    }
                },
                graphicDesign: {
                    title: "Graphic Design",
                    desc: "ออกแบบโลโก้ แบนเนอร์ สื่อโฆษณา และอัตลักษณ์องค์กร (CI) ให้โดดเด่นและจดจำง่าย",
                    subtitle: "ออกแบบกราฟิกและสื่อโฆษณา",
                    color: "pink",
                    features: [
                        {
                            title: "Branding",
                            icon: "star",
                            desc: "สร้างตัวตนของแบรนด์ให้ชัดเจน แตกต่าง และน่าจดจำ",
                            items: ["Logo Design", "Brand Guidelines"]
                        },
                        {
                            title: "Marketing Materials",
                            icon: "image",
                            desc: "ออกแบบสื่อโฆษณาที่ดึงดูดสายตาและกระตุ้นยอดขาย",
                            items: ["Social Media Banners", "Brochure / Print"]
                        }
                    ],
                    table: {
                        headers: ["รายการ", "Logo Only", "Brand Starter", "Full CI"],
                        rows: [
                            ["Logo Drafts", "3 แบบ", "5 แบบ", "Unlimited"],
                            ["Mood & Tone", "Yes", "Yes", "Yes"],
                            ["CI Manual", "-", "Basic", "Full Book"],
                            ["Files Included", "Ai, PNG, JPG", "All Formats", "All Formats"]
                        ]
                    }
                },
                cloudSolutions: {
                    title: "Cloud Solutions",
                    desc: "บริการให้คำปรึกษาและติดตั้งระบบ Cloud Server ที่มีความปลอดภัยและเสถียรภาพสูง",
                    subtitle: "บริการระบบคลาวด์และเซิร์ฟเวอร์",
                    color: "teal",
                    features: [
                        {
                            title: "Cloud Migration",
                            icon: "upload-cloud",
                            desc: "ย้ายระบบจาก Server เดิมขึ้นสู่ Cloud อย่างราบรื่น ข้อมูลไม่สูญหาย",
                            items: ["Zero Downtime", "Data Integrity"]
                        },
                        {
                            title: "DevOps & Security",
                            icon: "shield",
                            desc: "วางระบบ CI/CD และระบบความปลอดภัย Firewall ป้องกันการโจมตี",
                            items: ["Auto Scaling", "DDoS Protection"]
                        }
                    ],
                    table: {
                        headers: ["รายการ", "Setup", "Maintenance", "Enterprise"],
                        rows: [
                            ["Server Setup", "Yes", "Review", "Custom Architecture"],
                            ["Monitoring", "Basic", "24/7 Realtime", "24/7 + Alert"],
                            ["Backup", "Daily", "Hourly", "Realtime Replica"],
                            ["Support", "Email", "Email/Chat", "Dedicated Team"]
                        ]
                    }
                },
                itConsultant: {
                    title: "IT Consultant",
                    desc: "ที่ปรึกษาด้านไอที ช่วยวางแผนกลยุทธ์และแก้ไขปัญหาทางเทคนิคเพื่อเพิ่มประสิทธิภาพการทำงาน",
                    subtitle: "ที่ปรึกษาด้านเทคโนโลยีสารสนเทศ",
                    color: "indigo",
                    features: [
                        {
                            title: "Digital Strategy",
                            icon: "compass",
                            desc: "วางแผน Roadmap การนำเทคโนโลยีมาใช้ในองค์กรระยะยาว",
                            items: ["Technology Roadmap", "Budget Planning"]
                        },
                        {
                            title: "System Audit",
                            icon: "file-search",
                            desc: "ตรวจสอบระบบเดิมเพื่อหาจุดอ่อนและแนวทางการปรับปรุง",
                            items: ["Performance Audit", "Security Audit"]
                        }
                    ],
                    table: {
                        headers: ["รายการ", "Consultation", "Project Manager", "Full Audit"],
                        rows: [
                            ["Session", "2 ครั้ง/เดือน", "Weekly", "On-Site"],
                            ["Deliverables", "Report", "Progress Tracking", "Full Documentation"],
                            ["Team", "Senior Consultant", "PM + Team", "Specialist Team"],
                            ["Contract", "รายครั้ง/รายเดือน", "3-6 เดือน", "Project Based"]
                        ]
                    }
                }
            },
            highlights: {
                sprint: {
                    title: "การวางแผน Sprint",
                    desc: "ประเมินตามความจุจริง ลากวางขอบเขตงานได้ง่าย และป้องกันงานค้างสะสม"
                },
                keyboard: {
                    title: "คีย์บอร์ดต้องมาก่อน",
                    desc: "ทุกการกระทำอยู่ใกล้แค่เอื้อม: สร้าง มอบหมาย ย้าย และรวมงานได้ในไม่กี่วินาที"
                },
                git: {
                    title: "ระบบอัตโนมัติ Git",
                    desc: "ตั้งชื่อ Branch เชื่อมโยง PR และเปลี่ยนสถานะงานให้อัตโนมัติ"
                },
                roadmap: {
                    title: "แผนงานแบบเน้นผลลัพธ์",
                    desc: "เชื่อมโยงสิ่งที่ทำกับผลลัพธ์ที่วัดค่าได้ ไม่ใช่แค่ผูกกับวันที่"
                },
                customFields: {
                    title: "ฟิลด์ที่กำหนดเอง",
                    desc: "ติดตามแรงงาน ความเสี่ยง และความเกี่ยวเนื่องของงานได้อย่างชัดเจน"
                },
                analytics: {
                    title: "การวิเคราะห์แบบเรียลไทม์",
                    desc: "มองเห็นปัญหาคอขวดได้ทันทีด้วยข้อมูล cycle time และ throughput"
                }
            }
        },
        siteReference: {
            title: "อ้างอิงเว็บไซต์",
            subtitle: "แหล่งรวบรวมทรัพยากรการออกแบบและพัฒนาที่คัดสรรมาแล้ว",
            items: [
                {
                    title: "บริษัท แม็กซ์เทค เอเลเวเตอร์ แอนด์ เซอร์วิส จำกัด",
                    desc: "ผู้ให้บริการชั้นนำด้านลิฟต์และบริการที่เกี่ยวข้อง ส่งมอบความปลอดภัยและความน่าเชื่อถือทั่วทั้งภูมิภาค",
                    image: "/assets/maxtech-logo.png",
                    url: "#"
                },
                {
                    title: "บริษัท พี.ซี. ทูน่า สยาม จำกัด",
                    desc: "ผู้ผลิตและส่งออกทูน่าบรรจุกระป๋องและอาหารทะเลชั้นนำ มุ่งมั่นในคุณภาพและความยั่งยืน",
                    image: "/assets/pc-tuna-siam.png",
                    url: "#"
                },
                {
                    title: "Almendra",
                    desc: "โซลูชันลดน้ำตาลจากธรรมชาติที่สกัดจากหญ้าหวาน ช่วยสร้างสรรค์ผลิตภัณฑ์อาหารและเครื่องดื่มเพื่อสุขภาพ",
                    image: "/assets/almendra-logo.png",
                    url: "#"
                },
                {
                    title: "DURO",
                    desc: "ผลิตภัณฑ์ความปลอดภัยบนท้องถนนและอุปกรณ์ควบคุมจราจรคุณภาพสูง เพื่อถนนที่ปลอดภัยยิ่งขึ้นสำหรับทุกคน",
                    image: "/assets/duro-logo.png",
                    url: "#"
                }
            ]
        },
        blog: {
            title: "อัปเดตล่าสุด",
            subtitle: "ข่าวสาร ข้อมูลเชิงลึก และเรื่องราวจากทีมงานของเรา",
            items: [
                {
                    title: "อนาคตของการพัฒนาเว็บไซต์",
                    desc: "สำรวจแนวโน้มล่าสุดใน React, Next.js และสถาปัตยกรรม frontend สมัยใหม่",
                    image: "/assets/maxtech-logo.png",
                    date: "24 ธ.ค. 2024",
                    readTime: "อ่าน 5 นาที",
                    url: "future-web-development"
                },
                {
                    title: "การสร้างระบบที่รองรับการขยายตัว",
                    desc: "แนวปฏิบัติที่ดีที่สุดสำหรับการออกแบบระบบ backend ที่แข็งแกร่งสำหรับองค์กร",
                    image: "/assets/pc-tuna-siam.png",
                    date: "20 ธ.ค. 2024",
                    readTime: "อ่าน 4 นาที",
                    url: "building-scalable-systems"
                },
                {
                    title: "ระบบการออกแบบ 101",
                    desc: "วิธีการสร้างและรักษาระบบการออกแบบที่สอดคล้องกันทั่วทั้งผลิตภัณฑ์ของคุณ",
                    image: "/assets/almendra-logo.png",
                    date: "18 ธ.ค. 2024",
                    readTime: "อ่าน 6 นาที",
                    url: "design-systems-101"
                }
            ]
        },

        contact: {
            title: "ติดต่อเรา",
            subtitle: "เรายินดีที่จะได้รับฟังจากคุณ กรอกแบบฟอร์มหรือติดต่อเราโดยตรง",
            form: {
                name: "ชื่อ",
                email: "อีเมล",
                subject: "หัวข้อ",
                message: "ข้อความ",
                submit: "ส่งข้อความ"
            },
            info: {
                email: "info@innovera.co.th",
                phone: "0953597497",
                address: "44/137 หมู่ 16 ตำบล บึงคำพล้อย อำเภอ ลำลูกกา จังหวัด ปทุมทานี 12150",
                line: "Line Contact",
                whatsapp: "WhatsApp"
            }
        },
        pricing: {
            testimonials: {
                quote: "\"Innovera ช่วยลดเวลา cycle time ของเราได้ 35% ภายในเดือนเดียว\"",
                label: "เสียงจากทีมผู้ใช้",
                author: "Riya Sharma",
                role: "VP Engineering, Orbitly"
            },
            header: {
                title: "ราคาที่เรียบง่ายและโปร่งใส",
                subtitle: "เริ่มต้นฟรี ขยายได้เมื่อคุณโตขึ้น"
            },
            plans: {
                free: {
                    name: "ฟรี",
                    desc: "เหมาะสำหรับทีมเล็กที่เพิ่งเริ่มต้น",
                    price: "$0",
                    unit: "/เดือน",
                    button: "เริ่มต้นใช้งาน",
                    features: [
                        "สมาชิกทีมสูงสุด 5 คน",
                        "สร้าง Issues ได้ไม่จำกัด",
                        "การวิเคราะห์พื้นฐาน"
                    ]
                },
                pro: {
                    name: "โปร",
                    desc: "สำหรับทีมที่กำลังเติบโตและต้องการส่งงานไว",
                    badge: "ยอดนิยม",
                    price: "$12",
                    unit: "/ผู้ใช้/เดือน",
                    button: "ทดลองใช้ฟรี",
                    features: [
                        "ทุกอย่างในแพ็กเกจฟรี",
                        "การวิเคราะห์ขั้นสููง",
                        "การเชื่อมต่อ Git"
                    ]
                },
                enterprise: {
                    name: "องค์กร",
                    desc: "สำหรับองค์กรขนาดใหญ่ที่มีความต้องการเฉพาะ",
                    price: "ติดต่อเรา",
                    unit: "",
                    button: "ติดต่อฝ่ายขาย",
                    features: [
                        "ทุกอย่างในแพ็กเกจโปร",
                        "SSO และการควบคุมความปลอดภัย",
                        "บริการช่วยเหลือระดับ Priority"
                    ]
                }
            }
        },
        faq: {
            title: "คำถามที่พบบ่อย",
            subtitle: "ทุกสิ่งที่คุณควรรู้เกี่ยวกับ Innovera",
            items: [
                {
                    q: "การตั้งค่าใช้เวลานานเท่าไหร่?",
                    a: "ทีมส่วนใหญ่พร้อมใช้งานในเวลาน้อยกว่า 30 นาที เพียงนำเข้า issues ที่มีอยู่ เชื่อมต่อ Git repo และเชิญทีมเข้าใช้งาน"
                },
                {
                    q: "ย้ายข้อมูลจากเครื่องมืออื่นได้ไหม?",
                    a: "ได้ เรารองรับการนำเข้าจาก Jira, Linear, GitHub Issues และเครื่องมือจัดการโปรเจกต์อื่นๆ ส่วนใหญ่"
                },
                {
                    q: "รองรับ Git provider เจ้าไหนบ้าง?",
                    a: "GitHub, GitLab, Bitbucket และ Azure DevOps เราซิงค์ชื่อ branch สถานะ PR และข้อมูลการ deploy ให้อัตโนมัติ"
                },
                {
                    q: "มีแอปมือถือไหม?",
                    a: "เว็บแอปของเราใช้งานบนมือถือได้ดีเยี่ยม และเรากำลังพัฒนาแอป iOS และ Android แบบ Native สำหรับปี 2025"
                },
                {
                    q: "การชำระเงินทำงานอย่างไร?",
                    a: "คิดเงินรายเดือนหรือรายปีตามผู้ใช้งานที่ active แผนฟรีให้ใช้ได้สูงสุด 5 คนโดยไม่มีกำหนดเวลา"
                },
                {
                    q: "มีบริการช่วยเหลือลูกค้าไหม?",
                    a: "เรามีบริการช่วยเหลือทางอีเมลสำหรับทุกแผน โดยมีบริการระดับ Priority และผู้ดูแลความสำเร็จเฉพาะสำหรับลูกค้า Enterprise"
                }
            ]
        },
        footer: {
            tagline: "Workflow ที่ดีกว่าสำหรับทีมผลิตภัณฑ์ยุคใหม่ วางแผน ส่งมอบ และวัดผลโดยปราศจากความวุ่นวาย",
            product: {
                title: "ผลิตภัณฑ์",
                links: ["ฟีเจอร์", "Workflows", "Insights", "บันทึกการเปลี่ยนแปลง"]
            },
            company: {
                title: "บริษัท",
                links: ["เกี่ยวกับเรา", "บล็อก", "ร่วมงานกับเรา", "ลูกค้า"]
            },
            legal: {
                title: "กฎหมาย",
                links: ["ความเป็นส่วนตัว", "ข้อกำหนด", "ความปลอดภัย"]
            },
            copyright: "© 2024 Innovera Inc. สงวนลิขสิทธิ์",
            status: "ระบบทำงานปกติ"
        },
        profileMenu: {
            hi: "สวัสดี",
            manage: "จัดการบัญชี Innovera ของคุณ",
            signOut: "ออกจากระบบ",
            privacy: "นโยบายความเป็นส่วนตัว",
            terms: "เงื่อนไขการให้บริการ"
        },
        demoRequest: {
            title: "ขอสาธิตการใช้งาน Innovera วันนี้",
            subtitle: "ดูการทำงานจริง",
            description: "เรียนรู้โดยตรงว่าทำไมธุรกิจต่างๆ ถึงไว้วางใจ Innovera เพื่อช่วยปรับปรุงกระบวนการทำงาน พัฒนาแอปพลิเคชัน และเพิ่มศักยภาพให้พนักงานในการทำระบบอัตโนมัติสำหรับงานที่สำคัญที่สุด",
            points: [
                "ได้รับรางวัลระดับอุตสาหกรรมในด้านนวัตกรรมและความรวดเร็ว",
                "ได้รับการยกย่องเป็น \"Momentum Leader\" สำหรับ Digital Process Automation",
                "ได้รับรางวัล \"การติดตั้งที่รวดเร็วที่สุด\""
            ],
            form: {
                workEmail: "อีเมลที่ทำงาน",
                firstName: "ชื่อจริง",
                lastName: "นามสกุล",
                phoneNumber: "เบอร์โทรศัพท์",
                companyName: "ชื่อบริษัท",
                country: "ประเทศ/เขตปกครอง",
                interest: "คุณต้องการให้ผู้เชี่ยวชาญของเราช่วยเหลือเรื่องใด?",
                submit: "จองเวลาสาธิต",
                submitting: "กำลังส่งข้อมูล...",
                success: {
                    title: "ขอบคุณ!",
                    message: "เราได้รับคำขอของคุณแล้วและจะติดต่อกลับโดยเร็วที่สุด",
                    newRequest: "ส่งคำขออีกครั้ง"
                },
                options: {
                    select: "เลือก...",
                    innoOne: "INNO ONE",
                    lawfirm: "LAWFIRM",
                    physicalTherapy: "PHYSICAL THERAPY",
                    dormitory: "DORMITORY",
                    processAutomation: "Process Automation",
                    appDevelopment: "App Development",
                    consulting: "Consulting",
                    other: "อื่นๆ"
                }
            }
        }
    }
};

export type Language = 'en' | 'th';
export type Dictionary = typeof dictionary.en;
