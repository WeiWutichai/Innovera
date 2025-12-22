export const dictionary = {
    en: {
        nav: {
            service: "Service",
            platforms: "Platforms",
            siteReference: "Site Reference",
            blog: "Blog",
            contact: "Contact Us",
            signIn: "Sign in",
            startFree: "Start free"
        },
        hero: {
            badge: "Ship faster with fewer meetings",
            title: "Built for modern product teams",
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
                purpose: {
                    title: "Purpose-built for product development",
                    desc: "Issues, docs, and sprints in one focused surface."
                },
                speed: {
                    title: "Designed to move fast",
                    desc: "Keyboard-first, zero-friction navigation and editing."
                },
                craft: {
                    title: "Crafted with care",
                    desc: "Polished UI, predictable workflows, fewer surprises."
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
                    url: "#"
                },
                {
                    title: "Building Scalable Systems",
                    desc: "Best practices for designing robust and scalable backend systems for enterprise.",
                    image: "/assets/pc-tuna-siam.png",
                    date: "Dec 20, 2024",
                    readTime: "4 min read",
                    url: "#"
                },
                {
                    title: "Design Systems 101",
                    desc: "How to create and maintain a consistent design language across your products.",
                    image: "/assets/almendra-logo.png",
                    date: "Dec 18, 2024",
                    readTime: "6 min read",
                    url: "#"
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
                email: "hello@innovera.io",
                phone: "+1 (555) 123-4567",
                address: "123 Innovation Dr, Tech City, TC 94043"
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
        }
    },
    th: {
        nav: {
            service: "บริการ",
            platforms: "แพลตฟอร์ม",
            siteReference: "อ้างอิง",
            blog: "บล็อก",
            contact: "ติดต่อเรา",
            signIn: "เข้าสู่ระบบ",
            startFree: "เริ่มต้นใช้งานฟรี"
        },
        hero: {
            badge: "ส่งงานไว ลดการประชุม",
            title: "สร้างเพื่อทีมผลิตภัณฑ์ยุคใหม่",
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
                purpose: {
                    title: "สร้างมาเพื่อการพัฒนาผลิตภัณฑ์",
                    desc: "จัดการปัญหา เอกสาร และสปรินต์ในที่เดียวอย่างมีประสิทธิภาพ"
                },
                speed: {
                    title: "ออกแบบมาเพื่อความเร็ว",
                    desc: "ใช้งานคีย์บอร์ดเป็นหลัก นำทางและแก้ไขได้อย่างลื่นไหล ไม่มีสะดุด"
                },
                craft: {
                    title: "สร้างสรรค์ด้วยความใส่ใจ",
                    desc: "UI ที่สวยงาม workflow ที่คาดเดาได้ และลดเรื่องเซอร์ไพรส์ที่ไม่จำเป็น"
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
                    url: "#"
                },
                {
                    title: "การสร้างระบบที่รองรับการขยายตัว",
                    desc: "แนวปฏิบัติที่ดีที่สุดสำหรับการออกแบบระบบ backend ที่แข็งแกร่งสำหรับองค์กร",
                    image: "/assets/pc-tuna-siam.png",
                    date: "20 ธ.ค. 2024",
                    readTime: "อ่าน 4 นาที",
                    url: "#"
                },
                {
                    title: "ระบบการออกแบบ 101",
                    desc: "วิธีการสร้างและรักษาระบบการออกแบบที่สอดคล้องกันทั่วทั้งผลิตภัณฑ์ของคุณ",
                    image: "/assets/almendra-logo.png",
                    date: "18 ธ.ค. 2024",
                    readTime: "อ่าน 6 นาที",
                    url: "#"
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
                email: "hello@innovera.io",
                phone: "+1 (555) 123-4567",
                address: "123 Innovation Dr, Tech City, TC 94043"
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
        }
    }
};

export type Language = 'en' | 'th';
export type Dictionary = typeof dictionary.en;
