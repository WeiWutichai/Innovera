import React from 'react';
import {
    LayoutDashboard,
    Scale,
    Activity,
    Building2,
    Kanban,
    Users,
    BarChart3,
    Zap,
    Briefcase,
    Shield,
    FileText,
    Clock,
    Calendar,
    FileHeart,
    Stethoscope,
    PlayCircle,
    BedDouble,
    CreditCard,
    Wrench,
    UserCircle2,
    CheckCircle2,
    ArrowRight,
    Database,
    Sparkles,
    Cloud,
    RefreshCw,
    Package,
    Brain,
    PenTool,
    Lightbulb,
    Lock,
    TrendingUp,
    Code2
} from 'lucide-react';

export const IconMap: Record<string, React.ElementType> = {
    'LayoutDashboard': LayoutDashboard,
    'Scale': Scale,
    'Activity': Activity,
    'Building2': Building2,
    'Kanban': Kanban,
    'Users': Users,
    'BarChart3': BarChart3,
    'Zap': Zap,
    'Briefcase': Briefcase,
    'Shield': Shield,
    'FileText': FileText,
    'Clock': Clock,
    'Calendar': Calendar,
    'FileHeart': FileHeart,
    'Stethoscope': Stethoscope,
    'PlayCircle': PlayCircle,
    'BedDouble': BedDouble,
    'CreditCard': CreditCard,
    'Wrench': Wrench,
    'UserCircle2': UserCircle2,
    'CheckCircle2': CheckCircle2,
    'ArrowRight': ArrowRight,
    'Database': Database,
    'Sparkles': Sparkles,
    'Cloud': Cloud,
    'RefreshCw': RefreshCw,
    'Package': Package,
    'Brain': Brain,
    'PenTool': PenTool,
    'Lightbulb': Lightbulb,
    'Lock': Lock,
    'TrendingUp': TrendingUp,
    'Scaling': TrendingUp, // Alias for Scaling
    'Code2': Code2
};

interface IconRendererProps {
    name: string;
    className?: string;
    style?: React.CSSProperties;
}

export function IconRenderer({ name, className, style }: IconRendererProps) {
    const Icon = IconMap[name] || LayoutDashboard;
    return <Icon className={className} style={style} />;
}
