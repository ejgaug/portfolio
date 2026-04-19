import { HiddenAppRouteName } from '../navigation';

export type HiddenAppKey = 'mediscan' | 'recipescalerpro';
export type HiddenAppPage = 'privacy' | 'support';

export type MetaPill = {
    label: string;
    value: string;
};

export type FaqItem = {
    answer: string;
    question: string;
};

export type PolicySection = {
    bullets?: string[];
    paragraphs: string[];
    title: string;
};

type HiddenAppTheme = {
    accent: string;
    accentSoft: string;
    background: string;
    border: string;
    panel: string;
    text: string;
    textMuted: string;
};

type HiddenAppRouteMap = {
    privacy: HiddenAppRouteName;
    support: HiddenAppRouteName;
};

export type HiddenAppContent = {
    name: string;
    routes: HiddenAppRouteMap;
    slug: HiddenAppKey;
    support: {
        description: string;
        deviceFieldLabel: string;
        devicePlaceholder: string;
        faqItems: FaqItem[];
        formIntro: string;
        messagePlaceholder: string;
        metaPills: MetaPill[];
        title: string;
        topicPlaceholder: string;
    };
    tagline: string;
    theme: HiddenAppTheme;
    privacy: {
        description: string;
        effectiveDate: string;
        metaPills: MetaPill[];
        sections: PolicySection[];
        title: string;
    };
};

export const SUPPORT_EMAIL = 'elijgauger@gmail.com';

// Centralize app-specific support/privacy copy so each route screen stays focused on navigation.
export const hiddenAppContent: Record<HiddenAppKey, HiddenAppContent> = {
    mediscan: {
        slug: 'mediscan',
        name: 'MediScan',
        tagline: 'Serial-number capture and CSV-ready field reporting for medical equipment workflows.',
        routes: {
            privacy: 'MediScanPrivacy',
            support: 'MediScanSupport',
        },
        theme: {
            background: '#edf4fb',
            panel: '#ffffff',
            border: '#c8d8eb',
            accent: '#1f4d87',
            accentSoft: '#dce8f8',
            text: '#13253c',
            textMuted: '#5d6f88',
        },
        support: {
            title: 'Support for MediScan',
            description:
                'Use this page for help with scanning sessions, barcode capture, CSV sharing, device permissions, or workflow questions tied to MediScan.',
            formIntro:
                'This form prepares an email draft so you can send detailed questions, bug reports, workflow notes, or support requests for MediScan.',
            topicPlaceholder: 'Barcode scan issue, CSV export question, session workflow help...',
            deviceFieldLabel: 'Device and Build',
            devicePlaceholder: 'iPhone model, iPad model, iOS version, app version...',
            messagePlaceholder:
                'Describe what happened, what you expected, and any steps we should use to reproduce the issue.',
            metaPills: [
                { label: 'Support Type', value: 'Email Support' },
                { label: 'App Focus', value: 'Barcode + CSV' },
                { label: 'FAQ Topics', value: '6 common questions' },
            ],
            faqItems: [
                {
                    question: 'Why is a serial number barcode not scanning?',
                    answer:
                        'Make sure the barcode is well lit, fully inside the scan frame, and held steady long enough for MediScan to lock on. If the label is damaged or the barcode will not scan, you can still add the serial number manually during the session flow.',
                },
                {
                    question: 'Can I edit the location, serial number, or notes after a scan is captured?',
                    answer:
                        'Yes. MediScan includes a confirmation step for each captured scan so you can review and edit the serial number, location, and notes before it becomes part of the session.',
                },
                {
                    question: 'Where are my sessions stored?',
                    answer:
                        'In-progress and completed sessions are stored locally on your device so they can persist between launches. If you remove the app or clear that local data, those saved sessions may no longer be available.',
                },
                {
                    question: 'How does CSV export work?',
                    answer:
                        'When you choose to export a finished session, MediScan prepares a CSV file and opens the native share sheet. From there you can send it through email, save it to Files, or share it using other supported apps on your device.',
                },
                {
                    question: 'Why is the share sheet not opening?',
                    answer:
                        'Some build types can limit native sharing support. If sharing fails, update to the latest build and try again. Include your device details and what happened in the support form so the issue can be investigated.',
                },
                {
                    question: 'What permissions does MediScan need?',
                    answer:
                        'MediScan primarily needs camera access so it can read serial-number barcodes. If camera permission is denied, scanning will not start until access is re-enabled from your device settings.',
                },
            ],
        },
        privacy: {
            title: 'MediScan Privacy Policy',
            description:
                'This policy explains how MediScan handles scan-session data, camera access, CSV exports, and support messages.',
            effectiveDate: 'April 18, 2026',
            metaPills: [
                { label: 'Effective Date', value: 'April 18, 2026' },
                { label: 'Accounts', value: 'Not required' },
                { label: 'Storage', value: 'Local device storage' },
            ],
            sections: [
                {
                    title: '1. Overview',
                    paragraphs: [
                        'MediScan is designed to help users capture serial numbers from device labels, organize scans into sessions, add location or notes, and export those results as CSV files.',
                        'This Privacy Policy describes how information is handled when you use MediScan and when you contact support.',
                    ],
                },
                {
                    title: '2. Information You Enter or Capture',
                    paragraphs: [
                        'MediScan may process the information you intentionally place into the app, such as session titles, serial numbers, location details, notes, and barcode data captured during a scan.',
                        'That information is used to power the app experience you requested, including review screens, saved session history, and CSV export preparation.',
                    ],
                },
                {
                    title: '3. Device Permissions and Local Storage',
                    paragraphs: [
                        'MediScan requests camera access so the app can scan barcodes on equipment labels.',
                        'Session data is stored locally on your device so in-progress and completed scan sessions remain available between launches.',
                    ],
                    bullets: [
                        'MediScan does not require an account to use core app features.',
                        'Session information remains on the device unless you choose to share or export it.',
                    ],
                },
                {
                    title: '4. CSV Exports and Sharing',
                    paragraphs: [
                        'When you choose to export a session, MediScan generates a CSV file in temporary device storage and hands that file to the native share sheet on your device.',
                        'Once you share a CSV through email, messaging, cloud storage, or another third-party app, that service handles the shared file according to its own terms and privacy practices.',
                    ],
                },
                {
                    title: '5. Support Communications',
                    paragraphs: [
                        'If you contact support by email, only the information you include in your message is received, such as your question, device details, and any screenshots or descriptions you choose to send.',
                        'Support emails are used to respond to your request, troubleshoot issues, and improve the app experience.',
                    ],
                },
                {
                    title: '6. Data Retention and Your Choices',
                    paragraphs: [
                        'You can manage or remove saved sessions from within the app workflow, and you can also remove the app from your device if you no longer want local session data stored there.',
                        'You control whether to share exported CSV files with outside services or recipients.',
                    ],
                },
                {
                    title: '7. Policy Updates',
                    paragraphs: [
                        'This policy may be updated from time to time as MediScan evolves. Updated versions will be posted on this page with a revised effective date.',
                    ],
                },
                {
                    title: '8. Contact',
                    paragraphs: [
                        'For privacy or support questions, submit a support form on the support page.',
                    ],
                },
            ],
        },
    },
    recipescalerpro: {
        slug: 'recipescalerpro',
        name: 'Recipe Scaler Pro',
        tagline: 'Recipe OCR, ingredient scaling, kitchen math, and Apple Watch recipe viewing in one cooking workflow.',
        routes: {
            privacy: 'RecipeScalerProPrivacy',
            support: 'RecipeScalerProSupport',
        },
        theme: {
            background: '#f7efe3',
            panel: '#fffaf3',
            border: '#dbc1a0',
            accent: '#8b582a',
            accentSoft: '#f3dcc0',
            text: '#2f1d10',
            textMuted: '#78614b',
        },
        support: {
            title: 'Support for Recipe Scaler Pro',
            description:
                'Use this page for help with recipe scanning, kitchen conversions, saved recipes, Apple Watch sync, permissions, or troubleshooting inside Recipe Scaler Pro.',
            formIntro:
                'This form creates an email draft for Recipe Scaler Pro questions, bug reports, feature requests, or feedback about recipe scaling and saved recipes.',
            topicPlaceholder: 'OCR issue, scaling question, Apple Watch sync help...',
            deviceFieldLabel: 'Device and App Details',
            devicePlaceholder: 'iPhone model, Apple Watch model, iOS/watchOS version, app version...',
            messagePlaceholder:
                'Tell us what recipe flow you were using, what happened, and what result you expected to see.',
            metaPills: [
                { label: 'Support Type', value: 'Email Support' },
                { label: 'Core Tools', value: 'OCR + Scaling' },
                { label: 'FAQ Topics', value: '6 common questions' },
            ],
            faqItems: [
                {
                    question: 'Why did my scanned recipe need manual cleanup?',
                    answer:
                        'OCR can misread handwritten notes, decorative fonts, or mixed fractions. Recipe Scaler Pro is built so you can review the ingredient list, edit any line, remove mistakes, and confirm the final recipe before scaling it.',
                },
                {
                    question: 'Can I use the app without scanning a photo?',
                    answer:
                        'Yes. The app includes kitchen conversion tools and supports reviewing/editing recipe data after import, so you are not locked into a single scan-only workflow.',
                },
                {
                    question: 'Where are my saved recipes stored?',
                    answer:
                        'Saved recipes are stored locally on your device. The app also mirrors saved recipes to the Apple Watch companion app for read-only viewing when the watch is paired and sync is available.',
                },
                {
                    question: 'Why are my Apple Watch recipes missing or out of date?',
                    answer:
                        'Open the iPhone app first and confirm the recipe is saved there. The Apple Watch experience is read-only and depends on the phone app syncing the latest saved recipe data to the paired watch.',
                },
                {
                    question: 'Why do scaled measurements sometimes change units?',
                    answer:
                        'Recipe Scaler Pro may present clearer kitchen-friendly measurements when a scaled amount is easier to understand in another unit. That behavior is meant to make results faster to use while cooking.',
                },
                {
                    question: 'What permissions might Recipe Scaler Pro request?',
                    answer:
                        'The app may request camera access to capture recipe photos and photo-library access when you import an existing image for OCR. If either permission is denied, scanning from that source will not work until access is restored.',
                },
            ],
        },
        privacy: {
            title: 'Recipe Scaler Pro Privacy Policy',
            description:
                'This policy explains how Recipe Scaler Pro handles recipe scans, saved recipes, preferences, Apple Watch sync, and support messages.',
            effectiveDate: 'April 18, 2026',
            metaPills: [
                { label: 'Effective Date', value: 'April 18, 2026' },
                { label: 'Accounts', value: 'Not required' },
                { label: 'Storage', value: 'Local + paired watch sync' },
            ],
            sections: [
                {
                    title: '1. Overview',
                    paragraphs: [
                        'Recipe Scaler Pro helps users scan recipes, extract ingredient text, scale servings, perform kitchen conversions, save recipes locally, and view saved recipes on a paired Apple Watch companion app.',
                        'This Privacy Policy explains how Recipe Scaler Pro handles information that is processed while you use those features and when you contact support.',
                    ],
                },
                {
                    title: '2. Recipe Content You Choose to Provide',
                    paragraphs: [
                        'Recipe Scaler Pro may process recipe photos, imported recipe images, typed ingredient edits, serving sizes, saved recipes, and other cooking-related content you intentionally provide while using the app.',
                        'That information is used to support OCR extraction, ingredient parsing, recipe scaling, recipe editing, and saved-recipe viewing inside the app experience.',
                    ],
                },
                {
                    title: '3. Device Permissions and On-Device Storage',
                    paragraphs: [
                        'Recipe Scaler Pro may request access to your camera when you capture a new recipe image and may request photo-library access when you choose to import an existing recipe photo.',
                        'Saved recipes and theme preferences are stored locally on your device so they remain available between app launches.',
                    ],
                    bullets: [
                        'Recipe Scaler Pro does not require an account for core functionality.',
                        'You control whether recipe images are captured, imported, edited, saved, or removed.',
                    ],
                },
                {
                    title: '4. OCR Processing and Recipe Review',
                    paragraphs: [
                        'Recipe Scaler Pro uses OCR and parsing tools to turn recipe images into editable ingredient data. OCR output can be imperfect, which is why the app includes review and editing steps before you commit to a saved recipe.',
                        'Recipe content is processed to provide the features you requested, including ingredient cleanup, serving-size adjustments, and quick kitchen math.',
                    ],
                },
                {
                    title: '5. Apple Watch Companion Sync',
                    paragraphs: [
                        'If you use the Apple Watch companion app, saved recipes from the iPhone app may be synced to the paired watch so they can be viewed there in read-only form.',
                        'That watch sync is intended to mirror recipe data you already chose to save in the iPhone app.',
                    ],
                },
                {
                    title: '6. Support Communications',
                    paragraphs: [
                        'If you send an email through the support form or contact support directly, only the information you decide to include is received, such as your question, device details, and any additional context you provide.',
                        'Support messages are used to answer questions, troubleshoot issues, and improve the Recipe Scaler Pro experience.',
                    ],
                },
                {
                    title: '7. Data Choices and Retention',
                    paragraphs: [
                        'You can edit or delete saved recipes within the app. If you remove the app, locally stored recipe data may also be removed from the device, subject to the device platform behavior.',
                        'Paired-watch recipe availability depends on the saved data currently synced from your iPhone app.',
                    ],
                },
                {
                    title: '8. Policy Updates and Contact',
                    paragraphs: [
                        'This Privacy Policy may be updated as Recipe Scaler Pro changes over time. Updated versions will appear on this page with a revised effective date.',
                        'For privacy or support questions, submit a support form on the support page.',
                    ],
                },
            ],
        },
    },
};
