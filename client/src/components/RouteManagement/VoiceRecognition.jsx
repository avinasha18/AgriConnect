import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { UilMicrophone, UilMicrophoneSlash } from '@iconscout/react-unicons';

const VoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();

    const language = localStorage.getItem('language')

    const getResponse = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/callRoutes', {
                params: {
                    language: language,
                }
            });
            const route = response.data.description.toLowerCase();
            handleCommand(route)
        } catch (error) {
            console.error('Error getting response:', error);
        }
    };

    useEffect(() => {
        if (isListening) {
            getResponse();
        }
    }, [isListening]);

    const handleCommand = (command) => {
        if (command.includes('open crop disease') || command.includes('disease')) {
            navigate('/disease');
        } else if (command.includes('open crop recommendation') || command.includes('recommendation')) {
            navigate('/recommendation');
        } else if (command.includes('open crop yield') || command.includes('yield')) {
            navigate('/yield');
        } else if (command.includes('open dashboard') || command.includes('dashboard')) {
            navigate('/dashboard');
            speak('Opened dashboard page');
        } else if (command.includes('open home') || command.includes('home')) {
            navigate('/home');
            speak('Opened home page');
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <button
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
            onClick={() => setIsListening(!isListening)}
        >
            {isListening ? (
                <UilMicrophoneSlash className="text-2xl" />
            ) : (
                <UilMicrophone className="text-2xl" />
            )}
        </button>
    );
};

export default VoiceRecognition;
