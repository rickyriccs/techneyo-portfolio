import React from "react";
import {
  Stethoscope,
  ShoppingBag,
  Building2,
  GraduationCap,
  Utensils,
  Scissors,
  Globe,
  MessageSquare,
  Star,
  Calendar,
  Video,
  Rocket,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
} from "lucide-react";

export interface IndustryAddonItem {
  id: string;
  name: string;
  price: number;
  description: string;
  iconName: string;
}

export interface IndustryConfig {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  iconName: string;
  badge: string;
  gradient: string;
  heroHeadline: string;
  heroDescription: string;
  startingPrice: number;
  estimatedDays: string;
  projectedRoi: string;
  painPoints: { problem: string; solution: string }[];
  includedDeliverables: string[];
  growthFeatures: string[];
  addons: IndustryAddonItem[];
  faqs: { q: string; a: string }[];
}

export const industryRegistry: Record<string, IndustryConfig> = {
  "healthcare-clinics": {
    slug: "healthcare-clinics",
    title: "Healthcare, Clinics & Doctors",
    subtitle: "Websites, Patient Appointments & Local Google Dominance",
    tagline: "Help patients find your clinic easily, book appointments online, and trust your medical expertise.",
    iconName: "Stethoscope",
    badge: "Medical & Healthcare",
    gradient: "from-blue-600 to-cyan-500",
    heroHeadline: "Get More Patients & Online Appointment Bookings for Your Clinic",
    heroDescription:
      "We build high-trust clinic websites, online patient appointment scheduling flows, WhatsApp reminder bots, and local Google Map ranking systems for doctors and healthcare centers.",
    startingPrice: 5999,
    estimatedDays: "5 - 7 Days",
    projectedRoi: "3x More Patient Visits",
    painPoints: [
      {
        problem: "Patients can't find your clinic when searching on Google Maps or Search.",
        solution: "We optimize your Google Business Profile and local SEO so you rank #1 for local searches.",
      },
      {
        problem: "Staff spends hours taking appointment calls and managing manual registers.",
        solution: "We set up an automated 24/7 online appointment booking system with WhatsApp reminders.",
      },
      {
        problem: "Patients visit your clinic once but forget to come back for follow-up checkups.",
        solution: "Automated WhatsApp follow-up messages remind patients about routine health checkups.",
      },
    ],
    includedDeliverables: [
      "Custom Clinic & Doctor Profile Website (Mobile & Desktop)",
      "Instant Patient Appointment Booking Form",
      "Doctor Qualifications, Treatments & Fee Showcase",
      "Google Maps Location, Directions & Working Hours",
      "1-Tap WhatsApp & Direct Phone Call Button",
      "1-Year Free Hosting, SSL Security & Domain Support",
    ],
    growthFeatures: [
      "Patient Testimonial & Video Review Showcase",
      "Specialist Doctor Profile Cards",
      "Emergency Contact & Ambulance Quick Button",
      "Health Blog & Patient Advice Section",
    ],
    addons: [
      {
        id: "hc-addon-booking",
        name: "Clinic Online Appointment Booking Engine",
        price: 3499,
        description: "Allow patients to pick doctor, date & time slot online",
        iconName: "Calendar",
      },
      {
        id: "hc-addon-seo",
        name: "Google Maps #1 Clinic Ranking Setup",
        price: 2999,
        description: "Rank top on Google Maps when patients search nearby",
        iconName: "Star",
      },
      {
        id: "hc-addon-wa",
        name: "WhatsApp Patient Reminder & Auto Bot",
        price: 2499,
        description: "Send automated appointment confirmation & reminders",
        iconName: "MessageSquare",
      },
    ],
    faqs: [
      {
        q: "Can patients book appointments outside clinic working hours?",
        a: "Yes! Your online booking system works 24/7, allowing patients to schedule visits anytime from their phone.",
      },
      {
        q: "Can we list multiple doctors and treatment specialties?",
        a: "Absolutely! You can showcase doctor profiles, degrees, treatment costs, and clinic timings.",
      },
    ],
  },

  "ecommerce-retail": {
    slug: "ecommerce-retail",
    title: "E-Commerce & Retail Stores",
    tagline: "Sell products online, accept UPI/Cards, and receive instant orders directly on WhatsApp.",
    iconName: "ShoppingBag",
    badge: "Retail & Online Sales",
    gradient: "from-purple-600 to-indigo-500",
    subtitle: "Online Shopping Store, UPI Payments & Order Alerts",
    heroHeadline: "Turn Your Retail Shop into a 24/7 High-Sales Online Store",
    heroDescription:
      "Sell products nationwide with mobile-friendly online stores, fast checkout, GooglePay/PhonePe payments, and instant WhatsApp order notifications.",
    startingPrice: 7999,
    estimatedDays: "7 - 10 Days",
    projectedRoi: "4x Direct Sales Growth",
    painPoints: [
      {
        problem: "Sending photos and prices manually on WhatsApp wastes hours every day.",
        solution: "Your online catalog lets customers browse products, select sizes, and order in seconds.",
      },
      {
        problem: "High drop-offs during payment because checkout is too complex.",
        solution: "Instant 1-click UPI payments (GooglePay, PhonePe, Paytm) make buying effortless.",
      },
      {
        problem: "Competitors with online stores are stealing your local customers.",
        solution: "Your branded online shop gives customers a trusted shopping experience.",
      },
    ],
    includedDeliverables: [
      "Custom E-Commerce Online Storefront (Mobile & Desktop)",
      "Product Catalog with Categories, Price & Inventory Tags",
      "Instant UPI, Credit/Debit Card & NetBanking Integration",
      "WhatsApp Order Alert & Invoice Generator",
      "Discount Coupon & Promotional Banner System",
      "1-Year Hosting, SSL Security & Mobile Optimization",
    ],
    growthFeatures: [
      "Customer Product Reviews & Photo Ratings",
      "Wishlist & Quick Buy Buttons",
      "Instagram Shop Link Integration",
      "Automated Shipping Fee Calculator",
    ],
    addons: [
      {
        id: "ecom-addon-pay",
        name: "All-in-One Payment Gateway & UPI Settlement",
        price: 4999,
        description: "Accept Razorpay, PhonePe, Paytm & Credit Cards with instant payout",
        iconName: "ShoppingBag",
      },
      {
        id: "ecom-addon-wa",
        name: "WhatsApp Instant Order Notification Bot",
        price: 2499,
        description: "Receive instant WhatsApp order alerts on your phone",
        iconName: "MessageSquare",
      },
      {
        id: "ecom-addon-ads",
        name: "Meta & Instagram Product Ad Campaign Setup",
        price: 3999,
        description: "Launch targeted ads that bring buyer traffic directly to your store",
        iconName: "TrendingUp",
      },
    ],
    faqs: [
      {
        q: "Is it easy for me to add new products or change prices?",
        a: "Yes! You get a simple admin manager where you can upload product photos and change prices from your phone.",
      },
      {
        q: "Do customer payments land directly in my bank account?",
        a: "Yes! All payments go straight to your verified bank account via secure Indian payment gateways.",
      },
    ],
  },

  "real-estate": {
    slug: "real-estate",
    title: "Real Estate & Builders",
    tagline: "High-converting property landing pages, virtual tour bookings, and buyer lead generation.",
    iconName: "Building2",
    badge: "Property & Construction",
    gradient: "from-amber-500 to-orange-600",
    subtitle: "Property Landing Pages, Buyer Leads & Ad Campaigns",
    heroHeadline: "Generate Qualified Home & Commercial Property Buyers",
    heroDescription:
      "We build high-converting real estate property showcase pages, virtual site visit booking forms, and targeted Meta/Google lead ad campaigns for builders and agents.",
    startingPrice: 6999,
    estimatedDays: "5 - 7 Days",
    projectedRoi: "5x Buyer Inquiries",
    painPoints: [
      {
        problem: "Spending money on generic property portals with low-quality, shared leads.",
        solution: "Your own dedicated property website brings exclusive, high-intent buyer leads straight to you.",
      },
      {
        problem: "Buyers ask for floor plans and brochures repeatedly on phone calls.",
        solution: "Instant 1-click Download Brochure form collects buyer phone numbers automatically.",
      },
    ],
    includedDeliverables: [
      "Dedicated Property Showcase Landing Page",
      "High-Resolution Photo Gallery & Video Tour Player",
      "Download Floor Plan & E-Brochure Lead Capture Form",
      "Site Visit Booking & WhatsApp Enquiry Router",
      "Google Maps Location & Nearby Landmarks Guide",
      "Mobile-First High-Speed Design",
    ],
    growthFeatures: [
      "Price Calculator & EMI Estimate Widget",
      "Project Amenities & Highlights Checklist",
      "Agent Profile & WhatsApp Direct Connect",
    ],
    addons: [
      {
        id: "re-addon-ads",
        name: "Targeted Facebook & Instagram Property Buyer Ads",
        price: 3999,
        description: "Run buyer ads targeting high-income homebuyers in your target location",
        iconName: "TrendingUp",
      },
      {
        id: "re-addon-wa",
        name: "Instant Site Visit Booking & WhatsApp Alert Bot",
        price: 2499,
        description: "Get instant buyer phone alerts when someone requests a site visit",
        iconName: "MessageSquare",
      },
    ],
    faqs: [
      {
        q: "Can I showcase multiple real estate projects?",
        a: "Yes! You can feature multiple residential, commercial, or plot developments with individual project pages.",
      },
    ],
  },

  "education-coaching": {
    slug: "education-coaching",
    title: "Coaching & Education",
    tagline: "Course listing, student admission inquiry forms, demo class bookings, and brand authority.",
    iconName: "GraduationCap",
    badge: "Institutes & Tutors",
    gradient: "from-emerald-600 to-teal-500",
    subtitle: "Course Portals, Demo Class Leads & Student Enrollments",
    heroHeadline: "Attract More Students & Demo Class Admissions for Your Institute",
    heroDescription:
      "Build a modern institute website featuring course details, fee structures, faculty profiles, online demo class booking, and student lead management.",
    startingPrice: 4999,
    estimatedDays: "5 - 7 Days",
    projectedRoi: "3x Student Inquiries",
    painPoints: [
      {
        problem: "Students and parents visit your institute once but don't follow up.",
        solution: "Free Demo Class Registration form captures student details before they leave.",
      },
      {
        problem: "Competitors look more professional online and win student trust.",
        solution: "High-trust institute website showcases achievements, toppers & facility photos.",
      },
    ],
    includedDeliverables: [
      "Custom Institute & Academy Website",
      "Course Catalog & Batch Timing Showcase",
      "Free Demo Class Registration Lead Form",
      "Topper Results & Student Testimonials Section",
      "1-Tap Call & WhatsApp Inquiry Button",
      "1-Year Hosting & SSL Security",
    ],
    growthFeatures: [
      "Faculty Profile Cards & Specializations",
      "Online Fee Payment & Receipt Generator",
      "Syllabus E-Book Download Lead Magnet",
    ],
    addons: [
      {
        id: "edu-addon-demo",
        name: "Instant Demo Class Slot Booking Engine",
        price: 2999,
        description: "Let students reserve demo class seats directly online",
        iconName: "Calendar",
      },
      {
        id: "edu-addon-reels",
        name: "4x Student Testimonial & Campus Video Reels",
        price: 2999,
        description: "Edited short video reels showcasing topper success & institute facilities",
        iconName: "Video",
      },
    ],
    faqs: [
      {
        q: "Can parents download syllabus PDFs from the website?",
        a: "Yes! We can add instant PDF downloads that prompt parents to enter their phone number first.",
      },
    ],
  },

  "restaurants-food": {
    slug: "restaurants-food",
    title: "Restaurants, Cafes & Food",
    tagline: "QR digital menus, direct WhatsApp table reservations, and Google Map review growth.",
    iconName: "Utensils",
    badge: "Food & Hospitality",
    gradient: "from-rose-600 to-pink-500",
    subtitle: "QR Digital Menus, Table Booking & Local Orders",
    heroHeadline: "Pack Your Restaurant & Drive Direct Food Orders",
    heroDescription:
      "We create QR code digital menus, direct WhatsApp food ordering systems, table reservation widgets, and Google 5-Star review boosters for cafes and restaurants.",
    startingPrice: 4999,
    estimatedDays: "3 - 5 Days",
    projectedRoi: "10x Table Visits",
    painPoints: [
      {
        problem: "High commissions paid to food delivery apps eat into restaurant profits.",
        solution: "Direct WhatsApp ordering system lets customers order food commission-free.",
      },
      {
        problem: "Low Google Maps rating keeps new diners away.",
        solution: "Google 5-Star QR Code review booster increases your positive customer ratings.",
      },
    ],
    includedDeliverables: [
      "Custom Restaurant & Cafe Website",
      "Mobile-Friendly QR Digital Food & Drinks Menu",
      "Direct WhatsApp Food Delivery Order Button",
      "Table Reservation Request Form",
      "Google Maps Location & Opening Hours Guide",
      "Atmosphere & Food Photo Gallery",
    ],
    growthFeatures: [
      "Chef Special Offers & Daily Deals Section",
      "Social Media Feed & Instagram Highlights Sync",
    ],
    addons: [
      {
        id: "food-addon-review",
        name: "Google Maps 5-Star Review Booster & QR Standee",
        price: 2999,
        description: "Get more positive Google customer reviews on table QR stands",
        iconName: "Star",
      },
      {
        id: "food-addon-reels",
        name: "4x Food & Ambiance Short Video Reels",
        price: 2999,
        description: "High-quality viral food videos for Instagram & Meta Ads",
        iconName: "Video",
      },
    ],
    faqs: [
      {
        q: "How does the QR menu work for customers?",
        a: "Diners scan the table QR code with their phone camera to instantly view your food menu with photos and prices.",
      },
    ],
  },

  "local-services": {
    slug: "local-services",
    title: "Salons & Local Services",
    tagline: "Rank #1 on Google Maps, instant phone call leads, and WhatsApp service booking.",
    iconName: "Scissors",
    badge: "Local Business & Salons",
    gradient: "from-cyan-600 to-blue-600",
    subtitle: "Local Google Dominance, Appointment Booking & Phone Calls",
    heroHeadline: "Dominate Your Local Area & Get Daily Service Bookings",
    heroDescription:
      "Perfect for Salons, Spas, Home Repair, Consultants, and Local Service Providers. Get a high-converting website, Google Maps #1 ranking, and automated WhatsApp booking.",
    startingPrice: 3999,
    estimatedDays: "3 - 5 Days",
    projectedRoi: "5x Local Phone Calls",
    painPoints: [
      {
        problem: "Nearby customers choose competitors because your business isn't visible on Google.",
        solution: "Local Google SEO and Google Maps optimization puts your business at the top.",
      },
      {
        problem: "Clients call to ask about prices and services repeatedly.",
        solution: "Your simple service catalog lists all packages, prices, and 1-tap booking.",
      },
    ],
    includedDeliverables: [
      "Custom Local Business & Salon Website",
      "Service Menu with Clear Prices & Package Lists",
      "1-Tap Call & Direct WhatsApp Booking Buttons",
      "Google Maps Directions & Working Hours Setup",
      "Customer Review & Ratings Showcase",
      "1-Year Free Hosting & SSL Security",
    ],
    growthFeatures: [
      "Before & After Work Result Gallery",
      "Special Festival Discount Banner Setup",
    ],
    addons: [
      {
        id: "ls-addon-seo",
        name: "Google Map #1 Local Area Dominance Setup",
        price: 2999,
        description: "Rank top on Google Maps when local residents search for your service",
        iconName: "Star",
      },
      {
        id: "ls-addon-booking",
        name: "Online Service Booking & Slot Selector",
        price: 2999,
        description: "Let customers pick service date and time slot online",
        iconName: "Calendar",
      },
    ],
    faqs: [
      {
        q: "Will this help me get phone calls directly from local customers?",
        a: "Yes! We place prominent 1-tap call and WhatsApp buttons at the top of your mobile website.",
      },
    ],
  },
};
