import React from 'react';
import {Card} from 'react-bootstrap'

export const ChartSlot = (props) => {
    return (
        <div className="outerBorders">
            <Card className="bg-dark">
                <Card.Img src={props.imgSrc} alt="Card image" />
                <Card.ImgOverlay className="lessImagePadding">
                    <Card.Title>Iteration {props.iteration}</Card.Title>
                </Card.ImgOverlay>
            </Card>
        </div>
    );
};