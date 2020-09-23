import React, { useState, useEffect } from 'react';

export default function Example() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });

    return ( 
        <div>
            <p> You click { count }
            times </p> 
            <button onClick = {() => { setCount(count + 1) } } > </button> 
        </div>
    );
}
