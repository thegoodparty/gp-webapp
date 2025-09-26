'use client'
import { LuCloudUpload } from "react-icons/lu";
export default function AddImageStep({  }) {

  return (
    <div className="flex flex-col items-center md:justify-center sm:h-screen md:h-auto mb-16">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Text messages perform better with an image.
      </h1>  
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        Add your campaign headshot, logo or a community photo for credibility.
      </p>

      <div className="w-full mt-12">
        <div className="flex flex-col items-center justify-center w-full h-40 border-dashed border border-gray-300 rounded-2xl p-4 ">
          <LuCloudUpload size={24} className="inline" />
          <p className="leading-normal medium text-sm font-normal">Upload Image</p>
        </div>
        <p className="text-xs font-normal text-muted-foreground mt-2">Recommended PNG or JPG format.</p>
      </div>
    </div>
  )
}
