'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Home from '../features/Home';
import { GlassmorphismNavbar, NavItem } from './GlassmorphismNavbar';
import Footer from './Footer';

const tabLoading = () => (
    <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
    </div>
);

// Only the default tab (Home) is in the initial bundle; every other screen
// loads on demand so recharts, journal code, etc. stay out of the first paint.
const TradeHistory = dynamic(() => import('../features/TradeHistory'), { loading: tabLoading });
const Journal = dynamic(() => import('../features/Journal'), { loading: tabLoading });
const ProfileSettings = dynamic(() => import('../features/ProfileSettings'), { loading: tabLoading });
const AboutScreen = dynamic(() => import('../features/AboutScreen'), { loading: tabLoading });
const HelpScreen = dynamic(() => import('../features/HelpScreen'), { loading: tabLoading });
const RoadmapScreen = dynamic(() => import('../features/RoadmapScreen'), { loading: tabLoading });

export type TabType = 'dashboard' | 'lookup' | 'journal' | 'appdocs' | 'help' | 'roadmap' | 'profile-settings';

const DEFAULT_TAB: TabType = 'dashboard';
const PERSISTABLE_TABS: TabType[] = ['dashboard', 'lookup', 'journal', 'appdocs', 'help', 'roadmap', 'profile-settings'];

/**
 * TabNavigation Component
 *
 * PURPOSE:
 * The primary navigation controller for the Deriverse application.
 * Manages the active tab state and coordinates between high-level views
 * like Dashboard, Journal, and Profile.
 *
 * FEATURES:
 * - Tab and analyzed wallet live in the URL (?tab=...&wallet=...), so the
 *   browser Back button, refresh, and deep links all work
 * - localStorage keeps the last tab as a fallback for bare visits
 * - Global event listeners for cross-component navigation
 * - Network state management ('devnet' | 'mainnet' | 'mock')
 */
function TabNavigationInner() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get('tab');
    const activeTab: TabType = (PERSISTABLE_TABS as string[]).includes(tabParam ?? '')
        ? (tabParam as TabType)
        : DEFAULT_TAB;
    const analyzingWallet = searchParams.get('wallet');
    const [network, setNetwork] = useState<'devnet' | 'mainnet' | 'mock'>(analyzingWallet ? 'devnet' : 'mock');

    const navigateWithParams = useCallback((mutate: (params: URLSearchParams) => void, replace = false) => {
        const params = new URLSearchParams(searchParams.toString());
        mutate(params);
        const qs = params.toString();
        const url = qs ? `${pathname}?${qs}` : pathname;
        if (replace) {
            router.replace(url, { scroll: false });
        } else {
            router.push(url, { scroll: false });
        }
    }, [router, pathname, searchParams]);

    const setActiveTab = useCallback((tab: TabType) => {
        navigateWithParams((params) => {
            if (tab === DEFAULT_TAB) {
                params.delete('tab');
            } else {
                params.set('tab', tab);
            }
        });
    }, [navigateWithParams]);

    // One-time migration: restore the last tab from localStorage when the URL
    // doesn't specify one (bare visit), without adding a history entry.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (tabParam) return;
        const persistedRaw = window.localStorage.getItem('deriverse.activeTab');
        const migrated = persistedRaw === 'settings' ? 'profile-settings' : persistedRaw;
        if (migrated && migrated !== DEFAULT_TAB && (PERSISTABLE_TABS as string[]).includes(migrated)) {
            navigateWithParams((params) => params.set('tab', migrated), true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleExternalTabChange = (event: Event) => {
            const nextTab = (event as CustomEvent<TabType>).detail;
            if (nextTab) {
                setActiveTab(nextTab);
            }
        };

        window.addEventListener('deriverse:set-active-tab', handleExternalTabChange as EventListener);
        return () => {
            window.removeEventListener('deriverse:set-active-tab', handleExternalTabChange as EventListener);
        };
    }, [setActiveTab]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('deriverse.activeTab', activeTab);
    }, [activeTab]);

    // Clean navigation items configuration
    const navItems: NavItem[] = [
        {
            title: 'Analytics',
            href: '#dashboard',
            category: 'main',
            onClick: () => setActiveTab('dashboard')
        },
        {
            title: 'Journal',
            href: '#journal',
            category: 'main',
            onClick: () => setActiveTab('journal')
        },
        {
            title: 'Wallet(s)',
            href: '#lookup',
            category: 'main',
            onClick: () => setActiveTab('lookup')
        },
        {
            title: 'About',
            href: '#appdocs',
            category: 'dropdown',
            onClick: () => setActiveTab('appdocs')
        },
        {
            title: 'Help',
            href: '#help',
            category: 'dropdown',
            onClick: () => setActiveTab('help')
        },
        {
            title: 'Roadmap',
            href: '#roadmap',
            category: 'dropdown',
            onClick: () => setActiveTab('roadmap')
        },
    ];

    const handleSwitchToRealData = (walletAddress: string) => {
        setNetwork('devnet');
        navigateWithParams((params) => {
            params.set('wallet', walletAddress);
            params.delete('tab');
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Home network={network} analyzingWallet={analyzingWallet} onNavigateToLookup={() => setActiveTab('lookup')} />;
            case 'lookup':
                return <TradeHistory onSwitchToRealData={handleSwitchToRealData} />;
            case 'journal':
                return <Journal network={network} analyzingWallet={analyzingWallet} onNavigateToLookup={() => setActiveTab('lookup')} />;
            case 'appdocs':
                return <AboutScreen />;
            case 'help':
                return <HelpScreen />;
            case 'roadmap':
                return <RoadmapScreen />;
            case 'profile-settings':
                return <ProfileSettings />;
            default:
                return null;
        }
    };

    const getNetworkName = (net: 'devnet' | 'mainnet' | 'mock') => {
        switch (net) {
            case 'mainnet': return 'On Mainnet';
            case 'devnet': return 'On Devnet';
            default: return 'On Mock Data';
        }
    };

    return (
        <div className="min-h-screen text-white">
            {/* New Glassmorphism Navigation */}
            <GlassmorphismNavbar
                logo="/assets/Deriverse_Journal_Logo.png"
                navItems={navItems}
                activePath={`#${activeTab}`}
                networkStatus={{
                    name: getNetworkName(network),
                    variant: network,
                    isActive: true
                }}
                onNetworkChange={setNetwork}
                onProfileSettingsClick={() => setActiveTab('profile-settings')}
                onLogoClick={() => setActiveTab('dashboard')}
                className="mb-8"
            />

            {/* Content Area - Padding top added to account for fixed navbar */}
            <div className="pt-36 p-4 max-w-7xl mx-auto">
                {renderTabContent()}

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}

// useSearchParams requires a Suspense boundary during static prerendering.
export default function TabNavigation() {
    return (
        <Suspense fallback={null}>
            <TabNavigationInner />
        </Suspense>
    );
}
