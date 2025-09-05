import { ImageGenerator } from "@/components/app/image-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 selection:bg-primary/20">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-200 via-primary to-accent">
            Scripter Image
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Transform your words into visual art. Enter a script, choose a style, and let AI do the magic.
          </p>
        </header>
        <ImageGenerator />
      </div>
    </main>
  );
}
