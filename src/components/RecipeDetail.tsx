import React from 'react';
import { ArrowLeft, Clock, Users, MapPin, ChefHat, CheckCircle } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-64 md:h-80 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x400?text=Recipe+Image';
          }}
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            {recipe.prepTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Prep time: {recipe.prepTime}</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
            {recipe.cuisine && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{recipe.cuisine} cuisine</span>
              </div>
            )}
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <div className="flex items-center mb-4">
              <ChefHat className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
            </div>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-gray-500 italic">
                <p>No cooking instructions available for this recipe.</p>
                <p className="mt-2 text-sm">
                  This recipe is from Edamam API which provides ingredients but not detailed cooking instructions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail; 