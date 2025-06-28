import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import { Recipe } from './types';
import { searchRecipes } from './services/api';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedRecipe(null);
    setHasSearched(true);

    console.log('Searching for:', query);

    try {
      const results = await searchRecipes(query);
      console.log('Search results:', results);
      setRecipes(results);
      
      if (results.length === 0) {
        setError('No recipes found for your search. Try different ingredients!');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToSearch = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Recipe Finder</h1>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Edamam & MealDB APIs
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedRecipe ? (
          <>
            {/* Search Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find Delicious Recipes
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Search for recipes using ingredients you have on hand
              </p>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Results Section */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching for recipes...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-800">{error}</p>
                  <p className="text-red-600 text-sm mt-2">
                    Try searching for common ingredients like: chicken, pasta, tomatoes, cheese
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !error && hasSearched && recipes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={handleRecipeClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && !error && hasSearched && recipes.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-yellow-800">
                    No recipes found. Try searching for different ingredients!
                  </p>
                  <div className="mt-4 text-sm text-yellow-700">
                    <p>Popular search terms:</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {['chicken', 'pasta', 'tomatoes', 'cheese', 'beef', 'fish'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-full text-yellow-800 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <RecipeDetail recipe={selectedRecipe} onBack={handleBackToSearch} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Recipe Finder. Built with React & TypeScript.</p>
            <p className="mt-2 text-sm">
              Recipe data provided by Edamam and TheMealDB APIs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 