# TechNeyo Ludhiana Studio — Office Maintenance & Visitor Operations Guide

**Location:** Ludhiana, Punjab  
**Facility Profile:** Boutique IT & Digital Solutions Studio (< 10 Staff, Open Bay Workspace)  
**Visitor Portal URL:** `https://techneyo.com/checkin`

---

## 1. Daily, Weekly & Monthly Maintenance Routines

Ludhiana's climate features high fine industrial and road dust, summer heat, winter smog/fog (Nov–Jan), and monsoon humidity. Consistent housekeeping keeps electronic hardware and monitors running without breakdown and creates a high-trust impression for visiting clients.

### A. Daily Routine (Part-time Cleaner — 45–60 mins every morning before 10:00 AM)

| Order | Area | Action Items | Supplies Needed |
|---|---|---|---|
| **1** | **Dusting (Electronics First)** | Wipe all monitor frames, laptop stands, keyboards, and glass dividers using a dry microfiber cloth. *Never spray liquid cleaner directly onto screens.* | Microfiber cloths |
| **2** | **Workstations & Desks** | Wipe clean table surfaces, clean any coffee cup rings or pen marks. | Mild surface disinfectant spray |
| **3** | **Floor Care** | 1. Thorough dry sweep to collect hair/dust.<br>2. Damp mop with disinfectant floor cleaner (e.g. Lizol / Lemon Phenyl). | Dry broom, cotton mop, disinfectant |
| **4** | **Restroom Hygiene** | Scrub WC pan with Harpic, mop restroom floor dry, wipe washbasin & mirror with glass cleaner, check liquid hand wash dispenser and tissue roll. | Harpic, glass cleaner, hand wash |
| **5** | **Waste Management** | Empty all under-desk dustbins into main trash bag. Replace biodegradable bin liners daily. | Trash bin liners |
| **6** | **Water & Hospitality Station** | Wipe RO water dispenser, ensure drinking glasses/mugs are sanitized, check clean water level. | Dish soap, dry cloth |

### B. Weekly Checklist (Every Saturday Afternoon or Monday Morning)

- [ ] **AC Air Filters:** Slide out and rinse the mesh filters of all split air conditioners with plain running water. In Ludhiana, fine dust blocks airflow within 10–14 days.
- [ ] **Glass Entrance Door:** Clean glass thoroughly with glass cleaner (Colin) to remove all fingerprints, smudges, and street dust.
- [ ] **Switchboards & Door Handles:** Disinfect high-touch door handles, biometric sensors, and main power switches.
- [ ] **Outdoor Mat Cleaning:** Vigorously shake and sweep the heavy-duty dirt-trapping mat outside the office door.
- [ ] **Cable Management Check:** Check under-desk power strips and spike guards; ensure no wires are dangling near feet.

### C. Monthly & Seasonal Checklist

- [ ] **Inverter Battery Check (Crucial for PSPCL Cuts):** Inspect the tubular inverter battery water levels every 60–90 days. Top up strictly with distilled water (`battery water`). Ensure terminals are free from white carbon/sulphate deposits.
- [ ] **Air Quality / HEPA Purifier (November – January):** During the North Indian winter smog period, operate an indoor HEPA air purifier during working hours. Reduces developer fatigue and prevents soot entering laptop fans.
- [ ] **Bi-Annual AC Jet Servicing:** Schedule full chemical jet cleaning for split AC indoor & outdoor units:
  - *Round 1:* March (before peak summer)
  - *Round 2:* August (after monsoon humidity)

---

## 2. Managing Visitors & Their Belongings

In a boutique open-plan IT studio, visitors (prospective clients, interview candidates, partners) sit near active workstations. Follow this friction-free protocol:

### Belongings & Seating Flow
1. **Welcome & Seating:** Walk visitors directly to the visitor seating corner or meeting desk.
2. **Bags & Laptops:**
   - Visitors are encouraged to carry their bags and laptops directly with them to the table.
   - Keep a dedicated **multi-plug spike guard / power extension** at arm's reach so they can charge laptops and phones immediately without bending under desks.
   - Attach heavy-duty adhesive hooks or use floor pouches on desk legs so bags don't clutter tabletop workspace.
3. **Hospitality:** Offer fresh drinking water immediately upon seating (served in clean glassware or branded paper cups), followed by tea/coffee.

### Screen Privacy & Security in Open Bay
- **Visitor Angle:** Position visitor chairs facing the branding wall or window, **away from direct line-of-sight to developers' code, client dashboards, or Figma mockups**.
- **Auto-Lock Policy:** All developer machines must have a 2-minute auto-lock screen timeout.
- **Network Isolation:** Guest Wi-Fi must be configured on a separate SSID (e.g., `TechNeyo-Guest`) isolated from internal servers, Git repositories, and printers.

---

## 3. Digital Visitor Management (Internal TechNeyo Portal)

Rather than using third-party paid visitor software or an unhygienic, outdated paper register, TechNeyo now has its own internal visitor check-in system:

### How It Works:
1. **URL:** `https://techneyo.com/checkin`
2. **Access:** Visitor scans the QR code from the desk standee upon arrival.
3. **Form Fields:**
   - Full Name
   - Mobile / WhatsApp Number
   - Company / Organization (optional)
   - Purpose of Visit (Client Consultation, Project Review, Job Candidate / Interview, Vendor / Delivery, Coffee Chat)
   - Host Person (Ricky / Leadership, Dev Team, HR, General)
   - Optional Message / Notes
4. **Instant Team Alert:**
   - On submission, the entry is automatically stored in `contact_enquiries` with tag `Office Visitor Check-in`.
   - Triggers automated Slack alerts to the team (`#leads` / visitor channel).
5. **Visitor Perks Screen:**
   - Upon completing the form, the visitor is instantly shown the **Guest Wi-Fi SSID & Password** with a one-click copy button, plus a warm welcome message.
6. **Admin Review:**
   - The admin can view all visits in `/admin/enquiries` filtered by `Office Visitor Check-in`.

---

## 4. Print & Display Specifications

### What to Print & Display

| Item | Dimensions / Spec | Placement | What to Print |
|---|---|---|---|
| **1. Primary 3D Wall Logo** | 4 to 5 ft wide, 6mm–8mm Acrylic cutout with matte or metallic finish | Entrance focal wall (behind visitor seats) | **TECHNEYO** logo + tagline *"Digital Products & Engineering"* |
| **2. Desk QR Standee** | A5 (5.8 × 8.3 in) Double-Sided Clear Acrylic T-Standee | On the coffee table in visitor area | • **Front:** "Welcome to TechNeyo Studio" + QR code to `techneyo.com/checkin`<br>• **Back:** "Connect to Guest Wi-Fi" (Wi-Fi QR code + Network details) |
| **3. Coaster Set** | 4-inch square or round Cork / Matte Wood | Meeting desks & coffee table | TechNeyo icon or clean monochrome logo |
| **4. Visiting Card Holder** | Sleek clear acrylic or brushed aluminum dispenser | On the side table | Clean cards for visitors to take |

### Front of Desk Standee Text (Copy-Paste for Printer)
```
┌───────────────────────────────────────────────┐
│                 TECHNEYO                      │
│        LUDHIANA ENGINEERING STUDIO            │
│                                               │
│             Welcome! Please Check In          │
│                                               │
│              [  QR CODE GOES HERE  ]          │
│        https://techneyo.com/checkin           │
│                                               │
│    Scan with your phone camera to check in    │
│         and unlock instant Guest Wi-Fi        │
└───────────────────────────────────────────────┘
```

### Back of Desk Standee Text (Wi-Fi Quick Connect)
```
┌───────────────────────────────────────────────┐
│                 TECHNEYO                      │
│             GUEST WI-FI ACCESS                │
│                                               │
│              [  WIFI QR CODE  ]               │
│                                               │
│        Network: TechNeyo-Guest                │
│        Password: [Your-Wifi-Password]         │
│                                               │
│            Enjoy high-speed fiber             │
└───────────────────────────────────────────────┘
```

---

## 5. Emergency & PSPCL Power Outage Playbook

1. **Inverter Priority:** Only Wi-Fi routers, primary lights, and ceiling fans should be wired to the inverter line. High-draw appliances (ACs, electric kettles, laser printers) must NOT be connected to the inverter.
2. **Laptop Battery Health:** Team members should keep laptop batteries charged at 80%+ so work continues seamlessly if a grid cut exceeds 2 hours.
3. **Secondary Internet Hotspot:** Keep one 5G phone or portable dongle with Jio/Airtel active in case the local fiber line undergoes roadside maintenance.
