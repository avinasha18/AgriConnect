import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Typography, CircularProgress, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Check for SpeechRecognition API in the browser
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

const VoiceInputForm = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    farmerName: '',
    cropType: '',
    cropYield: '',
    review: ''
  });

  const [currentField, setCurrentField] = useState('farmerName');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const recognition = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';
    }
  }, []);

  // Handle Voice Input
  const handleVoiceInput = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData((prevData) => ({
          ...prevData,
          [currentField]: transcript,
        }));
        setIsListening(false);
        speak(`Got it! Please say the next field name: ${getNextField()}`);
      };

      recognition.current.onerror = (event) => {
        console.error('Error occurred in recognition: ', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const getNextField = () => {
    const fields = ['farmerName', 'cropType', 'cropYield', 'review'];
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      setCurrentField(fields[currentIndex + 1]);
      return fields[currentIndex + 1];
    } else {
      return 'Submit the form';
    }
  };

  // Speak function using SpeechSynthesis
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(text); // Fallback to alert if speech synthesis is not supported
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/dashboard/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, farmerId: userId }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        speak('Thank you for your feedback!');
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="max-w-md mx-auto p-6 mt-[180px] bg-white rounded-lg shadow-md transition-all duration-500 ease-in-out">
        {isSubmitted ? (
          <Box className="text-center ">
            <Typography variant="h5" className="text-green-500 mb-4">
              Successfully Submitted!
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              Thank you for your feedback!
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h5" className="mb-4">
              Farmer Review Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Farmer Name"
                id="farmerName"
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <TextField
                label="Crop Type"
                id="cropType"
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <TextField
                label="Crop Yield"
                id="cropYield"
                value={formData.cropYield}
                onChange={(e) => setFormData({ ...formData, cropYield: e.target.value })}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <TextField
                label="Review"
                id="review"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                className="mb-4"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleVoiceInput}
                disabled={isListening}
                className="mb-4"
                startIcon={isListening ? <CircularProgress size={20} /> : null}
              >
                {isListening ? 'Listening...' : 'Speak'}
              </Button>
              <Button sx={{ml:25}} type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </form>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default VoiceInputForm;
