import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start bg-gradient-to-t from-midnight to-photoblue">
        //This is for the logo at the top
        <div className="absolute top-0 left-0 w-[10vh] h-[10vh] p-[1em]">
            <Image 
                src="/logo.svg"
                alt="Photo Legue logo"
                width={100}
                height={100}
                className="object-contain"
            />
        </div>
        
      </main>
    </div>
  );
}
