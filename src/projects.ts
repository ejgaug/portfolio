export type Project = {
    title: string;
    eyebrow: string;
    tagline: string;
    summary: string;
    role: string;
    stack: string[];
    highlights: string[];
    links: {
        website?: string;
        github?: string;
        appStore?: string;
        googlePlay?: string;
    };
};

export const projects: Project[] = [
    {
        title: 'FantasyHQ.ai',
        eyebrow: 'Featured web product',
        tagline: 'Real-time fantasy football analytics with responsive dashboards and AI-assisted insights.',
        summary:
            'Built a product-focused web experience that helps users scan data quickly, compare outcomes, and act on insights without fighting the interface.',
        role: 'Founder & Lead Frontend Developer',
        stack: ['React Native', 'TypeScript', 'OpenAI', 'FastAPI', 'Google Analytics', 'Expo'],
        highlights: [
            'Created responsive UI patterns for data-heavy fantasy football workflows.',
            'Integrated external data and AI-assisted insights into a single user-facing product.',
            'Focused on an intuitive experience that brings unique value to users.',
        ],
        links: {
            website: 'https://fantasyhq.ai',
        },
    },
    {
        title: 'Recipe Scaler Pro',
        eyebrow: 'Published mobile app',
        tagline: 'A kitchen utility app that digitizes recipes, scales servings instantly, and supports hands-free cooking on Apple Watch.',
        summary:
            'Built a solo mobile product that helps home cooks scan recipes, resize ingredients accurately, and handle common kitchen conversions without manual math or messy notes.',
        role: 'Frontend Mobile & watchOS Developer',
        stack: ['React Native', 'TypeScript', 'Swift', 'watchOS', 'OCR', 'Expo', 'EAS'],
        highlights: [
            'Used OCR to scan recipe photos and digitize ingredient lists into editable, scalable recipe data.',
            'Built instant serving-size scaling plus quick kitchen math for conversions between units, volume, and weight.',
            'Extended the experience to Apple Watch so saved recipes can be viewed hands-free while cooking.',
        ],
        links: {
            appStore: 'https://apps.apple.com/us/app/recipe-scaler-pro/id6761803961',
        },
    },
    {
        title: 'Critter Clues',
        eyebrow: 'Published mobile app',
        tagline: 'Cross-platform animal trivia game shipped to the App Store and Google Play.',
        summary:
            'Built and launched an educational consumer-facing mobile game with dynamic content, engaging gameplay loops, and a custom backend for reliable data retrieval.',
        role: 'Full-Stack Mobile Developer',
        stack: ['React Native', 'JavaScript', 'Expo', 'EAS', 'Node.js', 'Express', 'Firebase'],
        highlights: [
            'Shipped production builds across iOS and Android storefronts.',
            'Connected game content to backend services for dynamic question and animal data.',
            'Balanced gameplay, educational value, and a simple interface for repeat use.',
        ],
        links: {
            website: 'https://critterclues.io/',
            github: 'https://github.com/ejgaug/Animal-Game',
            appStore: 'https://apps.apple.com/us/app/critter-clues/id6743952864',
            googlePlay: 'https://play.google.com/store/apps/details?id=com.egaug.CritterClues',
        },
    },
    {
        title: 'Critter Clues Kids',
        eyebrow: 'Published mobile app',
        tagline: 'A kid-friendly version of Critter Clues designed around simpler navigation and safer content boundaries.',
        summary:
            'Reworked the original product into a more accessible experience for younger users, with cleaner flows, simplified presentation, and stronger type safety.',
        role: 'Full-Stack Mobile Developer',
        stack: ['React Native', 'TypeScript', 'Expo', 'EAS', 'App Store Connect'],
        highlights: [
            'Adapted gameplay and interface decisions for a younger audience.',
            'Strengthened the codebase with TypeScript and cleaner frontend structure.',
            'Built backend-aware content handling to reduce unnecessary data exposure.',
        ],
        links: {
            website: 'https://critterclues.io/',
            github: 'https://github.com/ejgaug/CCKids',
            appStore: 'https://apps.apple.com/us/app/critter-clues-kids/id6752842343',
        },
    },
    {
        title: 'Last Lock',
        eyebrow: 'Team capstone project',
        tagline: 'A web app for facility managers to understand room layouts, meetings, and lock activity in one place.',
        summary:
            'Collaborated on an operations-focused tool that translated complex GeoJSON building data into usable visual workflows for facility managers.',
        role: 'Frontend Engineer (Agile Team)',
        stack: ['React', 'JavaScript', 'Mapbox', 'Node.js', 'GeoJSON', 'Agile'],
        highlights: [
            'Helped visualize room layouts and access events through interactive floor plans.',
            'Automated floor plan generation from GeoJSON data to reduce manual overhead.',
            'Worked in a team environment using Agile practices and shared planning workflows.',
        ],
        links: {
            github: 'https://github.com/natarajanWisc/LastLockFall2024',
        },
    },
    {
        title: 'StyleMirror',
        eyebrow: 'AI-enabled team project',
        tagline: 'An AI Virtual Try-On concept centered on UX clarity and intuitive mobile interactions.',
        summary:
            'Built an AI-driven e-commerce concept with a strong emphasis on user testing, prototype iteration, and translating complex product ideas into approachable flows.',
        role: 'Frontend Engineer (Team Project)',
        stack: ['React Native', 'Fal AI API', 'Express', 'Firebase', 'Figma', 'User Testing'],
        highlights: [
            'Designed around user confidence and flow clarity in a technically ambitious concept.',
            'Integrated AI-powered  functionality into a mobile-first experience.',
            'Used prototyping and user feedback to improve usability decisions.',
        ],
        links: {
            github: 'https://github.com/Yogesh914/StyleMirror',
        },
    },
    // {
    //     title: 'MediScan',
    //     eyebrow: 'Private mobile product',
    //     tagline: 'An OCR-based workflow tool that captures and formats medical equipment serial numbers for faster reporting.',
    //     summary:
    //         'Built a solo mobile utility to reduce manual transcription work for medical-field staff by scanning serial numbers, formatting them automatically, and preparing them for export.',
    //     role: 'Sole developer across mobile product and OCR workflow design',
    //     stack: ['React Native', 'TypeScript', 'OCR', 'Expo', 'EAS', 'AsyncStorage'],
    //     highlights: [
    //         'Used OCR to scan serial numbers from medical equipment and reduce repetitive manual entry.',
    //         'Automatically formatted captured serials into a cleaner structure ready to send to supervisors.',
    //         'Designed the workflow around speed and usability for workers handling repetitive equipment logging tasks.',
    //     ],
    //     links: {},
    // },
];
