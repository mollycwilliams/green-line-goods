import { useState } from 'react';
import './App.css';

function App() {
  // current meal
  const [currentMeal, setCurrentMeal] = useState<any>(null);
  // current list of user's liked meals
  const [meals, setMeals] = useState<Record<string, boolean>>({});
  // current list of user's needed groceries
  const [groceries, setGroceries] = useState<Record<string, string>>({});
  // current meal image
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  // current youtube video, tutorial on how to make the meal
  const [currentVideo, setCurrentVideo] = useState<string | URL | undefined>(undefined);
  // the source for the current meal
  const [currentSource, setCurrentSource] = useState<string | URL | undefined>(undefined);

  // gets a random meal
  const randomMeal = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      if (response.ok) {
        const mealData = await response.json();
        // update current meal image to the new url
        setCurrentMeal(mealData);
        // update the current image
        setCurrentImage(`${mealData.meals[0].strMealThumb}/preview`);
        // update the current video URL
        setCurrentVideo(mealData.meals[0].strYoutube);
        // update the current source URL
        setCurrentSource(mealData.meals[0].strSource);
      } else {
        console.error("Failed to fetch meal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // handle when the user presses the like button
  const like = async () => {
    if (!currentMeal) return;

    // add the meal to the list of liked meals
    repopulateMeals();
    // add the ingredients of the liked meal to the grocery list
    repopulateList();
    // generate a new random meal image
    randomMeal();
  };

  // repopulate the current list of groceries
  const repopulateList = () => {
    const newGroceries = { ...groceries };
    const meals = currentMeal.meals[0];

    // add each ingredient and its quantity to the grocery list
    for (let i = 1; i <= 20; i++) {
      const ingredient = meals[`strIngredient${i}`];
      const measure = meals[`strMeasure${i}`];

      // ensure the ingredient exists
      if (ingredient && ingredient.trim() !== "") {
        if (newGroceries[ingredient]) {
          // if ingredient already exists, append the new measure
          newGroceries[ingredient] = newGroceries[ingredient] + " + " + measure;
        } else {
          // if ingredient doesn't exist, set it with the current measure
          newGroceries[ingredient] = measure;
        }
      }
    }

    // update the groceries state
    setGroceries(newGroceries);
  };

  // repopulate the current list of liked meals
  const repopulateMeals = () => {
    setMeals((prevMeals: any) => ({
      ...prevMeals,
      [currentMeal.meals[0].strMeal]: true,
    }));
  };

  // generate a list of the current groceries
  const generateList = () => {
    // your implementation
  };

  // resets the list of current groceries 
  const resetList = () => {
    setGroceries({});
  };

  // resets the list of currently liked meals 
  const resetMeals = () => {
    setMeals({});
  };

  // plays the youtube video for the current meal's recipe
  const openVideo = () => {
    window.open(currentVideo, '_blank');
  };

  // opens the link to the current source of the meal recipe
  const openSource = () => {
    window.open(currentSource, '_blank');
  }

  return (
      <nav id="desktop-nav">
        <div className="title">
          <h1>Green Line Goods</h1>
        </div>
        <button className="reset-list" onClick={resetList}>
          Reset List
        </button>
        <div className="list-button-container">
          <button className="generate-list" onClick={generateList}>
            Generate Grocery List
          </button>
          <button className="view-recipe-video" onClick={openVideo}>
            View Recipe Video
          </button>
          <button className="view-recipe-source" onClick={openSource}>
            View Recipe Source
          </button>
          <button className="reset-meals" onClick={resetMeals}>
            Reset Meals
          </button>
        </div>
        <h1>currentMealName</h1>
        <div className="swipe-screen-container">
          <div className="meals-container">
            <h2>Liked Meals</h2>
            <ul>
              {Object.keys(meals).map((meal, index) => (
                // renders each meal as an item
                <li key={index}>{meal}</li>
              ))}
            </ul>
          </div>
          <div className="image-display-container">
            {currentImage && <img src={currentImage} alt="Random Meal" />}
          </div>
          <div className="ingredients-container">
            <h2>Ingredients</h2>
            <ul>
              {Object.entries(groceries).map(([ingredient, measure], index) => (
                // renders each ingredient with its measure as an item
                <li key={index}>{`${ingredient}: ${measure}`}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="buttons-container">
          <button className="dislike" onClick={randomMeal}>
            <img src="./assets/x.png" alt="dislike" />
          </button>
          <button className="like" onClick={like}>
            <img src="./assets/like.png" alt="like" />
          </button>
        </div>
      </nav>
  );
};

export default App;
