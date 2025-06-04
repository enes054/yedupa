const meals = [];

const mealForm = document.getElementById('mealForm');
const mealList = document.querySelector('.meals');
const totalCaloriesEl = document.getElementById('totalCalories');

mealForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('mealName').value;
    const calories = parseInt(document.getElementById('mealCalories').value, 10);
    const protein = parseInt(document.getElementById('mealProtein').value, 10);
    const carbs = parseInt(document.getElementById('mealCarbs').value, 10);
    const fat = parseInt(document.getElementById('mealFat').value, 10);

    const meal = { name, calories, protein, carbs, fat };
    meals.push(meal);
    renderMeals();
    mealForm.reset();
});

function renderMeals() {
    mealList.innerHTML = '';
    let totalCalories = 0;
    meals.forEach(meal => {
        totalCalories += meal.calories;
        const li = document.createElement('li');
        li.className = 'meal-item';
        li.innerHTML = `
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80" alt="${meal.name}">
            <div>
                <strong>${meal.name}</strong><br>
                ${meal.calories} kcal - P:${meal.protein}g K:${meal.carbs}g Y:${meal.fat}g
            </div>
        `;
        mealList.appendChild(li);
    });
    totalCaloriesEl.textContent = totalCalories;
    updateChart();
}

const ctx = document.getElementById('calorieChart').getContext('2d');
const calorieChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        datasets: [{
            label: 'Kalori',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#4f46e5'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart() {
    const today = new Date().getDay(); // 0-6
    calorieChart.data.datasets[0].data[today === 0 ? 6 : today - 1] = parseInt(totalCaloriesEl.textContent, 10);
    calorieChart.update();
}
