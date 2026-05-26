"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Form, Input, Button, message } from "antd"
import { Phone, Mail, Home, ArrowRight } from "lucide-react"
import { createContactMessage } from "@/lib/api"


// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

// ── Contact info items ────────────────────────────────────────────────────────
const contactInfo = [
  {
    icon: <Phone className="w-6 h-6 text-brand" />,
    label: "phone number",
    lines: ["+91 9940234550"],
    href: "tel:+919940234550",
  },
  {
    icon: <Mail className="w-6 h-6 text-brand" />,
    label: "e-mail support",
    lines: ["support@houselink360.com"],
    href: "mailto:support@houselink360.com",
  },
  {
    icon: <Home className="w-6 h-6 text-brand" />,
    label: "address",
    lines: [
      "Dhasmitha Solutions Private Limited,",
      "346/A, 7th Cross Street, Mangala Nagar,",
      "Porur, Chennai - 600 116.",
      "Tamil Nadu, India.",
    ],
    href: null,
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  async function onFinish(values: Record<string, string>) {
    setSubmitting(true)
    try {
      await createContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message?.trim() || "",
      })
      message.success("Your message has been sent! We'll get back to you soon.")
      form.resetFields()
    } catch (err: any) {
      console.error(err)
      message.error(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="bg-surface text-ink overflow-hidden pb-16">

      {/* ── HERO ── */}
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/images/footer/about_us.png"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center text-sm md:text-base font-medium"
          >
            <Link href="/" className="hover:text-brand-300 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-300">Contact Us</span>
          </motion.nav>
        </div>
      </div>

      {/* ── FORM + IMAGE ── */}
      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">

          {/* Left — image */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative w-full max-w-[595px] h-[730px] max-h-[730px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/assets/images/images-about/contact-us-image.jpg"
              alt="Contact Houselink360°"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {/* Section label */}
            <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-2">
              Contact Form
            </p>
            <h2 className="text-[2rem] font-bold mb-2 leading-tight">
              We would love to hear{" "}
              <span className="text-brand">from you</span>
            </h2>
            <p className="text-ink-secondary text-[1.05rem] mb-8">
              Whether you have questions, need support, or want to partner with
              us, feel free to reach out.
            </p>

            <Form
              id="contactForm"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
              requiredMark={false}
              className="contact-form"
            >
              <div className="grid md:grid-cols-2 gap-x-4">
                {/* Name */}
                <Form.Item
                  name="name"
                  label={
                    <span className="font-semibold text-ink">
                      Name <span className="text-danger">*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your name" },
                    {
                      pattern: /^[A-Za-z\s]+$/,
                      message: "Name can only contain letters and spaces",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your name"
                    className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2"
                    onInput={(e) => {
                      const t = e.currentTarget
                      t.value = t.value.replace(/[^A-Za-z\s]/g, "")
                    }}
                  />
                </Form.Item>

                {/* Email */}
                <Form.Item
                  name="email"
                  label={
                    <span className="font-semibold text-ink">
                      Email Address <span className="text-danger">*</span>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email address",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your email address"
                    className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2"
                  />
                </Form.Item>
              </div>

              {/* Phone */}
              <Form.Item
                name="phone"
                label={
                  <span className="font-semibold text-ink">
                    Phone Number <span className="text-danger">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your phone number"
                  maxLength={10}
                  className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2"
                  onInput={(e) => {
                    const t = e.currentTarget
                    t.value = t.value.replace(/[^0-9]/g, "").slice(0, 10)
                  }}
                />
              </Form.Item>

              {/* Message */}
              <Form.Item
                name="message"
                label={
                  <span className="font-semibold text-ink">Your Message</span>
                }
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter your message"
                  className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2"
                />
              </Form.Item>

              {/* Submit */}
              <Button
                htmlType="submit"
                loading={submitting}
                className="bg-brand text-white hover:!bg-brand-700 hover:!text-white rounded flex items-center gap-2 px-8 border-none font-medium mt-2 transition-all h-[45px] text-base"
              >
                Submit <ArrowRight className="w-5 h-5" />
              </Button>
            </Form>
          </motion.div>
        </div>

        {/* ── CONTACT INFO CARDS ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {contactInfo.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              className="flex items-start gap-4"
            >
              {/* Icon circle */}
              <div className="w-14 h-14 rounded-full bg-[#EAF0EC] flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-xl mb-1 text-ink capitalize">
                  {item.label}
                </h3>
                {item.lines.map((line, i) =>
                  item.href && i === 0 ? (
                    <a
                      key={i}
                      href={item.href}
                      className="text-ink-secondary text-lg hover:text-brand transition-colors block leading-relaxed"
                    >
                      {line}
                    </a>
                  ) : (
                    <p
                      key={i}
                      className="text-ink-secondary text-lg leading-relaxed m-0"
                    >
                      {line}
                    </p>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
