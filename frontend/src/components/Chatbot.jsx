"use client";
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import chatbotService from '@/service/api/chatbot';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startChat();
    }
  }, [isOpen]);

  const startChat = async () => {
    setLoading(true);
    try {
      const data = await chatbotService.startChat();
      
      setCurrentNode(null);
      
      setCurrentNode({
        question: data.question,
        answers: data.answers
      });
      
      setMessages([
        { id: Date.now(), text: data.question, type: 'bot' }
      ]);
    } catch (error) {
      setMessages([
        { id: Date.now(), text: "Кечиресиз, техникалык көйгөй чыкты. Кайра аракет кылыңыз.", type: 'bot' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNodeById = async (nodeId) => {
    setLoading(true);
    try {
      setCurrentNode(null);
      
      const data = await chatbotService.getNodeById(nodeId);
      
      setCurrentNode({
        question: data.question,
        answers: data.answers
      });
      
      setMessages(prev => [...prev,
        { id: Date.now(), text: data.question, type: 'bot' }
      ]);
    } catch (error) {
      setMessages(prev => [...prev,
        { id: Date.now(), text: "Кечиресиз, техникалык көйгөй чыкты. Кайра аракет кылыңыз.", type: 'bot' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer, nodeId) => {
    setMessages(prev => [...prev,
      { id: Date.now(), text: answer, type: 'user' }
    ]);
    
    fetchNodeById(nodeId);
  };

  const restartChat = () => {
    setMessages([]);
    setCurrentNode(null); 
    startChat();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Открыть чат"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end pb-4 justify-end z-50 sm:items-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-[#1D4ED8]">Чат жардамчы</h2>
              <div className="flex gap-2">
                <button
                  onClick={restartChat}
                  className="p-1 hover:bg-gray-100 rounded-full text-blue-600"
                  title="Баштан баштоо"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Закрыть чат"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg p-3 flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span>Жооп берүүдө...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {!loading && currentNode && currentNode.answers && Object.keys(currentNode.answers).length > 0 && (
              <div className="px-4 py-3 border-t flex flex-wrap gap-2">
                {Object.entries(currentNode.answers).map(([answer, nodeId]) => (
                  <button
                    key={nodeId}
                    onClick={() => handleAnswer(answer, nodeId)}
                    className="border border-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 text-gray-700 px-3 py-2 rounded-md text-sm transition-colors duration-200"
                  >
                    {answer}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}