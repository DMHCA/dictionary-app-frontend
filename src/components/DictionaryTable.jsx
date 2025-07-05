import React, { useEffect, useState } from 'react';

function DictionaryTable() {
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`http://54.174.228.227:8090/api/records/page?page=${page}&size=${size}`)
            .then(res => res.json())
            .then(data => {
                setRecords(data.content);
                setTotalPages(data.totalPages);
                setLoading(false);
            });
    }, [page, size]);

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (page + 1 < totalPages) setPage(page + 1);
    };

    return (
        <div>
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
                            {rec.usAudioUrl && <audio src={rec.usAudioUrl} controls style={{ width: '100px' }} />}
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
