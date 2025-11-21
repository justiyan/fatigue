# Fatigue Calculator

A web application designed to assess workplace fatigue levels and provide safety recommendations based on industry standards. The calculator evaluates sleep patterns, work schedules, and time awake to generate fatigue scores and actionable safety guidelines.

## 🎯 Purpose

This tool helps workers and safety managers assess fatigue risk by analyzing:
- Sleep duration over 48-hour periods
- Time awake before work shifts
- Work start times and shift patterns
- Circadian rhythm disruption factors

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Vite** - Build tool

### Backend
- **Vercel Serverless Functions** - API endpoints
- **TypeScript** - Server-side logic
- **Zod** - Input validation

### Deployment
- **Vercel** - Hosting and serverless functions
- **GitHub** - Source control

## 📊 How It Works

### Calculation Methodology

The fatigue calculator uses industry-standard algorithms based on:

#### 1. Sleep Deficit Scoring
- **< 5 hours in last 24h**: +4 points (severe deficit)
- **5-6 hours**: +3 points (significant deficit)
- **6-7 hours**: +2 points (mild deficit)
- **7-8 hours**: +1 point (slight deficit)
- **8+ hours**: +0 points (adequate)

#### 2. 48-Hour Sleep Assessment
- **< 12 hours total**: +3 points (severe cumulative deficit)
- **12-14 hours**: +2 points (moderate deficit)
- **14-16 hours**: +1 point (mild deficit)
- **16+ hours**: +0 points (adequate)

#### 3. Time Awake Penalty
- **> 18 hours awake**: +4 points (extreme fatigue risk)
- **16-18 hours**: +3 points (high risk)
- **14-16 hours**: +2 points (moderate risk)
- **12-14 hours**: +1 point (slight risk)
- **< 12 hours**: +0 points (normal)

#### 4. Circadian Rhythm Factors
- **Night shift (11 PM - 5 AM)**: +2 points (circadian disruption)
- **Early morning (1 AM - 6 AM)**: +1 point (biological low point)

#### 5. Fatigue Levels
- **0-3 points**: Low fatigue
- **4-6 points**: Moderate fatigue
- **7-8 points**: High fatigue
- **9-10 points**: Extreme fatigue

### Time Projections

The calculator generates 24-hour fatigue projections showing how fatigue levels change throughout a work shift, accounting for:
- Progressive fatigue accumulation
- Circadian rhythm variations
- Cumulative sleep debt effects

## 🚀 Features

- **Real-time calculation** - Instant fatigue assessment
- **24-hour projections** - Visualize fatigue throughout shifts
- **Action guidelines** - Safety recommendations by fatigue level
- **Responsive design** - Works on desktop and mobile
- **Input validation** - Ensures accurate data entry
- **No data storage** - Privacy-focused, stateless operation

## 📋 Usage

1. **Enter sleep history**:
   - Hours slept in last 24 hours
   - Hours slept in previous 24 hours

2. **Specify timing**:
   - Wake-up time today
   - Work start time

3. **Get results**:
   - Fatigue score (0-10)
   - Risk level assessment
   - 24-hour projections
   - Safety recommendations

## 🏗️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/justiyan/fatigue.git
cd fatigue
npm install
```

### Development Server

```bash
npm run dev
```

Runs on `http://localhost:5000`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run check
```

## 🌐 Deployment

This application is configured for deployment on Vercel:

1. **Connect GitHub repository** to Vercel
2. **Set build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
3. **Deploy** - Automatic deployment on push to main

### Serverless API

The fatigue calculation API is implemented as a Vercel serverless function at `/api/calculate-fatigue`.

## 📁 Project Structure

```
fatigue/
├── api/                    # Serverless functions
│   └── calculate-fatigue.ts
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities
│   │   └── pages/         # Page components
│   └── index.html
├── shared/                # Shared types and schemas
├── server/                # Development server
├── vercel.json           # Vercel configuration
├── package.json
└── README.md
```

## 🔒 Privacy & Security

- **No data storage** - All calculations performed client-side and server-side without persistence
- **No user tracking** - Privacy-focused design
- **Secure API** - Input validation and error handling
- **Type safety** - Full TypeScript implementation

## ⚠️ Disclaimer

This fatigue calculator is provided for informational purposes only and should not be relied upon for critical safety decisions. No warranty or representation is made as to its accuracy or completeness. Always follow your organization's safety protocols and consult with safety professionals for workplace fatigue management.

## 📄 License

Copyright 2025 Iyan Barry. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📧 Contact

For questions or support, contact: [iyanbarry@gmail.com](mailto:iyanbarry@gmail.com)

---

Built with ❤️ for workplace safety