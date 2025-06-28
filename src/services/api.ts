import axios from 'axios';
import { Recipe, ApiResponse } from '../types';

// API Configuration
const EDAMAM_APP_ID = process.env.REACT_APP_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.REACT_APP_EDAMAM_APP_KEY;
const MEALDB_API_KEY = process.env.REACT_APP_MEALDB_API_KEY || '1'; // Free tier

const edamamApi = axios.create({
  baseURL: 'https://api.edamam.com/api/recipes/v2',
});

const mealDbApi = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1',
});

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    // Try Edamam API first only if credentials are available
    if (EDAMAM_APP_ID && EDAMAM_APP_KEY && 
        EDAMAM_APP_ID !== 'your_edamam_app_id' && 
        EDAMAM_APP_KEY !== 'your_edamam_app_key') {
      try {
        const edamamResponse = await edamamApi.get<ApiResponse>('', {
          params: {
            type: 'public',
            q: query,
            app_id: EDAMAM_APP_ID,
            app_key: EDAMAM_APP_KEY,
            random: true,
          },
        });

        if (edamamResponse.data.hits && edamamResponse.data.hits.length > 0) {
          return edamamResponse.data.hits.map((hit) => ({
            id: hit.recipe.uri.split('#')[1] || hit.recipe.uri,
            title: hit.recipe.label,
            image: hit.recipe.image,
            ingredients: hit.recipe.ingredientLines,
            instructions: [], // Edamam doesn't provide instructions
            servings: hit.recipe.yield,
            prepTime: hit.recipe.totalTime ? `${hit.recipe.totalTime} min` : undefined,
            cuisine: hit.recipe.cuisineType?.[0],
            tags: [...(hit.recipe.dietLabels || []), ...(hit.recipe.healthLabels || [])],
          }));
        }
      } catch (edamamError) {
        console.log('Edamam API failed, falling back to MealDB:', edamamError);
      }
    }

    // Fallback to MealDB API
    console.log('Searching MealDB API for:', query);
    const mealDbResponse = await mealDbApi.get<ApiResponse>(`/${MEALDB_API_KEY}/search.php`, {
      params: { s: query },
    });

    console.log('MealDB response:', mealDbResponse.data);

    if (mealDbResponse.data.meals && mealDbResponse.data.meals.length > 0) {
      return mealDbResponse.data.meals.map((meal) => {
        const ingredients: string[] = [];
        const instructions = meal.strInstructions
          ? meal.strInstructions.split('\n').filter((step) => step.trim())
          : [];

        // Extract ingredients from MealDB response
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}` as keyof typeof meal] as string;
          const measure = meal[`strMeasure${i}` as keyof typeof meal] as string;
          
          if (ingredient && ingredient.trim()) {
            const ingredientText = measure && measure.trim() 
              ? `${measure.trim()} ${ingredient.trim()}`
              : ingredient.trim();
            ingredients.push(ingredientText);
          }
        }

        return {
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          ingredients,
          instructions,
          cuisine: meal.strArea,
          tags: meal.strTags ? meal.strTags.split(',') : [],
        };
      });
    }

    return [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string, source: 'edamam' | 'mealdb' = 'mealdb'): Promise<Recipe | null> => {
  try {
    if (source === 'edamam' && EDAMAM_APP_ID && EDAMAM_APP_KEY && 
        EDAMAM_APP_ID !== 'your_edamam_app_id' && 
        EDAMAM_APP_KEY !== 'your_edamam_app_key') {
      try {
        const response = await edamamApi.get<ApiResponse>(`/${id}`, {
          params: {
            type: 'public',
            app_id: EDAMAM_APP_ID,
            app_key: EDAMAM_APP_KEY,
          },
        });

        if (response.data.hits && response.data.hits.length > 0) {
          const hit = response.data.hits[0];
          return {
            id: hit.recipe.uri.split('#')[1] || hit.recipe.uri,
            title: hit.recipe.label,
            image: hit.recipe.image,
            ingredients: hit.recipe.ingredientLines,
            instructions: [],
            servings: hit.recipe.yield,
            prepTime: hit.recipe.totalTime ? `${hit.recipe.totalTime} min` : undefined,
            cuisine: hit.recipe.cuisineType?.[0],
            tags: [...(hit.recipe.dietLabels || []), ...(hit.recipe.healthLabels || [])],
          };
        }
      } catch (edamamError) {
        console.log('Edamam API failed:', edamamError);
      }
    }

    // Default to MealDB API
    const response = await mealDbApi.get<ApiResponse>(`/${MEALDB_API_KEY}/lookup.php`, {
      params: { i: id },
    });

    if (response.data.meals && response.data.meals.length > 0) {
      const meal = response.data.meals[0];
      const ingredients: string[] = [];
      const instructions = meal.strInstructions
        ? meal.strInstructions.split('\n').filter((step) => step.trim())
        : [];

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}` as keyof typeof meal] as string;
        const measure = meal[`strMeasure${i}` as keyof typeof meal] as string;
        
        if (ingredient && ingredient.trim()) {
          const ingredientText = measure && measure.trim() 
            ? `${measure.trim()} ${ingredient.trim()}`
            : ingredient.trim();
          ingredients.push(ingredientText);
        }
      }

      return {
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        ingredients,
        instructions,
        cuisine: meal.strArea,
        tags: meal.strTags ? meal.strTags.split(',') : [],
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    return null;
  }
}; 