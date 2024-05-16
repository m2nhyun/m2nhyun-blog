import Link from 'next/link';
// import Image from 'next/image';

export function Header() {
  return (
    <>
      <header className="px-5">
        <div className="flex justify-between border-b px-5 items-center h-14 sticky">
          <Link href={'/'}>
            <div className="text-3xl">Minhyun</div>
          </Link>{' '}
          <div className="flex gap-2 text-lg">
            <div>다크모드 변경</div>
          </div>
        </div>
      </header>
    </>
  );
}
