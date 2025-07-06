import React, { useEffect, useState, useRef } from 'react';
import AudioPlayer from "./AudioPlayer";

function DictionaryTable() {
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debounceRef = useRef(null);

    useEffect(() => {
        setLoading(true);

        const params = new URLSearchParams({
            page,
            size,
        });

        let url = `http://54.174.228.227:8090/api/records/page?${params}`;

        if (searchTerm.trim() !== '') {
            params.append('word', searchTerm.trim());
            url = `http://54.174.228.227:8090/api/records/search?${params}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setRecords(data.content);
                setTotalPages(data.totalPages);
                setLoading(false);
            });
    }, [page, size, searchTerm]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            setSearchTerm(value);
            setPage(0); // Сброс на первую страницу при поиске
        }, 300);
    };

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (page + 1 < totalPages) setPage(page + 1);
    };

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Search by word..."
                    onChange={handleSearchChange}
                    style={{ padding: '5px', width: '200px' }}
                />
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
