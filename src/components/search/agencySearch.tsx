import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Search, Building2, Globe, Filter } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Agency {
    name: string;
    focus: string;
    sector: string;
    platform: string;
}

// This would be imported from your CSV
const agencies: Agency[] = [
    {
        "name": "Accounting and Corporate Regulatory Authority (ACRA)",
        "focus": "Regulates corporate affairs, accounting, and business compliance",
        "sector": "Regulation",
        "platform": "Corporate Registration Portal"
    },
    {
        "name": "Agency for Science, Technology and Research (A*STAR)",
        "focus": "Research and development in science and technology",
        "sector": "Research",
        "platform": "Research Portal"
    },
    {
        "name": "Board of Architects (BOA)",
        "focus": "Regulates architects and architectural practice",
        "sector": "Regulation",
        "platform": "Professional Registration Portal"
    },
    {
        "name": "Building and Construction Authority (BCA)",
        "focus": "Oversees building construction standards and safety",
        "sector": "Regulation",
        "platform": "Construction Standards Portal"
    },
    {
        "name": "Central Provident Fund Board (CPFB)",
        "focus": "Manages Singapore's national pension fund",
        "sector": "Social Welfare",
        "platform": "Social Security Portal"
    },
    {
        "name": "Civil Aviation Authority of Singapore (CAAS)",
        "focus": "Regulates civil aviation and air traffic in Singapore",
        "sector": "Regulation",
        "platform": "Aviation Regulatory Portal"
    },
    {
        "name": "Civil Service College (CSC)",
        "focus": "Provides training and development for civil service employees",
        "sector": "Education",
        "platform": "Training Portal"
    },
    {
        "name": "Competition and Consumer Commission of Singapore (CCCS)",
        "focus": "Promotes fair competition and protects consumer interests",
        "sector": "Regulation",
        "platform": "Competition Regulation Portal"
    },
    {
        "name": "Council for Estate Agencies (CEA)",
        "focus": "Regulates real estate agents and agencies",
        "sector": "Regulation",
        "platform": "Real Estate Regulation Portal"
    },
    {
        "name": "Defence Science and Technology Agency (DSTA)",
        "focus": "Provides technological and scientific support to Singapore's defense",
        "sector": "Research",
        "platform": "Defense Technology Portal"
    },
    {
        "name": "Economic Development Board (EDB)",
        "focus": "Promotes industrial growth and innovation in Singapore",
        "sector": "Economic Development",
        "platform": "Business Development Portal"
    },
    {
        "name": "Energy Market Authority (EMA)",
        "focus": "Regulates the energy sector, including electricity and gas",
        "sector": "Regulation",
        "platform": "Energy Regulation Portal"
    },
    {
        "name": "Enterprise Singapore (EnterpriseSG)",
        "focus": "Supports the growth of Singapore's enterprises",
        "sector": "Business Development",
        "platform": "Enterprise Support Portal"
    },
    {
        "name": "Gambling Regulatory Authority of Singapore (GRA)",
        "focus": "Regulates gambling activities in Singapore",
        "sector": "Regulation",
        "platform": "Gambling Regulation Portal"
    },
    {
        "name": "Government Technology Agency (GovTech)",
        "focus": "Drives digital transformation within the public sector",
        "sector": "Technology",
        "platform": "Government Digital Services Portal"
    },
    {
        "name": "Health Promotion Board (HPB)",
        "focus": "Promotes public health and wellness initiatives",
        "sector": "Public Health",
        "platform": "Health Services Portal"
    },
    {
        "name": "Health Sciences Authority (HSA)",
        "focus": "Regulates healthcare products, including drugs and medical devices",
        "sector": "Regulation",
        "platform": "Health Regulatory Portal"
    },
    {
        "name": "Home Team Science and Technology Agency (HTX)",
        "focus": "Innovates for Singapore's civil and public safety",
        "sector": "Technology",
        "platform": "Public Safety Tech Portal"
    },
    {
        "name": "Hotels Licensing Board (HLB)",
        "focus": "Regulates hotel operations and standards",
        "sector": "Regulation",
        "platform": "Hotel Licensing Portal"
    },
    {
        "name": "Housing & Development Board (HDB)",
        "focus": "Develops public housing and urban planning",
        "sector": "Urban Development",
        "platform": "Housing Development Portal"
    },
    {
        "name": "Info-communications Media Development Authority (IMDA)",
        "focus": "Regulates media, telecommunications, and IT industries",
        "sector": "Regulation",
        "platform": "Media Regulation Portal"
    },
    {
        "name": "Inland Revenue Authority of Singapore (IRAS)",
        "focus": "Administers taxes and revenue collection",
        "sector": "Finance",
        "platform": "Tax Portal"
    },
    {
        "name": "Institute of Technical Education (ITE)",
        "focus": "Provides vocational education and training",
        "sector": "Education",
        "platform": "Learning Management System"
    },
    {
        "name": "Intellectual Property Office of Singapore (IPOS)",
        "focus": "Oversees intellectual property protection",
        "sector": "Regulation",
        "platform": "IP Registration Portal"
    },
    {
        "name": "ISEAS-Yusof Ishak Institute (ISEAS)",
        "focus": "Research on social sciences and Southeast Asia",
        "sector": "Research",
        "platform": "Research Portal"
    },
    {
        "name": "JTC Corporation (JTC)",
        "focus": "Develops industrial infrastructure and estates",
        "sector": "Urban Development",
        "platform": "Industrial Development Portal"
    },
    {
        "name": "Land Surveyors Board (LSB)",
        "focus": "Regulates land surveying professionals",
        "sector": "Regulation",
        "platform": "Professional Licensing Portal"
    },
    {
        "name": "Land Transport Authority (LTA)",
        "focus": "Oversees land transport and public transportation",
        "sector": "Regulation",
        "platform": "Transport Regulation Portal"
    },
    {
        "name": "Majlis Ugama Islam Singapura (MUIS)",
        "focus": "Regulates Islamic affairs in Singapore",
        "sector": "Regulation",
        "platform": "Religious Affairs Portal"
    },
    {
        "name": "Maritime and Port Authority of Singapore (MPA)",
        "focus": "Regulates maritime industry and ports",
        "sector": "Regulation",
        "platform": "Maritime Services Portal"
    },
    {
        "name": "Monetary Authority of Singapore (MAS)",
        "focus": "Oversees Singapore's financial system and monetary policy",
        "sector": "Finance",
        "platform": "Financial Services Portal"
    },
    {
        "name": "Nanyang Polytechnic (NYP)",
        "focus": "Provides polytechnic education and training",
        "sector": "Education",
        "platform": "Student Portal"
    },
    {
        "name": "National Arts Council (NAC)",
        "focus": "Supports and promotes the arts in Singapore",
        "sector": "Culture",
        "platform": "Arts Development Portal"
    },
    {
        "name": "National Council of Social Service (NCSS)",
        "focus": "Supports social service organizations and programs",
        "sector": "Social Welfare",
        "platform": "Social Services Portal"
    },
    {
        "name": "National Environment Agency (NEA)",
        "focus": "Regulates environmental health and sustainability",
        "sector": "Environment",
        "platform": "Environmental Services Portal"
    },
    {
        "name": "National Heritage Board (NHB)",
        "focus": "Manages heritage and museums",
        "sector": "Culture",
        "platform": "Heritage Services Portal"
    },
    {
        "name": "National Library Board (NLB)",
        "focus": "Oversees libraries and information services",
        "sector": "Education",
        "platform": "Library Services Portal"
    },
    {
        "name": "National Parks Board (NParks)",
        "focus": "Manages parks, gardens, and biodiversity",
        "sector": "Environment",
        "platform": "Parks & Gardens Portal"
    },
    {
        "name": "Ngee Ann Polytechnic (NP)",
        "focus": "Provides polytechnic education and training",
        "sector": "Education",
        "platform": "Student Portal"
    },
    {
        "name": "People's Association (PA)",
        "focus": "Fosters community development and engagement",
        "sector": "Community Development",
        "platform": "Community Engagement Portal"
    },
    {
        "name": "Professional Engineers Board, Singapore (PEB)",
        "focus": "Regulates professional engineers",
        "sector": "Regulation",
        "platform": "Engineering Registration Portal"
    },
    {
        "name": "PUB, Singapore's National Water Agency (PUB)",
        "focus": "Manages water supply, drainage, and water treatment",
        "sector": "Environment",
        "platform": "Water Services Portal"
    },
    {
        "name": "Public Transport Council (PTC)",
        "focus": "Regulates public transport fare structures and policies",
        "sector": "Regulation",
        "platform": "Transport Fare Portal"
    },
    {
        "name": "Republic Polytechnic (RP)",
        "focus": "Provides polytechnic education and training",
        "sector": "Education",
        "platform": "Student Portal"
    },
    {
        "name": "Science Centre Board (SCB)",
        "focus": "Promotes scientific and technological knowledge",
        "sector": "Education",
        "platform": "Science Learning Portal"
    },
    {
        "name": "Sentosa Development Corporation (SDC)",
        "focus": "Oversees Sentosa development and tourism",
        "sector": "Tourism",
        "platform": "Tourism Development Portal"
    },
    {
        "name": "Singapore Dental Council (SDC)",
        "focus": "Regulates dental professionals and practices",
        "sector": "Regulation",
        "platform": "Dental Licensing Portal"
    },
    {
        "name": "Singapore Examinations and Assessment Board (SEAB)",
        "focus": "Manages public examinations and assessments",
        "sector": "Education",
        "platform": "Examination Services Portal"
    },
    {
        "name": "Singapore Food Agency (SFA)",
        "focus": "Ensures food safety and sustainability",
        "sector": "Regulation",
        "platform": "Food Regulation Portal"
    },
    {
        "name": "Singapore Labour Foundation (SLF)",
        "focus": "Supports labor and worker welfare",
        "sector": "Labor Welfare",
        "platform": "Worker Welfare Portal"
    },
    {
        "name": "Singapore Land Authority (SLA)",
        "focus": "Oversees land use, management, and policies",
        "sector": "Urban Development",
        "platform": "Land Management Portal"
    },
    {
        "name": "Singapore Medical Council (SMC)",
        "focus": "Regulates medical professionals and practices",
        "sector": "Regulation",
        "platform": "Medical Licensing Portal"
    },
    {
        "name": "Singapore Nursing Board (SNB)",
        "focus": "Regulates nursing professionals and practices",
        "sector": "Regulation",
        "platform": "Nursing Licensing Portal"
    },
    {
        "name": "Singapore Pharmacy Council (SPC)",
        "focus": "Regulates pharmacy professionals and practices",
        "sector": "Regulation",
        "platform": "Pharmacy Licensing Portal"
    },
    {
        "name": "Singapore Polytechnic (SP)",
        "focus": "Provides polytechnic education and training",
        "sector": "Education",
        "platform": "Student Portal"
    },
    {
        "name": "Singapore Tourism Board (STB)",
        "focus": "Promotes tourism and the tourism industry",
        "sector": "Tourism",
        "platform": "Tourism Development Portal"
    },
    {
        "name": "SkillsFuture Singapore (SSG)",
        "focus": "Promotes skills development and lifelong learning",
        "sector": "Education",
        "platform": "Skills Development Portal"
    },
    {
        "name": "Sport Singapore (SportSG)",
        "focus": "Develops and promotes sports and recreation",
        "sector": "Sports",
        "platform": "Sports Services Portal"
    },
    {
        "name": "Temasek Polytechnic (TP)",
        "focus": "Provides polytechnic education and training",
        "sector": "Education",
        "platform": "Student Portal"
    },
    {
        "name": "Tote Board (Tote Board)",
        "focus": "Manages and oversees charitable and social initiatives",
        "sector": "Social Welfare",
        "platform": "Charity & Welfare Portal"
    },
    {
        "name": "Traditional Chinese Medicine Practitioners Board (TCMPB)",
        "focus": "Regulates traditional Chinese medicine practitioners",
        "sector": "Regulation",
        "platform": "TCM Licensing Portal"
    },
    {
        "name": "Urban Redevelopment Authority (URA)",
        "focus": "Plans and develops urban spaces and architecture",
        "sector": "Urban Development",
        "platform": "Urban Planning Portal"
    }
]

export function AgencySearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedsector, setSelectedsector] = useState<string>('all');

    const sectors = useMemo(() => {
        const uniquesectors = new Set(agencies.map(agency => agency.sector));
        return ['all', ...Array.from(uniquesectors)];
    }, []);

    const filteredAgencies = useMemo(() => {
        return agencies.filter(agency => {
            const matchesSearch =
                agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agency.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agency.platform.toLowerCase().includes(searchQuery.toLowerCase());

            const matchessector = selectedsector === 'all' || agency.sector === selectedsector;

            return matchesSearch && matchessector;
        });
    }, [searchQuery, selectedsector]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-[1px] border-gray-300">
                    <Building2 className="w-4 h-4" />
                    Browse Government Agencies
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Government Agencies Directory</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search agencies, focus areas, or platforms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={selectedsector}
                            onValueChange={setSelectedsector}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter by sector" />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-800 hover:text-blue-300 hover:'>
                                {sectors.map(sector => (
                                    <SelectItem key={sector} value={sector} className="text-white">
                                        {sector === 'all' ? 'All sectors' : sector}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Agency</TableHead>
                                    <TableHead>focus Area</TableHead>
                                    <TableHead>sector</TableHead>
                                    <TableHead>Platform</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAgencies.map((agency) => (
                                    <TableRow key={agency.name}>
                                        <TableCell className="font-medium">{agency.name}</TableCell>
                                        <TableCell>{agency.focus}</TableCell>
                                        <TableCell>{agency.sector}</TableCell>
                                        <TableCell>{agency.platform}</TableCell>
                                    </TableRow>
                                ))}
                                {filteredAgencies.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No agencies found matching your criteria
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Results Summary */}
                    <div className="text-sm text-gray-400 text-right">
                        Showing {filteredAgencies.length} of {agencies.length} agencies
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}