import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // current meal
  const [currentMeal, setCurrentMeal] = useState<any>(null);
  // current list of user's liked meals
  const [meals, setMeals] = useState<Record<string, string>>({});
  // current list of sources for user's liked meals
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
        setCurrentImage(`${mealData.meals[0].strMealThumb}`);
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

    // Load a random meal on startup
    useEffect(() => {
      randomMeal();
    }, []);
  

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
  const repopulateList = async () => {
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

  // repopulate the current list of liked meals, as well as sources
  const repopulateMeals = async () => {
    setMeals((prevMeals: any) => ({
      ...prevMeals,
      [currentMeal.meals[0].strMeal]: currentMeal.meals[0].strSource,
    }));
  };

  // generate a list of the current groceries, to a new (child) page
  const generateList = async () => {
    // create a string that holds the current list of ingredients
    const listContent = Object.entries(groceries)
    .map(([ingredient, measure]) => `<li>${ingredient}: ${measure}</li>`)
    .join("");

    // open the new window
    const newWindow = window.open("", "_blank");
    // html for new window
    newWindow?.document.write(`
      <html>
        <head>
          <title>Grocery List</title>
          <style>
            body {font-family: "Poppins", sans-serif; 
            background-color: #1f1d20;
            justify-content: center;}
            h3 {display: flex; color: rgb(255, 255, 255);
            filter: drop-shadow(1px 1px 0.5px #008456);}
            p {font-family: "Poppins", sans-serif; color: rgb(255, 255, 255);
            filter: drop-shadow(1.5px 1.5 px 0.5px #008456);}
            li:hover{color: #a3a3a3;}
            .logo-container {display: flex; justify-content:center; align-items: center; margin-bottom:10px;}
            .logo-container img {width: 150px; height:auto;}
            ::selection {background-color: #008456; color: #ffffff;}
            ::-webkit-scrollbar{width 12px;}
            ::-webkit-scrollbar-track{box-shadow: inset 0 0 5px #008456;
            border-radius: 6px;}
            ::-webkit-scrollbar-thumb{background: #008456; border-radius: 6px;}
            ::-webkit-scrollbar-thumb:hover{background:}
          </style>
        </head>
        <body>
          <div class="logo-container">
            <img src="/public/glg_logo.png"></img>
          </div>
          <h3>Grocery List<h3>
          <ul>${listContent}</ul>
        </body>
      </html>
      `);
  };

  // resets the list of currently liked meals and groceries 
  const resetMeals = async () => {
    setMeals({});
    setGroceries({});
  };

  // plays the youtube video for the current meal's recipe
  const openVideo = async () => {
    window.open(currentVideo, '_blank');
  };

  // opens the link to the current source of the meal recipe
  const openSource = async () => {
    window.open(currentSource, '_blank');
  };

  // save meals for the current user
  const saveMeals = async () => {
    localStorage.setItem("meals", JSON.stringify(meals));
    localStorage.setItem("groceries", JSON.stringify(groceries));
    alert("Successfully saved meals and groceries.");
  };

  // load meals for the current user
  const loadMeals = async () => {
    const loadedMeals = localStorage.getItem("meals");
    const loadedGroceries = localStorage.getItem("groceries");

    // check if successful (not null)
    if(loadedMeals && loadedGroceries) {
      // parse each JSON with saved contents, and set current meals / groceries 
      setMeals(JSON.parse(loadedMeals));
      setGroceries(JSON.parse(loadedGroceries));
      alert("Successfully loaded meals and groceries");
    } else {
      alert("Requested data not found.");
    }
  };

  // clears all saved data (meals/groceries)
  const clearData = async () => {
    localStorage.clear();
  };

    // app html
    return (
      <nav id="desktop-nav">
        <div className="logo-container">
          <img src="src/assets/glg_logo.png"></img>
        </div>
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
          <button className="save-meals" onClick={saveMeals}>
            Save Meals
          </button>
          <button className="load-meals" onClick={loadMeals}>
            Load Meals
          </button>
          <button className="clear-data" onClick={clearData}>
            Clear Data
          </button>
        </div>
        <div className="swipe-screen-container">
          <div className="meals-container">
            <h2>Liked Meals</h2>
            <ul>
            {Object.entries(meals).map(([mealName, source], index) => (
                // renders each meal as a clickable name
                <li key={index}><a href={source}>{mealName}</a></li>
              ))}
            </ul>
          </div>
          <div className="image-display-container">
            <div className="dishnames">
              <h1>{currentMeal?.meals?.[0]?.strMeal || "Loading..."}</h1>
            </div>
            {currentImage && <img className="random-meal-img" src={currentImage} alt="Random Meal" />}
            <div className="buttons-container">
              <button className="dislike" onClick={randomMeal}>
                <img src="/src/assets/x.png" alt="dislike" />
              </button>
              <button className="like" onClick={like}>
                <img src="/src/assets/like.png" alt="like" />
              </button>
            </div>
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
      </nav>
      );
    };

export default App;
