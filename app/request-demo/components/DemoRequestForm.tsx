"use client";
import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function DemoRequestForm() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        workEmail: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        companyName: "",
        country: "",
        interest: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/demo-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to submit");

            setStatus("success");
            setFormData({
                workEmail: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                companyName: "",
                country: "",
                interest: "",
            });
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <div className="bg-[#FFF0EB] relative overflow-hidden">
            {/* Decorative background curves */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div>
                    <div className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">{t.demoRequest.subtitle}</div>
                    <h1 className="text-5xl font-extrabold text-[#0B1C33] mb-6 leading-tight">
                        {t.demoRequest.title}
                    </h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        {t.demoRequest.description}
                    </p>


                </div>

                {/* Right Form */}
                <div className="bg-white p-8 lg:p-12 shadow-2xl rounded-lg border-t-4 border-[#C2185B]">
                    {status === "success" ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.demoRequest.form.success.title}</h3>
                            <p className="text-gray-600">{t.demoRequest.form.success.message}</p>
                            <button onClick={() => setStatus("idle")} className="mt-6 text-[#C2185B] font-bold hover:underline">{t.demoRequest.form.success.newRequest}</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.demoRequest.form.workEmail} *</label>
                                <input
                                    required
                                    type="email"
                                    name="workEmail"
                                    value={formData.workEmail}
                                    onChange={handleChange}
                                    className="w-full border-b-2 border-gray-300 focus:border-[#C2185B] outline-none py-2 transition-colors bg-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.demoRequest.form.firstName} *</label>
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full border-b-2 border-gray-300 focus:border-[#C2185B] outline-none py-2 transition-colors bg-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.demoRequest.form.lastName} *</label>
                                    <input
                                        required
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full border-b-2 border-gray-300 focus:border-[#C2185B] outline-none py-2 transition-colors bg-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.demoRequest.form.phoneNumber} *</label>
                                <input
                                    required
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full border-b-2 border-gray-300 focus:border-[#C2185B] outline-none py-2 transition-colors bg-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.demoRequest.form.companyName} *</label>
                                <input
                                    required
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full border-b-2 border-gray-300 focus:border-[#C2185B] outline-none py-2 transition-colors bg-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.demoRequest.form.country} *</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full border-b-2 border-gray-300 focus:border-[#C2185B] outline-none py-2 transition-colors bg-transparent"
                                >
                                    <option value="">{t.demoRequest.form.options.select}</option>
                                    <option value="Thailand">Thailand</option>
                                    <option value="United States">United States</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Other">{t.demoRequest.form.options.other}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.demoRequest.form.interest} *</label>
                                <select
                                    name="interest"
                                    value={formData.interest}
                                    onChange={handleChange}
                                    className="w-full border-b-2 border-gray-300 focus:border-[#C2185B] outline-none py-2 transition-colors bg-transparent"
                                >
                                    <option value="">{t.demoRequest.form.options.select}</option>
                                    <option value="INNO ONE">{t.demoRequest.form.options.innoOne}</option>
                                    <option value="LAWFIRM">{t.demoRequest.form.options.lawfirm}</option>
                                    <option value="PHYSICAL THERAPY">{t.demoRequest.form.options.physicalTherapy}</option>
                                    <option value="DORMITORY">{t.demoRequest.form.options.dormitory}</option>
                                    <option value="OTHER">{t.demoRequest.form.options.other}</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-[#C2185B] text-white font-bold py-4 rounded hover:bg-[#AD1457] transition shadow-lg uppercase tracking-wide text-sm mt-8"
                            >
                                {status === "loading" ? t.demoRequest.form.submitting : t.demoRequest.form.submit}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
