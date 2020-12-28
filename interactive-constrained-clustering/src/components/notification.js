import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';

function Notification(props) {
    const [showA, setShowA] = useState(props.show);

    const toggleShowA = () => setShowA(!showA);

    return (
        <div>
            <div className="notification bg-danger">
                <Toast show={showA} onClose={toggleShowA}>
                    <Toast.Header className="bg-danger">
                        <strong className="mr-auto text-white">Interactive Constrained Clustering</strong>
                    </Toast.Header>
                    <Toast.Body>{props.text}</Toast.Body>
                </Toast>
            </div>
        </div>
    );
}

export default Notification