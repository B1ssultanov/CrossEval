"use client";

interface YouTubeEmbedProps {
  src: string; // full embed URL, including any query params
}

export default function YouTubeEmbed({ src }: YouTubeEmbedProps) {
  return (
    <section className="w-full ">
      {/* <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Promo Video
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Check our <span className="text-indigo-500">Promo</span>{" "}
              video
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Filmed by Nursultan, Directed by Yedyge and Zhanbolat, Edited by Yedyge,
            </p>
          </div>
        </div> */}
      <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border bg-white p-6 shadow-lg">
        <div className="aspect-video w-full">
          <iframe
            className="w-full rounded-md h-[340px]"
            src={src}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
