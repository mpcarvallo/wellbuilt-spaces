import Questionnaire from "@/components/Questionnaire";

export default function Home() {
  return (
    <main className="flex flex-1 justify-center bg-background px-4 py-10 sm:py-16">
      <div className="w-full max-w-[720px] sm:max-w-[860px]">
        <Questionnaire />
      </div>
    </main>
  );
}
