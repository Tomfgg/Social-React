import React from 'react';
import { Carousel } from 'react-bootstrap';
import './MediaCarousel.css'

const isImage = (path) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext));
};

const ImageVideoCarousel = ({ media }) => {
    return (
        <Carousel>
            {media.map((item, index) => (
                <Carousel.Item key={index}>
                    {isImage(item) ? (
                        <img
                            className="d-block w-100"
                            src={item}
                            alt={item.alt || 'Media slide'}
                        />
                    ) : (
                        <video className="d-block w-100" controls>
                            <source src={item} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ImageVideoCarousel;