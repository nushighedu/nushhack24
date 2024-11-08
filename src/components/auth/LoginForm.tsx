import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LocalStore } from '@/lib/store';
import type { User, UserType } from '@/lib/types';
import {
    Building2,
    Briefcase,
    User as UserIcon,
    Building,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

interface OrgDetails {
    name: string;
    description: string;
}

export function LoginForm({
    onLogin
}: {
    onLogin: (user: User) => void;
}) {
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState<UserType>('government');
    const [step, setStep] = useState<'type' | 'details'>('type');
    const [error, setError] = useState('');
    const [orgDetails, setOrgDetails] = useState<OrgDetails>({
        name: '',
        description: '',
    });

    const validateForm = (): boolean => {
        if (!username.trim()) {
            setError('Username is required');
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        let user = LocalStore.getUser(username);

        if (user && user.userType !== userType) {
            setError(`Username already exists as a ${user.userType}`);
            return;
        }

        if (!user) {
            if (userType === 'government') {
                user = {
                    username,
                    userType: 'government',
                    credits: 3000,
                    joinedAt: new Date().toISOString(),
                    stats: {
                        contractsWon: 0,
                        totalProfit: 0,
                        successRate: 0,
                        reputation: 50,
                        activeContracts: [],
                        completedContracts: []
                    },
                    company: {
                        name: orgDetails.name,
                        description: orgDetails.description,
                        expertise: [],
                        yearsOfExperience: 0,
                        certifications: []
                    }
                };
            } else {
                user = {
                    username,
                    userType: 'business',
                    credits: 10000,
                    joinedAt: new Date().toISOString(),
                    stats: {
                        contractsCreated: 0,
                        totalSpent: 0,
                        completionRate: 0,
                        averageSustainability: 0,
                        activeContracts: [],
                        completedContracts: []
                    },
                    organization: {
                        name: orgDetails.name,
                        description: orgDetails.description,
                        sector: 'Infrastructure',
                        budget: 10000,
                        sustainabilityGoal: 80
                    }
                };
            }
            LocalStore.setUser(username, user);
        }

        onLogin(user);
    };

    const renderRoleSelector = () => (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Contract Nexus
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Singapore&apos;s Premier Infrastructure Bidding Platform
                    </p>
                </div>

                <Card className="mt-8 bg-gray-800/50 backdrop-blur-sm border-0">
                    <CardHeader>
                        <CardTitle className="text-xl">Choose your role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={userType}
                            onValueChange={(value) => setUserType(value as UserType)}
                            className="space-y-4"
                        >
                            <div
                                className={`
                  relative flex items-center space-x-4 p-4 rounded-xl border border-gray-700
                  transition-all duration-200 cursor-pointer
                  ${userType === 'government' ? 'bg-blue-500/10 border-blue-500/50' : 'hover:bg-gray-700/30'}
                `}
                            >
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

                            <div
                                className={`
                  relative flex items-center space-x-4 p-4 rounded-xl border border-gray-700
                  transition-all duration-200 cursor-pointer
                  ${userType === 'business' ? 'bg-blue-500/10 border-blue-500/50' : 'hover:bg-gray-700/30'}
                `}
                            >
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
            </div>
        </div>
    );

    const renderDetailsForm = () => (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="max-w-md w-full space-y-8">
                <Button
                    variant="ghost"
                    onClick={() => setStep('type')}
                    className="mb-4 hover:bg-gray-800/50"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <Card className="bg-gray-800/50 backdrop-blur-sm border-0">
                    <CardHeader>
                        <CardTitle>
                            {userType === 'government' ? (
                                <div className="flex items-center">
                                    <Building2 className="w-5 h-5 mr-2" />
                                    Contractor Details
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Briefcase className="w-5 h-5 mr-2" />
                                    Organization Details
                                </div>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="username"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => {
                                            setError('');
                                            setUsername(e.target.value);
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="orgName">
                                    {userType === 'government' ? 'Company Name' : 'Organization Name'}
                                </Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="orgName"
                                        placeholder={userType === 'government' ? 'Enter company name' : 'Enter organization name'}
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
                            >
                                Enter Game
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return step === 'type' ? renderRoleSelector() : renderDetailsForm();
}