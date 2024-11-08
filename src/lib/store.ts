import type { Contract, ContractAnalysis, User } from './types';

export class LocalStore {
    private static USERS_KEY = 'auction_users';
    private static CONTRACTS_KEY = 'auction_contracts';

    static getUsers(): Record<string, User> {
        const data = localStorage.getItem(this.USERS_KEY);
        return data ? JSON.parse(data) : {};
    }

    static setUsers(users: Record<string, User>) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    static getUser(username: string): User | null {
        const users = this.getUsers();
        return users[username] || null;
    }

    static setUser(username: string, user: User) {
        const users = this.getUsers();
        users[username] = user;
        this.setUsers(users);
    }

    static getContracts(): Record<string, Contract> {
        const data = localStorage.getItem(this.CONTRACTS_KEY);
        return data ? JSON.parse(data) : {};
    }

    static setContracts(contracts: Record<string, Contract>) {
        localStorage.setItem(this.CONTRACTS_KEY, JSON.stringify(contracts));
    }

    // static addContract(contract: Contract) {
    //     const contracts = this.getContracts();
    //     contracts[contract.id] = contract;
    //     this.setContracts(contracts);
    // }

    static updateContract(id: string, contract: Contract) {
        const contracts = this.getContracts();
        contracts[id] = contract;
        this.setContracts(contracts);
    }

    static async addContract(contract: Contract) {
        try {
            // First, try to get the AI analysis
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contract),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    contract.aiAnalysis = {
                        ...data.data,
                        timestamp: new Date().toISOString()
                    };
                }
            }
        } catch (error) {
            console.error('Failed to get AI analysis:', error);
        }

        // Continue with storing the contract regardless of analysis success
        const contracts = this.getContracts();
        contracts[contract.id] = contract;
        localStorage.setItem(this.CONTRACTS_KEY, JSON.stringify(contracts));
    }

    static getContractAnalysis(contractId: string): ContractAnalysis | undefined {
        const contracts = this.getContracts();
        return contracts[contractId]?.aiAnalysis;
    }
}