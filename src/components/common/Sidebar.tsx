import Link from 'next/link';
// import Image from 'next/image';

export function Sidebar() {
  return (
    <>
      <div>
        <div className="flex justify-end pr-20 ">
          <div className="flex flex-col h-screen-overflow-y-hidden gap-5 fixed pt-5">
            <h1 className="text-3xl">Contacts</h1>
            <Link href={'https://github.com/m2nhyun'} target="_blank">
              Github
            </Link>
            <Link
              href={
                'https://www.linkedin.com/in/%EB%AF%BC%ED%98%84-%EA%B9%80-ba92012b3/'
              }
              target="_blank"
            >
              LinkedIn
            </Link>
            <Link
              href={'https://www.instagram.com/m2n.__.hyun/'}
              target="_blank"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
