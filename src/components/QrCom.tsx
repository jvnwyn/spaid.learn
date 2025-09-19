import React from "react";

const QrCom = () => {
  return (
    <div className="w-full  flex flex-col px-20 pt-5 gap-5 ">
      <div className="w-[880px] h-[170px] bg-[#f5f5f5] border-1 border-[rgba(0,0,0,0.25)]  p-4 flex  items-center ">
        <div className="w-32 h-32 border-1 border-[rgba(0,0,0,0.25)] flex justify-center items-center">
          QR CODE
        </div>
        <div className="h-full px-5 py-3  w-100">
          <h1 className="text-lg">Learn anywhere with SPAIDLEARN Mobile</h1>
          <h1 className="text-[#403F3F]">Learning courses available offline</h1>
        </div>
        <div className=" h-full flex justify-end items-end">
          <a href="#" className="text-[#403F3F] text-sm">
            Scan the QR code to get the app
          </a>
        </div>
      </div>
    </div>
  );
};

export default QrCom;
