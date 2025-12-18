
export default function FAQ() {
    return (
        <section className="max-w-7xl mx-auto px-6 mt-16 pb-16">
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl tracking-tight font-nunito font-semibold text-white">Frequently asked questions</h3>
                <p className="text-white/70 mt-2 font-nunito">Everything you need to know about Innovera</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-medium tracking-tight mb-2 font-nunito text-white">How long does setup take?</h4>
                    <p className="text-sm text-white/70 font-nunito">Most teams are up and running in under 30 minutes. Import existing issues, connect your Git repos, and invite your team.</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-medium tracking-tight mb-2 font-nunito text-white">Can I migrate from other tools?</h4>
                    <p className="text-sm text-white/70 font-nunito">Yes, we support imports from Jira, Linear, GitHub Issues, and most other project management tools.</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-medium tracking-tight mb-2 font-nunito text-white">What Git providers do you support?</h4>
                    <p className="text-sm text-white/70 font-nunito">GitHub, GitLab, Bitbucket, and Azure DevOps. We sync branch names, PR status, and deployment info automatically.</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-medium tracking-tight mb-2 font-nunito text-white">Is there a mobile app?</h4>
                    <p className="text-sm text-white/70 font-nunito">Our web app works great on mobile, and we're working on native iOS and Android apps for 2025.</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-medium tracking-tight mb-2 font-nunito text-white">How does billing work?</h4>
                    <p className="text-sm text-white/70 font-nunito">Monthly or annual billing per active user. Free plan includes up to 5 team members with no time limit.</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-medium tracking-tight mb-2 font-nunito text-white">Do you offer customer support?</h4>
                    <p className="text-sm text-white/70 font-nunito">Email support for all plans, with priority support and dedicated success managers for Enterprise customers.</p>
                </div>
            </div>
        </section>
    );
}
