const Footer = () => {
    return (
        <div className=" bg-web-gray text-dark-text  w-full mt-auto ">
            <div className=" w-[60vw] mx-auto">
                <div className="flex justify-between items-center pt-10">
                    <img src="./30x36.png" alt="" />
                    <div className="flex">
                        <a href="https://linktr.ee/vht_kosice?fbclid=IwAR2vj4M1KvNbTGCuAVitCktumAgSDgJuTaLK4WZNGaaBtSiQmaORjjb19V0" className="">
                            <img src="/img/socials/web.svg" alt="" className="w-5 mx-1" />
                        </a>
                        <a href="https://www.facebook.com/vhtkosice/" className="">
                            <img src="/img/socials/facebook.svg" alt="" className="w-5 mx-1" />
                        </a>
                        <a href="https://www.instagram.com/vht_kosice/" className="">
                            <img src="/img/socials/instagram.svg" alt="" className="w-5 mx-1" />
                        </a>
                    </div>
                </div>
                <div className=" h-[1px] bg-dark-text my-5" />
                <div className="flex justify-between items-end my-5">
                    <div>
                        <p>Wavet Hackathon Team</p>
                    </div>
                </div>

            </div>

        </div>
    );
}


export default Footer;