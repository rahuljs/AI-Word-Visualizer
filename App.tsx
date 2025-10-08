import React, { useState, useCallback } from 'react';
import { getRelatedWords, generateCartoonImage } from './services/geminiService';
import type { WordData, ImageData } from './types';
import { CardType, IndianLanguage } from './types';
import ImageCard from './components/ImageCard';
import { RefreshIcon, SparklesIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [inputWord, setInputWord] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguage>(IndianLanguage.Marathi);
  const [words, setWords] = useState<WordData | null>(null);
  const [images, setImages] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateAllImages = useCallback(async (currentWords: WordData) => {
    setIsGeneratingImages(true);
    setImages(null); // Clear previous images
    setError(null);
    try {
      const imagePromises = [
        generateCartoonImage(currentWords.original),
        generateCartoonImage(currentWords.opposite),
        generateCartoonImage(currentWords.similar),
        generateCartoonImage(currentWords.genZ),
      ];
      
      const [originalImg, oppositeImg, similarImg, genZImg] = await Promise.all(imagePromises);
      
      setImages({
        original: originalImg,
        opposite: oppositeImg,
        similar: similarImg,
        genZ: genZImg,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred while generating images.');
      setImages(null);
    } finally {
      setIsGeneratingImages(false);
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setWords(null);
    setImages(null);

    try {
      const relatedWords = await getRelatedWords(inputWord, selectedLanguage);
      const newWords: WordData = {
        original: inputWord.trim().toLowerCase(),
        ...relatedWords
      };
      setWords(newWords);
      await generateAllImages(newWords);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setWords(null);
      setImages(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshImages = () => {
    if (words && !isLoading) {
      generateAllImages(words);
    }
  };
  
  const isInitialState = !words && !isLoading && !error;
  const isGeneratingWords = isLoading && !words;
  const isGeneratingAll = isLoading && words;
  const showResults = words !== null;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
            AI Word Visualizer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Turn words into cartoon art. Discover opposites, synonyms, and translations visually.
          </p>
        </header>

        <main>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl sticky top-4 z-10">
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                placeholder="Enter a word (e.g., 'happy')"
                className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                disabled={isLoading}
              />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as IndianLanguage)}
                className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                disabled={isLoading}
              >
                {Object.values(IndianLanguage).map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isLoading || !inputWord.trim()}
                className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                   <SparklesIcon className="w-5 h-5 mr-2" />
                    Generate
                  </>
                )}
              </button>
            </form>
          </div>
          
          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
              <p><strong>Oops! An error occurred:</strong></p>
              <p>{error}</p>
            </div>
          )}

          {isInitialState && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">Enter a word above to see the magic happen!</p>
            </div>
          )}

          <div className="mt-8">
            {(isGeneratingWords || isGeneratingAll) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ImageCard title={CardType.Original} word={null} imageUrl={null} isLoading={true} />
                <ImageCard title={CardType.Opposite} word={null} imageUrl={null} isLoading={true} />
                <ImageCard title={CardType.Similar} word={null} imageUrl={null} isLoading={true} />
                <ImageCard title={CardType.GenZ} word={null} imageUrl={null} isLoading={true} />
              </div>
            )}

            {showResults && (
              <>
                <div className="text-center mb-8">
                  <button
                    onClick={handleRefreshImages}
                    disabled={isGeneratingImages || isLoading}
                    className="flex items-center justify-center mx-auto bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-200 font-semibold py-2 px-5 rounded-lg transition-colors"
                  >
                    <RefreshIcon className={`w-5 h-5 mr-2 ${isGeneratingImages ? 'animate-spin' : ''}`} />
                    {isGeneratingImages ? 'Regenerating...' : 'Regenerate Images'}
                  </button>
                </div>
                
                <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-2xl max-w-lg mx-auto text-center shadow-lg transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/50">
                    <h4 className="text-lg font-semibold text-indigo-400">{selectedLanguage} Translation</h4>
                    <p className="text-4xl font-bold text-white mt-2">{words.translation}</p>
                    <p className="text-gray-400 mt-1 text-lg">({words.pronunciation})</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <ImageCard 
                    title={CardType.Original} 
                    word={words.original} 
                    imageUrl={images?.original || null} 
                    isLoading={isGeneratingImages} 
                  />
                  <ImageCard 
                    title={CardType.Opposite} 
                    word={words.opposite} 
                    imageUrl={images?.opposite || null} 
                    isLoading={isGeneratingImages} 
                  />
                  <ImageCard 
                    title={CardType.Similar} 
                    word={words.similar} 
                    imageUrl={images?.similar || null} 
                    isLoading={isGeneratingImages} 
                  />
                  <ImageCard 
                    title={CardType.GenZ} 
                    word={words.genZ} 
                    imageUrl={images?.genZ || null} 
                    isLoading={isGeneratingImages} 
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
