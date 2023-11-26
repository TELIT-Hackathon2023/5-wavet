const Landing = () => {
    return (
        <div className="flex items-center justify-around h-screen">
            <div className="flex-1 text-center">
                <h2 className="text-5xl font-bold">ParkIT</h2>
                <h2 className="text-xl font-medium">You will never have to look for a parking spot anymore</h2>
            </div>
            <div className="flex-1">
                <img src="./landing.webp" className="w-full h-auto mb-10" alt="Landing" />
            </div>
            
        </div>
    );
}

export default Landing;