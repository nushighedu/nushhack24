import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { User, UserType } from '@/lib/types';
import { Building2, Briefcase, User as UserIcon, Building, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

// Initialize Firebase once at module level
const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getDatabase(app);
const auth = getAuth(app);

interface OrgDetails {
    name: string;
    description: string;
}

export function LoginForm({ onLogin }: { onLogin: (user: User) => void; }) {
    const [orgDetails, setOrgDetails] = useState<OrgDetails>({ name: '', description: '' });
    const [userType, setUserType] = useState<UserType>('government');
    const [step, setStep] = useState<'type' | 'details'>('type');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setUserId('');
        setPassword('');
        setError('');
        setOrgDetails({ name: '', description: '' });
        setStep('type');
    };

    const validateSignUpForm = (): boolean => {
        if (!userId.trim()) {
            setError('Username is required');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!orgDetails.name.trim()) {
            setError('Organization name is required');
            return false;
        }
        if (!orgDetails.description.trim()) {
            setError('Description is required');
            return false;
        }
        return true;
    };

    const validateSignInForm = (): boolean => {
        if (!userId.trim()) {
            setError('Username is required');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        return true;
    };

    const createUserData = (uid: string): User => {
        const baseData = {
            username: userId,
            userType,
            credits: userType === 'government' ? 3000 : 10000,
            joinedAt: new Date().toISOString(),
            contractsWon: [],
        };

        if (userType === 'government') {
            return {
                ...baseData,
                userType: 'government',
                stats: {
                    contractsActive: [],
                    contractsTotal: 0,
                    totalSpent: 0,
                    winRate: 0,
                },
                organization: {
                    name: orgDetails.name,
                    description: orgDetails.description,
                    sector: 'Observer',
                    budget: 0,
                    sustainabilityGoal: 80
                }
            } as User;
        } else {
            return {
                ...baseData,
                userType: 'business',
                stats: {
                    sustainabilityScore: 0,
                    contractsCreated: 0,
                    totalProfit: 0,
                    contractCompletionRate: 0,
                    activeContracts: [],
                    completedContracts: [],
                },
                company: {
                    name: orgDetails.name,
                    description: orgDetails.description,
                    expertise: [],
                    yearsOfExperience: 0,
                    certifications: [],
                }
            } as User;
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateSignUpForm()) return;

        setIsLoading(true);
        try {
            const email = `${userId}@gmail.com`;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userData = createUserData(userCredential.user.uid);

            await set(ref(db, `users/${userCredential.user.uid}`), userData);
            onLogin(userData);
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.code === 'auth/email-already-in-use'
                ? 'Username already exists'
                : 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateSignInForm()) return;

        setIsLoading(true);
        try {
            const email = `${userId}@gmail.com`;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const userSnapshot = await get(ref(db, `users/${userCredential.user.uid}`));
            const userData = userSnapshot.val() as User;

            if (!userData) {
                throw new Error('User data not found');
            }

            onLogin(userData);
        } catch (error: any) {
            console.error('Sign in error:', error);
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    const renderSignInForm = () => (
        <form onSubmit={handleSignIn} className="space-y-4">
            <div>
                <Label htmlFor="signin-username">Username</Label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        id="signin-username"
                        placeholder="Enter your username"
                        value={userId}
                        onChange={(e) => {
                            setError('');
                            setUserId(e.target.value);
                        }}
                        className="pl-10"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                            setError('');
                            setPassword(e.target.value);
                        }}
                        className="pl-10"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
            >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </form>
    );

    const renderSignUpContent = () => (
        step === 'type' ? renderRoleSelector() : renderDetailsForm()
    );

    const renderDetailsForm = () => (
        <>
            <Button
                variant="ghost"
                onClick={() => setStep('type')}
                className="mb-4 hover:bg-gray-800/50"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <Card className="dark:bg-gray-800/50 backdrop-blur-sm border-0">
                <CardHeader>
                    <CardTitle>
                        {userType === 'government' ? (
                            <div className="flex items-center">
                                <Building2 className="w-5 h-5 mr-2" />
                                Government Agency Details
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Briefcase className="w-5 h-5 mr-2" />
                                Business/Organization Details
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    value={userId}
                                    onChange={(e) => {
                                        setError('');
                                        setUserId(e.target.value);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setError('');
                                        setPassword(e.target.value);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="orgName">
                                {userType === 'government' ? 'Agency Name' : 'Company Name'}
                            </Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="orgName"
                                    placeholder={userType === 'government' ? 'Enter agency name' : 'Enter company name'}
                                    value={orgDetails.name}
                                    onChange={(e) => {
                                        setError('');
                                        setOrgDetails({ ...orgDetails, name: e.target.value });
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of your organization"
                                value={orgDetails.description}
                                onChange={(e) => {
                                    setError('');
                                    setOrgDetails({ ...orgDetails, description: e.target.value });
                                }}
                                className="h-24 resize-none"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );

    const renderRoleSelector = () => (
        <Card className="dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <CardHeader>
                <CardTitle className="text-xl">Choose your role</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={userType}
                    onValueChange={(value) => setUserType(value as UserType)}
                    className="space-y-4"
                >
                    <div className={`
                        relative flex items-center space-x-4 p-4 rounded-xl border border-gray-700
                        transition-all duration-200 cursor-pointer
                        ${userType === 'government' ? 'bg-blue-500/10 border-blue-500/50' : 'hover:bg-gray-700/30'}
                    `}>
                        <RadioGroupItem value="government" id="government" />
                        <Label htmlFor="government" className="flex-1 cursor-pointer">
                            <div className="flex items-center mb-1">
                                <Building2 className="w-4 h-4 mr-2" />
                                <span className="font-medium">Government Agency</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Bid on contracts to modernise system infrastructure
                            </p>
                        </Label>
                    </div>

                    <div className={`
                        relative flex items-center space-x-4 p-4 rounded-xl border border-gray-700
                        transition-all duration-200 cursor-pointer
                        ${userType === 'business' ? 'bg-blue-500/10 border-blue-500/50' : 'hover:bg-gray-700/30'}
                    `}>
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="flex-1 cursor-pointer">
                            <div className="flex items-center mb-1">
                                <Briefcase className="w-4 h-4 mr-2" />
                                <span className="font-medium">Business/Organization</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Create contracts to modernise Government systems
                            </p>
                        </Label>
                    </div>
                </RadioGroup>

                <Button
                    onClick={() => setStep('details')}
                    className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
                >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 dark:bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Contract Nexus
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Singapore&apos;s Premier Infrastructure Bidding Platform
                    </p>
                </div>

                <Card className="dark:bg-gray-800/50 backdrop-blur-sm border-0">
                    <CardContent className="pt-6">
                        <Tabs
                            defaultValue="signin"
                            className="w-full"
                            onValueChange={() => {
                                resetForm();
                                setError('');
                            }}
                        >
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="signin">Sign In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signin">
                                {renderSignInForm()}
                            </TabsContent>

                            <TabsContent value="signup">
                                {renderSignUpContent()}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}