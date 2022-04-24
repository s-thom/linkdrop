export default function Index() {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <p className="mx-auto max-w-lg text-center text-xl lowercase sm:max-w-3xl">
        An application to drop interesting links from around the internet.
        <br />a small project by{" "}
        <a
          href="https://sthom.kiwi"
          target="_blank"
          rel="noreferrer nofollow"
          className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:bg-neutral-800"
        >
          Stuart Thomson
        </a>
        .{" "}
        <a
          href="https://github.com/s-thom/linkdrop"
          target="_blank"
          rel="noreferrer nofollow"
          className="text-center lowercase text-neutral-400 underline decoration-1 hover:text-neutral-500 hover:no-underline active:bg-neutral-600"
        >
          (Source code)
        </a>
      </p>
    </div>
  );
}
