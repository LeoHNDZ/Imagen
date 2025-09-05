"use client";

import { useState } from "react";
import Image from "next/image";
import { generateImageFromScript } from "@/ai/flows/generate-image-from-script";
import { suggestImageStyles } from "@/ai/flows/suggest-image-styles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  ImageIcon,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ImageGenerator() {
  const [script, setScript] = useState("");
  const [imageStyle, setImageStyle] = useState("");
  const [suggestedStyles, setSuggestedStyles] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const handleSuggestStyles = async () => {
    if (!script) {
      toast({
        title: "Script is empty",
        description: "Please enter a script to get style suggestions.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestedStyles([]);
    try {
      const result = await suggestImageStyles({ script });
      setSuggestedStyles(result.styles);
    } catch (error) {
      console.error("Error suggesting styles:", error);
      toast({
        title: "Failed to suggest styles",
        description: "An error occurred while suggesting image styles.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!script || !imageStyle) {
      toast({
        title: "Missing fields",
        description: "Please provide both a script and an image style.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateImageFromScript({ script, imageStyle });
      setGeneratedImage(result.image);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!generatedImage) return;
    try {
      // The URL from Genkit might be temporary or require authentication.
      // A direct fetch might fail due to CORS. The simplest way is a new tab.
      // For a more robust solution, a server-side proxy would be needed.
      const link = document.createElement('a');
      link.href = generatedImage;
      link.target = "_blank";
      link.download = "scripter-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download image:", error);
      toast({
        title: "Download failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
  };

  const IconGlow = ({ children }: { children: React.ReactNode }) => (
    <span className="relative [&>svg]:drop-shadow-[0_0_5px_hsl(var(--primary))]">
      {children}
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <IconGlow><Wand2 className="text-primary" /></IconGlow>
            Image Studio
          </CardTitle>
          <CardDescription>
            Enter your script and define the visual style.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="script">Script</Label>
            <Textarea
              id="script"
              placeholder="e.g., A lone astronaut stands on a red-dusted alien planet, gazing at two suns setting on the horizon."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="min-h-[150px] bg-input/50"
              disabled={isLoading || isSuggesting}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="image-style">Image Style</Label>
              <Button
                variant="link"
                size="sm"
                onClick={handleSuggestStyles}
                disabled={!script || isLoading || isSuggesting}
                className="text-primary p-0 h-auto"
              >
                {isSuggesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Styles
              </Button>
            </div>
            <Input
              id="image-style"
              placeholder="e.g., Cinematic, photorealistic, vibrant colors"
              value={imageStyle}
              onChange={(e) => setImageStyle(e.target.value)}
              className="bg-input/50"
              disabled={isLoading || isSuggesting}
            />
          </div>
          {isSuggesting && (
             <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
             </div>
          )}
          {suggestedStyles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestedStyles.map((style) => (
                <Badge
                  key={style}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => setImageStyle(style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full font-bold text-base"
            onClick={handleGenerateImage}
            disabled={isLoading || isSuggesting || !script || !imageStyle}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <IconGlow><Wand2 className="mr-2 h-5 w-5 text-accent" /></IconGlow>
            )}
            Generate Image
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <IconGlow><ImageIcon className="text-primary" /></IconGlow>
            Generated Scene
          </CardTitle>
          <CardDescription>
            Your visual representation appears here.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative aspect-square flex items-center justify-center">
          {isLoading && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
          )}
          {!isLoading && !generatedImage && (
            <div className="text-center text-muted-foreground space-y-2">
              <ImageIcon className="mx-auto h-16 w-16" />
              <p>Your generated image will be displayed here.</p>
            </div>
          )}
          {generatedImage && (
            <>
              <Image
                src={generatedImage}
                alt="Generated from script"
                fill
                className="object-contain rounded-md"
                unoptimized
                data-ai-hint="abstract art"
              />
               <Button
                variant="secondary"
                size="icon"
                onClick={handleDownloadImage}
                className="absolute bottom-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              >
                <IconGlow><Download className="h-5 w-5" /></IconGlow>
                <span className="sr-only">Download Image</span>
              </Button>
            </>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground w-full text-center">Images are generated using AI and may not be perfectly accurate.</p>
         </CardFooter>
      </Card>
    </div>
  );
}
