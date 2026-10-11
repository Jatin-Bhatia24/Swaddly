

const search_form = document.getElementById("search_form");
const recipie = document.getElementById("recipie_name");
const result_message = document.getElementById("result_message");
const recipiesection = document.querySelector(".recipiesection");

const main_ui = document.querySelector(".main-ui");
const recipie_page_conatiner = document.querySelector(".recipie-page-conatiner");
const recipie_page = document.querySelector(".recipie-page");
const close_btn = document.getElementById("close");

const dish_image = document.getElementById("image");
const dish_name = document.getElementById("dish_name");
const dish_area = document.getElementById("dish_area");
const tutorial_link = document.getElementById("wathc_tutorial");
const ingredients_list = document.getElementById("ingredients_list");
const instructions = document.querySelector(".instructions");

const subscribe_form = document.getElementById("division");
const email = document.getElementById("email");

const DEFAULT_SEARCH = "sweet"; 
let lastScrollY = 0;             
let latestSearchId = 0;          




search_form.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const recipie_name = recipie.value.trim();

    if (recipie_name === "") {
        result_message.textContent = "Please type a dish name to search.";
        recipie.focus();
        return;
    }

    searchRecipie(recipie_name);

});


async function searchRecipie(recipie_name, isDefault = false) {
    const searchId = ++latestSearchId;

    result_message.textContent = "Searching for recipes...";
    recipiesection.innerHTML = "";

    try {
        const api_url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(recipie_name)}`;
        const response = await fetch(api_url);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

    
        if (searchId !== latestSearchId) return;

        if (!data.meals) {
            result_message.textContent =
                `No recipes found for “${recipie_name}”. Try a different dish name.`;
            return;
        }

        const count = data.meals.length;
        const label = count === 1 ? "recipe" : "recipes";

        result_message.textContent = isDefault
            ? "Popular recipes to get you started"
            : `${count} ${label} found for “${recipie_name}”`;

        data.meals.forEach((meal) => {
            recipiesection.appendChild(createCard(meal));
        });

    } catch (error) {
        if (searchId !== latestSearchId) return;
        console.error(error);
        result_message.textContent =
            "We couldn't load recipes right now. Please check your connection and try again.";
    }
}



function createCard(meal) {
    const card = document.createElement("div");
    card.className = "recipie";

    const img = document.createElement("img");
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    img.loading = "lazy";

    const title = document.createElement("h2");
    title.textContent = meal.strMeal;

    const info = document.createElement("p");
    info.textContent = `${meal.strCategory} • ${meal.strArea}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "view_recipie";
    button.textContent = "View Recipe";
    button.addEventListener("click", () => showRecipie(meal));

    card.append(img, title, info, button);
    return card;
}



function showRecipie(meal) {
    dish_image.src = meal.strMealThumb;
    dish_image.alt = meal.strMeal;
    dish_name.textContent = meal.strMeal;
    dish_area.textContent = `${meal.strArea} cuisine`;

    
    if (meal.strYoutube && meal.strYoutube.trim() !== "") {
        tutorial_link.href = meal.strYoutube;
        tutorial_link.classList.remove("hidden");
    } else {
        tutorial_link.removeAttribute("href");
        tutorial_link.classList.add("hidden");
    }

    ingredients_list.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            const li = document.createElement("li");
            const amount = measure && measure.trim() !== "" ? ` - ${measure.trim()}` : "";
            li.textContent = `${ingredient.trim()}${amount}`;
            ingredients_list.appendChild(li);
        }
    }

    instructions.textContent = meal.strInstructions || "No instructions available for this recipe.";

    openRecipiePage();
}


function openRecipiePage() {
    lastScrollY = window.scrollY;
    main_ui.classList.add("inactive");
    recipie_page_conatiner.classList.add("active");
    recipie_page.scrollTop = 0;
    window.scrollTo(0, 0);
    close_btn.focus();
}


function closeRecipiePage() {
    recipie_page_conatiner.classList.remove("active");
    main_ui.classList.remove("inactive");
    window.scrollTo(0, lastScrollY); 
}


close_btn.addEventListener("click", closeRecipiePage);


document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && recipie_page_conatiner.classList.contains("active")) {
        closeRecipiePage();
    }
});



subscribe_form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email_value = email.value.trim();

    if (email_value === "" || !email.checkValidity()) {
        email.focus();
        email.reportValidity();
        return;
    }

    email.value = "";
    alert("Thanks for subscribing! Your first recipe email is on its way.");
});



searchRecipie(DEFAULT_SEARCH, true);
