import React, { useEffect, useState, useRef } from 'react';
import AudioPlayer from "./AudioPlayer";

function DictionaryTable() {
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [level, setLevel] = useState('');
    const [pos, setPos] = useState('');
    const [learned, setLearned] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        setLoading(true);

        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        if (searchTerm.trim() !== '') {
            params.append('word', searchTerm.trim());
        }
        if (level) {
            params.append('level', level);
        }
        if (pos) {
            params.append('pos', pos);
        }
        if (learned !== null) {
            params.append('learned', learned);
        }

        // Выбираем эндпоинт в зависимости от наличия слова поиска
        let url = searchTerm.trim() !== ''
            ? `http://54.174.228.227:8090/api/records/search?${params.toString()}`
            : `http://54.174.228.227:8090/api/records/page?${params.toString()}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setRecords(data.content);
                setTotalPages(data.totalPages);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, size, searchTerm, level, pos, learned]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            setSearchTerm(value);
            setPage(0);
        }, 300);
    };

    const handleLevelChange = (e) => {
        setLevel(e.target.value);
        setPage(0);
    };

    const handlePosChange = (e) => {
        setPos(e.target.value);
        setPage(0);
    };

    const handleLearnedChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setLearned(null);
        } else if (val === 'true') {
            setLearned(true);
        } else {
            setLearned(false);
        }
        setPage(0);
    };

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (page + 1 < totalPages) setPage(page + 1);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setLevel('');
        setPos('');
        setLearned(null);
        setPage(0);
    };

    return (
        <div>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by word..."
                    onChange={handleSearchChange}
                    value={searchTerm}
                    style={{ padding: '5px', width: '200px' }}
                />

                <select value={level} onChange={handleLevelChange}>
                    <option value="">All Levels</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                </select>

                <select value={pos} onChange={handlePosChange}>
                    <option value="">All POS</option>
                    <option value="noun">Noun</option>
                    <option value="verb">Verb</option>
                    <option value="adjective">Adjective</option>
                    <option value="adverb">Adverb</option>
                    {/* Добавь другие значения частей речи, если нужно */}
                </select>

                <select value={learned === null ? '' : learned.toString()} onChange={handleLearnedChange}>
                    <option value="">All</option>
                    <option value="true">Learned</option>
                    <option value="false">Not Learned</option>
                </select>

                <button onClick={handleClearFilters}>Clear Filters</button>
            </div>

            {loading && <div>Loading...</div>}
            <table>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                <tr>
                    <th>ID</th>
                    <th>Word</th>
                    <th>Level</th>
                    <th>Translation</th>
                    <th>US Audio</th>
                    <th>POS</th>
                    <th>Learned</th>
                </tr>
                </thead>
                <tbody>
                {records.map((rec, i) => (
                    <tr key={rec.id} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f0f0f0' }}>
                        <td>{rec.id}</td>
                        <td>{rec.word}</td>
                        <td>{rec.level}</td>
                        <td>{rec.translation}</td>
                        <td>
                            {rec.usAudioUrl && <AudioPlayer src={rec.usAudioUrl} />}
                        </td>
                        <td>{rec.pos}</td>
                        <td>{rec.learned ? '✅' : '❌'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: '10px' }}>
                <button onClick={handlePrev} disabled={page === 0}>Prev</button>
                <span style={{ margin: '0 10px' }}>Page {page + 1} of {totalPages}</span>
                <button onClick={handleNext} disabled={page + 1 >= totalPages}>Next</button>
            </div>
        </div>
    );
}

export default DictionaryTable;
