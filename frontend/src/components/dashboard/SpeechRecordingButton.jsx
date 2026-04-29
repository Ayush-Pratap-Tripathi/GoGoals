import { Mic, Loader, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SpeechRecordingButton = ({ onSpeechDataReceived }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const { token, user } = useContext(AuthContext);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const touchTimeRef = useRef(null);
  const touchTimerRef = useRef(null);

  // Initialize audio recording
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied');
      toast.error('Could not access microphone');
    }
  };

  // Stop recording and send to backend
  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    setIsRecording(false);
    setIsProcessing(true);

    mediaRecorderRef.current.onstop = async () => {
      try {
        // Create blob from audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Create FormData
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('language', 'en');

        // Send to backend
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBase}/speech/transcribe-and-extract`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to process audio');
        }

        const data = await response.json();

        // [DEV] Log API response for debugging
        console.log('🎤 Speech-to-Goal API Response:', {
          success: data.success,
          transcript: data.transcript,
          goalData: data.goalData,
          model: data.model,
          fullResponse: data
        });
        console.log('📝 Transcript:', data.transcript);
        console.log('🎯 Extracted Goal Data:', data.goalData);

        if (data.success && data.goalData) {
          toast.success('Audio processed successfully!', {
            style: { borderRadius: '10px', background: '#292d44', color: '#fff' }
          });
          // Call the callback with extracted goal data
          onSpeechDataReceived(data.goalData);
        } else {
          throw new Error(data.error || 'Failed to extract goal data');
        }
      } catch (err) {
        console.error('Error processing audio:', err);
        setError(err.message);
        toast.error('Failed to process audio: ' + err.message);
      } finally {
        setIsProcessing(false);
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    };

    mediaRecorderRef.current.stop();
  };

  // Handle touch start (long press)
  const handleMouseDown = () => {
    // Check if user is premium
    if (!user?.isPremium) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      toast.error('Upgrade to premium to use this feature', {
        style: { borderRadius: '10px', background: '#292d44', color: '#fff' }
      });
      return;
    }
    
    touchTimeRef.current = Date.now();
    startRecording();
  };

  // Handle touch end
  const handleMouseUp = () => {
    if (touchTimeRef.current && isRecording) {
      stopRecording();
    }
    touchTimeRef.current = null;
  };

  // Handle mouse leave (if user moves away while pressing)
  const handleMouseLeave = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  // Get button state styling
  const getButtonStyles = () => {
    if (isProcessing) {
      return 'bg-yellow-600 hover:bg-yellow-700';
    }
    if (isRecording) {
      return 'bg-red-600 hover:bg-red-700 animate-pulse';
    }
    if (error) {
      return 'bg-red-500 hover:bg-red-600';
    }
    return 'bg-[#3b82f6] hover:bg-[#2563eb]';
  };

  return (
    <div className="relative">
      {/* FLOATING MIC BUTTON */}
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={isProcessing}
        className={`absolute bottom-20 md:bottom-24 right-6 md:right-10 w-14 h-14 ${getButtonStyles()} hover:scale-105 active:scale-95 transition-all outline-none border-none rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] z-50 cursor-pointer text-white disabled:opacity-70 disabled:cursor-not-allowed ${isShaking ? 'animate-premium-shake' : ''}`}
        title={isRecording ? 'Release to send' : 'Hold to record'}
      >
        {isProcessing ? (
          <Loader className="w-7 h-7 animate-spin" />
        ) : error ? (
          <AlertCircle className="w-7 h-7" />
        ) : (
          <Mic className="w-7 h-7" />
        )}
      </button>

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute bottom-20 md:bottom-24 right-20 md:right-24 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-2 rounded-full text-white text-xs font-semibold">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Recording...
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute bottom-20 md:bottom-24 right-20 md:right-24 flex items-center gap-2 bg-yellow-600/90 backdrop-blur-sm px-3 py-2 rounded-full text-white text-xs font-semibold">
          <Loader className="w-3 h-3 animate-spin" />
          Processing...
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div className="absolute bottom-20 md:bottom-24 right-20 md:right-24 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-2 rounded-full text-white text-xs font-semibold">
          <AlertCircle className="w-3 h-3" />
          Error
        </div>
      )}
    </div>
  );
};

export default SpeechRecordingButton;
