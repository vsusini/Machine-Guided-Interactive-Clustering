import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import ChartsDisplay from "./chartsDisplay"
import { AppContext } from "../../App"

export function ModalChartDisplay() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
      <AppContext.Consumer>
        {
          context => (
            <>
              <Button variant="primary" onClick={handleShow}>
                Images
              </Button>

              <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-90w"
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Current Iteration Images</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ChartsDisplay iterationCount={context.iterationCount}></ChartsDisplay>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )
        }
      </AppContext.Consumer>
  );
}