import Link from "next/link";
import Image from "next/image";

export default function DashBoard() {
  return (
    <>
      <div></div>
      <div className="z-10 w-full justify-between text-sm lg:flex p-10 font-sans ">
        <Link href={"/"}>
          <div className="text-2xl fixed left-0 top-0 flex w-full justify-center border-gray-300 from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:p-4 lg:dark:bg-zinc-800/30">
            Minhyun
          </div>
        </Link>

        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none gap-5">
          {/* <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          ></a>{" "} */}
          <Link href={"/"}>Home</Link>
          <Link href={"/aboutMe"}>About Me</Link>
          <Link href={"/blog"}>Blog</Link>
          <Image
            src="/logo.png"
            alt="Hatchery Logo"
            className="dark:invert"
            width={50}
            height={25}
            priority
          />
        </div>
      </div>
    </>
  );
}
