'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { ChatSession } from '@/lib/openai';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const initialQuestions = [
    "How do I create a new contract?",
    "What makes a good modernisation proposal?",
    "How is the contract value calculated?"
];

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chatSession, setChatSession] = useState<ChatSession | null>(null);

    useEffect(() => {
        if (isOpen && !chatSession) {
            const newSession = new ChatSession();
            setChatSession(newSession);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (content: string) => {
        if (!content.trim() || !chatSession) return;

        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', content }]);

        try {
            await chatSession.addMessage('user', content);
            const response = await chatSession.getResponse();
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Error getting response:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        }

        setIsLoading(false);
        setInputValue('');
    };

    const handleInitialQuestion = (question: string) => {
        handleSend(question);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 dark:bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 border dark:border-gray-700">
                    {/* Header */}
                    <div className="bg-blue-600 dark:bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <span className="font-medium">Modernisation Assistant</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="hover:bg-blue-700 dark:hover:bg-blue-600 p-1 rounded"
                            >
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-blue-700 dark:hover:bg-blue-600 p-1 rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Content */}
                    {!isMinimized && (
                        <>
                            <div className="h-96 overflow-y-auto p-4">
                                {messages.length === 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            Hello! How can I help you today? Here are some common questions:
                                        </p>
                                        {initialQuestions.map((question, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleInitialQuestion(question)}
                                                className="block w-full text-left p-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-800 dark:text-gray-200"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                                        >
                                            <div
                                                className={`inline-block p-3 rounded-lg ${msg.role === 'user'
                                                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                                    }`}
                                            >
                                                <MarkdownRenderer
                                                    content={msg.content}
                                                    className="max-w-[240px]"  // Adjust this value as needed
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t dark:border-gray-700">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSend(inputValue);
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={() => handleSend(inputValue)}
                                        disabled={isLoading || !inputValue.trim()}
                                        className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FloatingChatbot;