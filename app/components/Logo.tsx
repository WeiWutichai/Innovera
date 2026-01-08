import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <span className={`font-nunito font-bold uppercase tracking-widest ${className}`}>
            INNOVERA
        </span>
    );
}
