import Image from "next/image";
import LoginButton from "./loginbutton";

export default function Home() {
  return (
    <div className="relative min-h-screen items-center justify-center bg-midnight font-sans">
        <div className="absolute top-0 left-0 w-[10vh] h-[10vh] p-[1em]">
            <Image 
                src="/logo.svg"
                alt="Photo Legue logo"
                width={100}
                height={100}
                className="object-contain"
            />
        </div>
      <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-t from-midnight to-photoblue">
        <div className="w-[31vh]">
            <p className="relative text-white text-xs mb-1">Log in </p>
            <div className="flex bg-midnight border-white border-[1px] w-[31vh] h-[40vh] rounded-sm p-4 justify-center">
                <LoginButton />
            </div>
        </div>
      </main>
    </div>
  );
}
