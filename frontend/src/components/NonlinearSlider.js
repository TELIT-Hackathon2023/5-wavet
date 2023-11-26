import React, { useState } from 'react';

const NonlinearSlider = (props) => {

    // Define the nonlinear range mapping function
    const mapNonlinear = (val) => {
        if (val <= 60) {
            // Steps by 5 from 15 to 60
            return 15 + Math.floor((val - 15) / 5) * 5;
        } else {
            // Steps by 15 from 60 to 360
            return 60 + Math.floor((val - 60) / 15) * 15;
        }
    };

    // Define the reverse mapping function
    const reverseMapNonlinear = (val) => {
        if (val <= 60) {
            // Reverse steps by 5 from 15 to 60
            return 15 + Math.floor((val - 15) / 5) * 5;
        } else {
            // Reverse steps by 15 from 60 to 360
            return 60 + Math.floor((val - 60) / 15) * 15;
        }
    };

    // Handle input range change
    const handleInputChange = (event) => {
        const inputValue = parseInt(event.target.value, 10);
        props.updateEnd(mapNonlinear(inputValue));
    };

    return (
        <div className=''>
            <input
                type="range"
                min={15}
                max={360}
                step={1}  // Step of 1 for smoother movement
                value={reverseMapNonlinear(props.end)}
                onChange={handleInputChange}

            />
            <p>{props.end} min</p>
        </div>
    );
};

export default NonlinearSlider;