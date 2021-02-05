import React, { useState } from 'react';
import { Toast, Button, Row, Col } from 'react-bootstrap';

function Notification(props) {
    const [show, setShow] = useState(props.show);

    const toggleShow = () => setShow(!show);

    return (
        <div>
            <div className={props.type === "warning" ? "notification bg-warning" : "notification bg-danger"}>
                <Toast show={show} onClose={toggleShow}>
                    <Toast.Header className={props.type === "warning" ? "bg-warning" : "bg-danger"}>
                        <strong className="mr-auto text-white">Interactive Constrained Clustering</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <span>{props.text}</span>
                        {props.type === "warning" ?
                            <Row className="text-center mt-2">
                                <Col>
                                    <Button onClick={() => {
                                        props.func()
                                        toggleShow()
                                    }} className="btn-sm">Yes</Button>
                                </Col>
                                <Col>
                                    <Button onClick={toggleShow} className="btn-sm">No</Button>
                                </Col>
                            </Row>
                            : null
                        }
                    </Toast.Body>
                </Toast>
            </div>
        </div>
    );
}

export default Notification