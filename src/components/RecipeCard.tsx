import React from 'react';
import { Clock, Users, MapPin, Eye } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      className="recipe-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border border-gray-200"
      onClick={() => onClick(recipe)}
    >
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=Recipe+Image';
          }}
        />
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
          <Eye className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          {recipe.prepTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.prepTime}</span>
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
              <span>{recipe.cuisine}</span>
            </div>
          )}
        </div>
        
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Ingredients:</p>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <span 
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {ingredient.split(' ').slice(0, 3).join(' ')}
                  {ingredient.split(' ').length > 3 ? '...' : ''}
                </span>
              ))}
              {recipe.ingredients.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  +{recipe.ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard; 