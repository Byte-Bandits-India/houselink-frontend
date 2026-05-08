"use client"
import Image from "next/image"
import Link from "next/link"
import { Form, Input, Button, Upload, message } from "antd"
import { motion, Variants } from "framer-motion"
import HoverViewCard from "@/components/ui/HoverViewCard"
import {
  Phone,
  Mail,
  Home,
  Megaphone,
  Eye,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from "lucide-react"

const partners = [
  {
    id: 1,
    title: "Casagrand Builder",
    description: "Premium residential properties across South India.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600&h=400",
    link: "#"
  },
  {
    id: 2,
    title: "Sobha Developers",
    description: "Luxury apartments and villas with international quality.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600&h=400",
    link: "#"
  },
  {
    id: 3,
    title: "Prestige Group",
    description: "Innovative commercial and residential real estate.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=400",
    link: "#"
  }
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

function PartnerCard({ partner }: { partner: any }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden bg-white shadow-md transition-all duration-300 w-full max-w-[403px] h-[548px] mx-auto"
    >
      <HoverViewCard className="absolute inset-0 z-30">
        <Link href={partner.link} className="absolute inset-0">
          <span className="sr-only">View {partner.title}</span>
        </Link>
      </HoverViewCard>

      <Image
        src={partner.image}
        alt={partner.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />

      <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end transform transition-transform duration-300">
        <h3 className="text-2xl font-bold mb-3 text-white">
          {partner.title}
        </h3>
        <p className="text-white/80 text-base leading-relaxed line-clamp-3">{partner.description}</p>
      </div>
    </motion.div>
  )
}

export default function PartnerPage() {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log(values)
    message.success("Form submitted successfully")
    form.resetFields()
  }

  const beforeUpload = (file: File) => {
    const isValid = file.size / 1024 / 1024 < 2
    if (!isValid) {
      message.error("File must be smaller than 2MB!")
    }
    return isValid || Upload.LIST_IGNORE
  }

  return (
    <div className="bg-surface text-ink overflow-hidden pb-16">
      {/* HERO SECTION */}
      <div className="relative h-[500px] w-full">
        <Image
          src="/assets/images/images-about/Partner-Withus-Slider-Image.webp"
          alt="Partner With Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Partner With Us
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center text-sm md:text-base font-medium"
          >
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-300">Partner-with-us</span>
          </motion.nav>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        {/* INTRO */}
        <div className="flex justify-between items-center mb-4">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2.2rem] font-bold m-0"
          >
            Partner <span className="text-brand">With Us</span>
          </motion.h2>
        </div>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-2 mb-4 text-[1.08rem] leading-[1.8] text-ink-secondary"
        >
          At Houselink360°, we help property sellers, real estate companies, agents, and consultants list and sell their properties with ease. By partnering with us, you gain access to end-to-end support; from property listing to strategic marketing and lead generation. Our platform connects you to a wide, active audience, giving your listings the visibility they deserve and helping you close deals faster.
        </motion.p>

        {/* WHY PARTNER */}
        <div className="mb-8 mt-12">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-4"
          >
            Why Partner <span className="text-brand">with Houselink360°?</span>
          </motion.h2>
          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="pl-6 space-y-4 text-[1.08rem] leading-[1.8] text-ink-secondary list-decimal"
          >
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Wide Audience Reach: </strong>
              Our platform is visited by thousands of active property seekers every day. By partnering with us, you can gain visibility for your listings to potential buyers, renters, and investors across multiple locations.
            </motion.li>
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Simple, User-Friendly Platform: </strong>
              We focus on providing a simple, intuitive experience for both property sellers and buyers. With Houselink360°, you can easily list properties and track engagement, helping you stay ahead in a competitive market.
            </motion.li>
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Targeted Exposure: </strong>
              Reach your ideal audience with tailored listings and highlight your properties with enhanced visibility. Whether it's for sale, rent, or investment, your properties are in front of the right buyers at the right time.
            </motion.li>
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Boost Your Credibility: </strong>
              Listing on a trusted platform like Houselink360° helps enhance your brand's credibility. Our platform ensures your properties are presented in the best light, making them stand out to potential buyers.
            </motion.li>
          </motion.ol>
        </div>

        {/* OUR CURRENT PARTNERS */}
        <div className="mb-12">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-8"
          >
            Our Current <span className="text-brand">Partners</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </motion.div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-12 mt-12">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-4"
          >
            How It <span className="text-brand">Works</span>
          </motion.h2>
          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="pl-6 space-y-4 text-[1.08rem] leading-[1.8] text-ink-secondary list-decimal"
          >
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Sign Up as a Partner: </strong>
              Create your partner account to get started. Whether you're a real estate company, builder, or consultant, joining Houselink360° gives you access to our dedicated partner services.
            </motion.li>
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Share Your Project Detail: </strong>
              List of strategies will be made with high-quality visuals, specifications, pricing, and location details. Our support staff will help you throughout the process.
            </motion.li>
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Get Strategic Marketing Support: </strong>
              We offer tailored marketing solutions including digital strategy, ad campaigns, and promotional support to help boost visibility across channels.
            </motion.li>
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Generate Quality Leads: </strong>
              Your listings are promoted to a targeted audience of serious buyers, renters, and investors, maximizing reach and lead quality.
            </motion.li>
            <motion.li variants={fadeUp}>
              <strong className="text-ink">Sell Smarter, Close Faster: </strong>
              Our platform and marketing engine work together to bring in qualified prospects, so you can close deals quicker and scale your property sales effectively.
            </motion.li>
          </motion.ol>
        </div>

        {/* BENEFITS */}
        <div className="mb-16 mt-12">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-8"
          >
            Benefits of <span className="text-brand">Partnering with Us</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={fadeUp} className="bg-white rounded-lg shadow-sm border border-surface-tertiary p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <Megaphone className="text-brand w-10 h-10 mx-auto" />
              </div>
              <h5 className="font-bold text-[1.15rem] mb-3">End-to-End Marketing Solutions</h5>
              <p className="text-ink-secondary text-[1.05rem]">From digital ads to targeted campaigns, we help amplify your property's presence across high-conversion platforms.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-lg shadow-sm border border-surface-tertiary p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <Eye className="text-success w-10 h-10 mx-auto" />
              </div>
              <h5 className="font-bold text-[1.15rem] mb-3">Wider Visibility & Reach</h5>
              <p className="text-ink-secondary text-[1.05rem]">Your listings are seen by thousands of active property seekers across residential and commercial categories.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-lg shadow-sm border border-surface-tertiary p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <ShieldCheck className="text-warning w-10 h-10 mx-auto" />
              </div>
              <h5 className="font-bold text-[1.15rem] mb-3">Brand Association & Trust</h5>
              <p className="text-ink-secondary text-[1.05rem]">Showcase your properties on a trusted platform, backed by transparency, tech, and performance.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-lg shadow-sm border border-surface-tertiary p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <TrendingUp className="text-info w-10 h-10 mx-auto" />
              </div>
              <h5 className="font-bold text-[1.15rem] mb-3">No Overhead, All Results</h5>
              <p className="text-ink-secondary text-[1.05rem]">Focus on closing deals while we handle the marketing muscle behind the scenes.</p>
            </motion.div>
          </motion.div>
        </div>

        {/* GET STARTED TODAY */}
        <div className="mb-6 mt-12">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-4"
          >
            Get <span className="text-brand">Started Today</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[1.08rem] text-ink-secondary mb-4"
          >
            Ready to get your properties in front of a wider audience? Partner with Houselink360° and start listing today!
          </motion.p>
        </div>

        {/* FORM + IMAGE */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-16">
          {/* IMAGE */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative h-full w-full min-h-[500px]"
          >
            <Image
              src="/assets/images/images-about/JoinPartnerWithUs.webp"
              alt="Join Partner With Us"
              fill
              className="object-cover rounded-xl"
            />
          </motion.div>

          {/* FORM */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white"
          >
            <h2 className="text-[2rem] font-bold mb-6">
              Join Partner <span className="text-brand">With Us</span>
            </h2>

            <Form layout="vertical" form={form} onFinish={onFinish} size="large" requiredMark={false} className="contact-form">
              <div className="grid md:grid-cols-2 gap-x-4">
                <Form.Item
                  name="name"
                  label={<span className="font-semibold text-ink">Name <span className="text-danger">*</span></span>}
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="Enter your name" className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2" />
                </Form.Item>

                <Form.Item
                  name="company_name"
                  label={<span className="font-semibold text-ink">Company Name <span className="text-danger">*</span></span>}
                  rules={[{ required: true, message: 'Please enter company name' }]}
                >
                  <Input placeholder="Enter your company name" className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2" />
                </Form.Item>

                <Form.Item
                  name="property_name"
                  label={<span className="font-semibold text-ink">Property Name <span className="text-danger">*</span></span>}
                  rules={[{ required: true, message: 'Please enter property name' }]}
                >
                  <Input placeholder="Enter property name" className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2" />
                </Form.Item>

                <Form.Item
                  name="property_location"
                  label={<span className="font-semibold text-ink">Property Location <span className="text-danger">*</span></span>}
                  rules={[{ required: true, message: 'Please enter property location' }]}
                >
                  <Input placeholder="Enter property location" className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2" />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label={<span className="font-semibold text-ink">Email Address <span className="text-danger">*</span></span>}
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input placeholder="Enter your email address" className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2" />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<span className="font-semibold text-ink">Phone Number <span className="text-danger">*</span></span>}
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
                ]}
              >
                <Input placeholder="Enter your phone number" maxLength={10} className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2" />
              </Form.Item>

              <Form.Item
                name="message"
                label={<span className="font-semibold text-ink">Your Message</span>}
              >
                <Input.TextArea rows={4} placeholder="Enter your message (optional)" className="rounded-lg border-2 border-[#c3c3c3] hover:border-brand focus:border-brand px-4 py-2" />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-ink">Upload File <span className="text-danger">*</span></span>}
                name="file"
                rules={[{ required: true, message: 'Please upload a file' }]}
                extra={<span className="text-[#6c757d] text-[13px] mt-1 block">Upload PDF or image files (max 2MB)</span>}
              >
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="w-full rounded border border-[#c3c3c3] text-sm text-ink-secondary
                    file:mr-4 file:py-2 file:px-4
                    file:border-0 file:border-r file:border-[#c3c3c3]
                    file:text-sm file:font-medium
                    file:bg-surface-secondary file:text-ink
                    hover:file:bg-surface-tertiary cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) beforeUpload(file);
                  }}
                />
              </Form.Item>

              <Button
                htmlType="submit"
                className="bg-brand text-white hover:!bg-brand-700 hover:!text-white rounded flex items-center gap-2 px-8 border-none font-medium mt-2 transition-all h-[45px] text-base"
              >
                Submit <ArrowRight className="w-5 h-5" />
              </Button>
            </Form>
          </motion.div>
        </div>

        {/* CONTACT */}
        <div className="mb-16 mt-12">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[2rem] font-bold mb-4"
          >
            Contact <span className="text-brand">Us</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-ink-secondary text-[1.08rem] mb-8"
          >
            For partnership inquiries, please reach out to:
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start"
          >
            {/* Phone */}
            <motion.div
              variants={fadeUp}
              className="flex items-start gap-4 h-full"
            >
              <div className="w-14 h-14 rounded-full bg-[#EAF0EC] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-brand" />
              </div>

              <div>
                <h3 className="font-bold text-xl mb-1 text-ink capitalize">
                  phone number
                </h3>

                <p className="text-ink-secondary text-lg">
                  +91 9940234550
                </p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              variants={fadeUp}
              className="flex items-start gap-4 h-full"
            >
              <div className="w-14 h-14 rounded-full bg-[#EAF0EC] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-brand" />
              </div>

              <div>
                <h3 className="font-bold text-xl mb-1 text-ink capitalize">
                  e-mail support
                </h3>

                <p className="text-ink-secondary text-lg">
                  support@houselink360.com
                </p>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              variants={fadeUp}
              className="flex items-start gap-4 h-full"
            >
              <div className="w-14 h-14 rounded-full bg-[#EAF0EC] flex items-center justify-center shrink-0">
                <Home className="w-6 h-6 text-brand" />
              </div>

              <div>
                <h3 className="font-bold text-xl mb-1 text-ink capitalize">
                  address
                </h3>

                <p className="text-ink-secondary text-lg leading-relaxed m-0">
                  Dhasmitha Solutions Private Limited,
                </p>

                <p className="text-ink-secondary text-lg leading-relaxed m-0">
                  346/A, 7th Cross Street, Mangala Nagar,
                </p>

                <p className="text-ink-secondary text-lg leading-relaxed m-0">
                  Porur, Chennai - 600 116.
                </p>

                <p className="text-ink-secondary text-lg leading-relaxed m-0">
                  Tamil Nadu, India.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}