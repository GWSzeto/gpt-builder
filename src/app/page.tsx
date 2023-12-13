
import GptBuilderForm from "./_components/GptBuilder";
import GptChat from "./_components/GptChat";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-50 ml-[55px]">
      <GptBuilderForm />
      <GptChat />
    </main>
  );
}

