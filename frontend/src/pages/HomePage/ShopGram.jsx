import React, { useRef, useState, useEffect } from 'react';
import { Images } from '../../assets/assets';

const ShopGram = () => {
    const containerRef = useRef(null);
    const [activeDot, setActiveDot] = useState(0);

    const images = [
        Images.shopGramImg1,
        Images.shopGramImg2,
        Images.shopGramImg3,
        Images.shopGramImg4,
        Images.shopGramImg5,
    ];

    const visibleDots = 3; 
    const totalImageSets = Math.ceil(images.length / visibleDots); 

    const updateActiveDot = () => {
        const container = containerRef.current;
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.offsetWidth;

        const newActiveDot = Math.round(scrollLeft / containerWidth);
        setActiveDot(newActiveDot);
    };

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', updateActiveDot);

        return () => {
            container.removeEventListener('scroll', updateActiveDot);
        };
    }, []);

    const handleDragScroll = (e) => {
        e.preventDefault();
        containerRef.current.scrollLeft -= e.movementX;
    };

    const addDragScrollListeners = () => {
        const container = containerRef.current;
        container.addEventListener('mousemove', handleDragScroll);
    };

    const removeDragScrollListeners = () => {
        const container = containerRef.current;
        container.removeEventListener('mousemove', handleDragScroll);
    };

    return (
        <div className="flex flex-col items-center mt-10 px-2 md:px-10 mb-16 text-center">
            <h1 className="text-[45px] font-normal">Shop Gram</h1>
            <p>Inspire and let yourself be inspired, from one unique fashion to another.</p>

            <div className="flex flex-col h-fit gap-4 relative">
                {/* Image container */}
                <div
                    ref={containerRef}
                    className="shopGram-images overflow-visible flex items-center gap-3 mt-14 overflow-x-scroll no-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                    onMouseDown={addDragScrollListeners}
                    onMouseUp={removeDragScrollListeners}
                    onMouseLeave={removeDragScrollListeners}
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-1/2 md:w-[33.33%] lg:w-[20%] snap-center"
                        >
                            <img
                                className="rounded-lg transition-all duration-300 hover:scale-105 hover:opacity-90 hover:filter hover:brightness-90 w-full"
                                src={image}
                                alt={`${index + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex mt-8 absolute top-full left-1/2 transform -translate-x-1/2 gap-7 lg:hidden">
                    {Array.from({ length: visibleDots }).map((_, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-300 ${activeDot === index ? 'bg-black/30' : 'bg-gray-300'
                                }`}
                        >
                            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ShopGram;
