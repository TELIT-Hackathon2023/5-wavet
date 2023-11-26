const Landing = () => {
    return (
        <div className="flex items-center justify-around h-screen">
            <div className="flex-1 text-start ml-20 z-20 mb-48">
                <h2 className="text-9xl font-bold text-gray-900 leading-tight mb-4">ParkIT</h2>
                <p className="text-xl text-gray-700 mb-8 relative right-8">Say goodbye to the hassle of finding parking spots</p>
            </div>
            <div className="flex-1 bg-accent h-[220%] rotate-45 justify-center z-10 w[5%]">
                <img src="./landing.webp" className="w-full h-auto -rotate-45 mt-96 relative right-10 top-9" alt="Landing"/>
            </div>
            
        </div>
    );
}

export default Landing;