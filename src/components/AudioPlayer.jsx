import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, Loader2 } from 'lucide-react';
import './AudioPlayer.css';

export default function AudioPlayer({ src }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggle = () => {
        if (!audioRef.current) return;

        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            setLoading(true);
            audioRef.current.play();
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => {
            setLoading(false);
            setPlaying(true);
        };

        const handleEnded = () => {
            setPlaying(false);
        };

        audio.addEventListener('playing', handlePlay);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('playing', handlePlay);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={toggle} className="audio-button">
                {loading ? (
                    <Loader2 className="spinner" size={20} />
                ) : (
                    <PlayIcon color="green" size={20} />
                )}
            </button>
            <audio ref={audioRef} src={src} preload="none" />
        </div>
    );
}
