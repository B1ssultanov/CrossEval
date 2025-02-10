import Image from "next/image";

export default function AuthSlogan() {
  return (
    <section className="w-1/2 bg-mydarkblue h-full flex flex-col items-center justify-center">
      <div className="flex flex-col space-y-7">
        <div className="flex items-center space-x-3 pl-8">
          <Image
            src={"/assets/icons/CrossEvalIcon.png"}
            width={50}
            height={50}
            alt="Atlantys logo"
          />
          <h1 className="text-3xl text-white font-bold">CrossEval</h1>
        </div>

        <h2 className="text-3xl text-white pl-8">
          Smart Evaluations, 
          Smarter Learning <br />
        </h2>

        <Image
          src={"/assets/icons/vector-desk.png"}
          width={500}
          height={373}
          alt="vector image, man working with the to-do table"
        />
      </div>
    </section>
  );
}
