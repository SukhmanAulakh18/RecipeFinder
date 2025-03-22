import { Search } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { getRandomColor } from "../lib/utils";

const HomePage = () => {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchRecipes = async (searchQuery) => {
		setLoading(true);
		setRecipes([]);
		try {
			// Using TheMealDB API which has a free tier
			const res = await fetch(
				`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
			);
			const data = await res.json();
			
			// Transform data to match your expected format
			const formattedRecipes = data.meals ? data.meals.map(meal => ({
				recipe: {
					label: meal.strMeal,
					image: meal.strMealThumb,
					source: "TheMealDB",
					url: meal.strSource || `https://www.themealdb.com/meal/${meal.idMeal}`,
					yield: 4, // Default value as MealDB doesn't provide servings
					ingredientLines: getIngredients(meal),
					calories: 0, // MealDB doesn't provide calorie info
					cuisineType: [meal.strArea || "International"],
					mealType: [meal.strCategory || "Main Course"],
					healthLabels: ["Balanced", "Heart-Healthy"] // Default values
				}
			})) : [];
			
			setRecipes(formattedRecipes);
			console.log(formattedRecipes);
		} catch (error) {
			console.log(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Helper function to extract ingredients from MealDB format
	const getIngredients = (meal) => {
		const ingredients = [];
		for (let i = 1; i <= 20; i++) {
			const ingredient = meal[`strIngredient${i}`];
			const measure = meal[`strMeasure${i}`];
			
			if (ingredient && ingredient.trim() !== '') {
				ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
			}
		}
		return ingredients;
	};

	useEffect(() => {
		fetchRecipes("chicken");
	}, []);

	const handleSearchRecipe = (e) => {
		e.preventDefault();
		fetchRecipes(e.target[0].value);
	};

	return (
		<div className='bg-[#faf9fb] p-10 flex-1'>
			<div className='max-w-screen-lg mx-auto'>
				<form onSubmit={handleSearchRecipe}>
					<label className='input shadow-md flex items-center gap-2'>
						<Search size={"24"} />
						<input
							type='text'
							className='text-sm md:text-md grow'
							placeholder='What do you want to cook today?'
						/>
					</label>
				</form>

				<h1 className='font-bold text-3xl md:text-5xl mt-4'>Recommended Recipes</h1>
				<p className='text-slate-500 font-semibold ml-1 my-2 text-sm tracking-tight'>Popular choices</p>

				<div className='grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
					{!loading && recipes && recipes.length > 0 &&
						recipes.map(({ recipe }, index) => (
							<RecipeCard key={index} recipe={recipe} {...getRandomColor()} />
						))}

					{!loading && (!recipes || recipes.length === 0) && (
						<div className="col-span-full text-center py-10">
							<p className="text-lg font-medium">No recipes found. Try a different search term.</p>
						</div>
					)}

					{loading &&
						[...Array(9)].map((_, index) => (
							<div key={index} className='flex flex-col gap-4 w-full'>
								<div className='skeleton h-32 w-full'></div>
								<div className='flex justify-between'>
									<div className='skeleton h-4 w-28'></div>
									<div className='skeleton h-4 w-24'></div>
								</div>
								<div className='skeleton h-4 w-1/2'></div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};
export default HomePage;